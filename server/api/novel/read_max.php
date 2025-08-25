<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$offset = ($page - 1) * $limit;

$stmt = $novel->readMax($limit, $offset);
$num = $stmt->rowCount();

if ($num > 0) {
    $novel_arr = array();
    $novel_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $novel_item = array(
            "novel_id" => $novel_id,
            "user_id" => $user_id,
            "title" => $title,
            "author_name" => $author_name,
            "translator_name" => $translator_name,
            "description" => $description,
            "cover_image_url" => $cover_image_url,
            "status" => $status,
            "view_count" => $view_count,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );
        array_push($novel_arr["records"], $novel_item);
    }

    http_response_code(200); // set response code - 200 OK
    echo json_encode($novel_arr); // show categories in JSON format
} else {
    http_response_code(404); // set response code - 404 Not found
    echo json_encode(array("message" => "No categories found."));
}
?>
