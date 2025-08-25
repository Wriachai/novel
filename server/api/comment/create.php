<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();

$comment = new Comment($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->novel_id) &&
    isset($data->content)
) {
    $comment->user_id = $data->user_id;
    $comment->novel_id = $data->novel_id;
    $comment->content = $data->content;
    
    $comment->chapter_number = $data->chapter_number ?? null;
    $comment->parent_comment_id = $data->parent_comment_id ?? null;

    if ($comment->create()) {
        http_response_code(201);
        echo json_encode(["message" => "Comment was created."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to create comment."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to create comment. Data is incomplete. Required fields: user_id, novel_id, content."]);
}
?>