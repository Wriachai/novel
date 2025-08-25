<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Category.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->category_id)) {

    $category->category_id = $data->category_id;
    try {
        if ($category->delete()) {
            http_response_code(200); // 200 OK
            echo json_encode(array("message" => "Category was deleted."));
        } else {
            http_response_code(503); // 503 Service Unavailable
            echo json_encode(array("message" => "Unable to delete category."));
        }
    } catch (PDOException $e) {
        if ($e->getCode() == '23000') {
            http_response_code(409); // 409 Conflict
            echo json_encode(
                array("message" => "Unable to delete category. It is still in use by one or more novels.")
            );
        } else {
            http_response_code(503); // 503 Service Unavailable
            echo json_encode(
                array("message" => "Database error: " . $e->getMessage())
            );
        }
    }
} else {
    http_response_code(400); // 400 Bad Request
    echo json_encode(array("message" => "Unable to delete category. Data is incomplete."));
}
?>