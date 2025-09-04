<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ตอบ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
    !empty($data->content)   // ✅ ต้องเป็น !empty
) {
    $chapter->novel_id = $data->novel_id;
    $chapter->chapter_number = $data->chapter_number;
    $chapter->title = $data->title;
    $chapter->content = $data->content;

    if ($chapter->create()) {
        http_response_code(201);
        echo json_encode(["message" => "Chapter was created."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to create chapter."]);
    }
} else {
    // ❌ ข้อมูลไม่ครบ → ตอบกลับ 400 แทน
    http_response_code(400);
    echo json_encode([
        "message" => "Unable to create chapter. Data is incomplete. Required fields: novel_id, chapter_number, title, content."
    ]);
}
