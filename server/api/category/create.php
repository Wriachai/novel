<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
        http_response_code(201); // set response code - 201 Created
        echo json_encode(array("message" => "Category was created."));
    } else {
        http_response_code(503); // set response code - 503 Service Unavailable
        echo json_encode(array("message" => "Unable to create category."));
    }
} else {
    http_response_code(400); // set response code - 400 Bad Request
    echo json_encode(array("message" => "Unable to create category. Data is incomplete."));
}
?>