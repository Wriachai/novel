<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    $user->password = $data->password;

    if ($user->login()) {
        $user_data = [
            "user_id" => (int)$user->user_id,
            "display_name" => $user->display_name,
            "email" => $user->email,
            "role" => $user->role
        ];

        http_response_code(200); // OK
        echo json_encode([
            "message" => "Login successful.",
            "user" => $user_data
        ]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Login failed. Invalid credentials."]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Login failed. Data is incomplete."]);
}
?>
