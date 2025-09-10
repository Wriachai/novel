<?php
require_once '../../config/init.php';

include_once '../../config/database.php';
include_once '../../models/Like.php';

$database = new Database();
$db = $database->getConnection();
$like = new Like($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->novel_id)) {
    $like->user_id = $data->user_id;
    $like->novel_id = $data->novel_id;

    if ($like->isLiked()) {
        http_response_code(200);
        echo json_encode(["liked" => true]);
    } else {
        http_response_code(200);
        echo json_encode(["liked" => false]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ข้อมูลไม่ครบ"]);
}
?>
