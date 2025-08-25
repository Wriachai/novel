<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();

$comment = new Comment($db);

$comment->novel_id = isset($_GET['novel_id']) ? (int)$_GET['novel_id'] : 0;
$comment->chapter_number = isset($_GET['chapter_number']) ? (int)$_GET['chapter_number'] : null;

if ($comment->novel_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Unable to read comments. novel_id is required."]);
    return;
}

$stmt = $comment->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $comments_arr = [];
    $comments_arr["records"] = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $comment_item = [
            "comment_id" => (int)$comment_id,
            "user_id" => (int)$user_id,
            "parent_comment_id" => is_null($parent_comment_id) ? null : (int)$parent_comment_id,
            "content" => $content,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
            "display_name" => $display_name
        ];
        array_push($comments_arr["records"], $comment_item);
    }

    http_response_code(200);
    echo json_encode($comments_arr);
} else {
    http_response_code(404);
    echo json_encode(["message" => "No comments found."]);
}
?>