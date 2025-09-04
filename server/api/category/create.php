<?php
// --- CORS headers ---
header("Access-Control-Allow-Origin: *"); // หรือระบุ frontend domain เช่น http://localhost:5173
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // เพิ่ม OPTIONS
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ตอบ preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- ต่อด้วยโค้ดของคุณ ---
include_once '../../config/database.php';
include_once '../../models/Category.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->description)) {
    $category->name = $data->name;
    $category->description = $data->description;
    $category->created_at = date('Y-m-d H:i:s');
    $category->updated_at = date('Y-m-d H:i:s');

    if ($category->create()) {
        http_response_code(201); // 201 Created
        echo json_encode(array("message" => "Category was created."));
    } else {
        http_response_code(503); // 503 Service Unavailable
        echo json_encode(array("message" => "Unable to create category."));
    }
} else {
    http_response_code(400); // 400 Bad Request
    echo json_encode(array("message" => "Unable to create category. Data is incomplete."));
}
