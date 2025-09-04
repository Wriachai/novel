<?php
// อนุญาตทุก origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ตอบ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// include database & model
include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();
$novel = new Novel($db);

$data = json_decode(file_get_contents("php://input"));

// ตรวจสอบข้อมูลครบ
if (
    !empty($data->novel_id) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->status) &&
    isset($data->categories) &&
    is_array($data->categories)
) {
    // โหลดข้อมูลเก่ามาก่อน
    $novel->novel_id = $data->novel_id;
    $oldNovel = $novel->readOne(true);

    // ถ้ามี cover เดิม และส่งมาใหม่ → ลบไฟล์เก่า
    if ($oldNovel && !empty($oldNovel['cover_image_url']) 
        && $oldNovel['cover_image_url'] !== $data->cover_image_url) {
        $oldFile = "../../uploads/" . basename($oldNovel['cover_image_url']);
        if (file_exists($oldFile)) {
            unlink($oldFile);
        }
    }

    // เซ็ตค่าที่ต้องการอัปเดต
    $novel->title = $data->title;
    $novel->author_name = $data->author_name;
    $novel->translator_name = $data->translator_name;
    $novel->description = $data->description;
    $novel->cover_image_url = $data->cover_image_url;
    $novel->status = $data->status;
    $novel->categories = $data->categories;

    if ($novel->update()) {
        http_response_code(200);
        echo json_encode(["message" => "Novel was updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update novel."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to update novel. Data is incomplete."]);
}
