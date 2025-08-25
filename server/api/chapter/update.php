<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Chapter.php';

$database = new Database();
$db = $database->getConnection();

$chapter = new Chapter($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->novel_id) &&
    !empty($data->chapter_number) &&
    !empty($data->title) &&
    isset($data->content)
) {
    $chapter->novel_id = $data->novel_id;
    $chapter->chapter_number = $data->chapter_number;
    $chapter->title = $data->title;
    $chapter->content = $data->content;

    if ($chapter->update()) {
        http_response_code(200);
        echo json_encode(["message" => "Chapter was updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update chapter."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to update chapter. Data is incomplete. Required fields: novel_id, chapter_number, title, content."]);
}
?>