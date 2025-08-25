<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Category.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

$stmt = $category->read($limit, $offset);
$num = $stmt->rowCount();

if ($num > 0) {
    $categories_arr = array();
    $categories_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $category_item = array(
            "category_id" => $category_id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );
        array_push($categories_arr["records"], $category_item);
    }

    http_response_code(200); // set response code - 200 OK
    echo json_encode($categories_arr); // show categories in JSON format
} else {
    http_response_code(404); // set response code - 404 Not found
    echo json_encode(array("message" => "No categories found."));
}
?>
