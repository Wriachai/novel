<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();

$comment = new Comment($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->comment_id)) {
    $comment->comment_id = $data->comment_id;

    if ($comment->delete()) {
        http_response_code(200);
        echo json_encode(["message" => "Comment was deleted."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to delete comment. It might not exist."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to delete comment. Data is incomplete. comment_id is required."]);
}
?>