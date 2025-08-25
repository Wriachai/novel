<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Follow.php';

$database = new Database();
$db = $database->getConnection();
$follow = new Follow($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->novel_id)) {
    $follow->user_id = $data->user_id;
    $follow->novel_id = $data->novel_id;

    if ($follow->follow()) {
        http_response_code(201); // Created
        echo json_encode(["message" => "Successfully followed the novel."]);
    } else {
        http_response_code(503); // Service Unavailable
        echo json_encode(["message" => "Unable to follow novel. You might be following it already."]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Unable to follow novel. Data is incomplete."]);
}
?>
