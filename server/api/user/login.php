<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../vendor/autoload.php'; // JWT
use Firebase\JWT\JWT;

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// secret key ของ JWT
$secret_key = "novel_secret_key";

function createJWT($user, $secret_key)
{
    $payload = [
        "iss" => "localhost",
        "aud" => "localhost",
        "iat" => time(),
        "exp" => time() + 86400, // หมดอายุ 1 วัน
        "data" => [
            "user_id" => $user->user_id,
            "display_name" => $user->display_name,
            "email" => $user->email,
            "role" => $user->role
        ]
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
}

// --- Google login ---
if (!empty($data->google_token)) {
    $google_token = $data->google_token;
    $google_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $google_token;
    $resp = file_get_contents($google_url);
    $google_user = json_decode($resp);

    if (isset($google_user->email)) {
        $user->email = $google_user->email;

        if ($user->emailExists()) {
            $user->readOneByEmail();
        } else {
            $user->firstname = $google_user->given_name ?? "";
            $user->lastname = $google_user->family_name ?? "";
            $user->display_name = $google_user->name ?? "";
            $user->password = password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
            $user->role = 'user';
            $user->register();
        }

        $token = createJWT($user, $secret_key);

        echo json_encode([
            "message" => "Login successful.",
            "user" => [
                "user_id" => (int)$user->user_id,
                "display_name" => $user->display_name,
                "email" => $user->email,
                "role" => $user->role
            ],
            "token" => $token
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Google token invalid"]);
        exit;
    }
}

// --- Normal login ---
if (!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $user->password = $data->password;

    if ($user->login()) {
        $token = createJWT($user, $secret_key);

        echo json_encode([
            "message" => "Login successful.",
            "user" => [
                "user_id" => (int)$user->user_id,
                "display_name" => $user->display_name,
                "email" => $user->email,
                "role" => $user->role
            ],
            "token" => $token
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Login failed. Invalid credentials."]);
        exit;
    }
}

http_response_code(400);
echo json_encode(["message" => "Login failed. Data is incomplete."]);
