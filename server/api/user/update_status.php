<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && isset($data->status)) {
    $user->user_id = $data->user_id;
    $user->status = $data->status;

    if ($user->updateStatus()) {
        http_response_code(200);
        echo json_encode(["message" => "User status was updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update user status."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to update user status. Data is incomplete."]);
}
?>
