<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Category.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$data = json_decode(file_get_contents("php://input"));

$category->category_id = $data->category_id;

// set category property values
$category->name = $data->name;
$category->description = $data->description;
$category->updated_at = date('Y-m-d H:i:s');

// update the category
if ($category->update()) {
    http_response_code(200); // set response code - 200 OK
    echo json_encode(array("message" => "Category was updated."));
} else {
    http_response_code(503); // set response code - 503 Service Unavailable
    echo json_encode(array("message" => "Unable to update category."));
}
?>