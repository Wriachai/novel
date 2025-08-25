<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->novel_id) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->status) &&
    isset($data->categories) && is_array($data->categories)
) {
    $novel->novel_id = $data->novel_id;

    $novel->title = $data->title;
    $novel->author_name = $data->author_name;
    $novel->translator_name = $data->translator_name;
    $novel->description = $data->description;
    $novel->cover_image_url = $data->cover_image_url;
    $novel->status = $data->status;

    $novel->categories = $data->categories;

    if ($novel->update()) {
        // Set response code - 200 OK
        http_response_code(200);
        // Send success message
        echo json_encode(array("message" => "Novel was updated."));
    } else {
        // Set response code - 503 Service Unavailable
        http_response_code(503);
        // Send error message
        echo json_encode(array("message" => "Unable to update novel."));
    }
} else {
    // Set response code - 400 Bad Request
    http_response_code(400);
    // Send error message for incomplete data
    echo json_encode(array("message" => "Unable to update novel. Data is incomplete."));
}
?>