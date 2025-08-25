<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET"); // Search is typically a GET request
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

$keywords = isset($_GET['search']) ? $_GET['search'] : '';

if (!empty($keywords)) {
    $stmt = $novel->search($keywords);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $novels_arr = array();
        $novels_arr["records"] = array();

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
            array_push($novels_arr["records"], $novel_item);
        }

        // set response code - 200 OK
        http_response_code(200);
        // show novels in JSON format
        echo json_encode($novels_arr);
    } else {
        // set response code - 404 Not found
        http_response_code(404);
        // tell the user no novels found
        echo json_encode(array("message" => "No novels found matching your search."));
    }
} else {
    // set response code - 400 Bad Request
    http_response_code(400);
    // tell the user keywords were not provided
    echo json_encode(array("message" => "Please provide search keywords (e.g., ?s=keyword)."));
}
