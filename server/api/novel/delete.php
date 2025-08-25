<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->novel_id)) {
    $novel->novel_id = $data->novel_id;

    if ($novel->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Novel was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete novel. It might not exist."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete novel. Data is incomplete. novel_id is required."));
}
?>