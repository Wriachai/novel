<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ตอบ preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// รวมไฟล์ database และ model
include_once '../../config/database.php';
include_once '../../models/User.php';

// สร้าง connection และ object
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// อ่านข้อมูล JSON จาก request body
$data = json_decode(file_get_contents("php://input"));

// ตรวจสอบข้อมูล
if (!empty($data->user_id) && !empty($data->role)) {
    $user->user_id = $data->user_id;
    $user->role = $data->role;

    if ($user->updateRole()) {
        http_response_code(200);
        echo json_encode(["message" => "User role was updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update user role."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to update user role. Data is incomplete."]);
}
?>
