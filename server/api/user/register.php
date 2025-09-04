<?php
// อนุญาตทุก origin ชั่วคราว (production ควรระบุ domain)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ตอบ preflight request (OPTIONS) ก่อน
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// include database และ models ตามปกติ
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->firstname) &&
    !empty($data->lastname) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->display_name)
) {
    $user->firstname = $data->firstname;
    $user->lastname = $data->lastname;
    $user->email = $data->email;
    $user->password = $data->password;
    $user->display_name = $data->display_name;

    if ($user->emailExists()) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "Email already exists."]);
        exit();
    }

    if ($user->register()) {
        http_response_code(201); // Created
        echo json_encode(["message" => "User was created."]);
    } else {
        http_response_code(503); // Service Unavailable
        echo json_encode(["message" => "Unable to create user."]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Unable to create user. Data is incomplete."]);
}
?>
