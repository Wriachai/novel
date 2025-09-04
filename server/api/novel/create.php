<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->status) &&
    isset($data->categories) && is_array($data->categories)
) {
    $novel->user_id = $data->user_id;
    $novel->title = $data->title;
    $novel->description = $data->description;
    $novel->status = $data->status;

    $novel->author_name = !empty($data->author_name) ? $data->author_name : null;
    $novel->translator_name = !empty($data->translator_name) ? $data->translator_name : null;
    $novel->cover_image_url = !empty($data->cover_image_url) ? $data->cover_image_url : null;
    $novel->view_count = isset($data->view_count) ? $data->view_count : 0;

    $novel->categories = $data->categories;

    // เรียกใช้ฟังก์ชัน create() เพื่อบันทึกข้อมูล
    if ($novel->create()) {
        http_response_code(201); // 201 Created
        echo json_encode(array(
            "message" => "Novel was created.",
            "novel_id" => $novel->novel_id // ส่ง novel_id ที่เพิ่งสร้างกลับไปด้วย
        ));
    } else {
        http_response_code(503); // 503 Service Unavailable
        echo json_encode(array("message" => "Unable to create novel."));
    }
} else {
    // ถ้าข้อมูลที่ส่งมาไม่ครบ
    http_response_code(400); // 400 Bad Request
    echo json_encode(array("message" => "Unable to create novel. Data is incomplete. Please provide user_id, title, description, status, and categories (as an array)."));
}
