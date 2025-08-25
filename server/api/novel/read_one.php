<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Novel.php';

$database = new Database();
$db = $database->getConnection();

$novel = new Novel($db);

if (!isset($_GET['novel_id'])) {
    http_response_code(400);
    echo json_encode(array("message" => "Bad Request. novel_id is missing."));
    exit(); // หยุดการทำงานทันที
}

$novel->novel_id = $_GET['novel_id'];

$novel->readOne();

if ($novel->title != null) {
    $novel_arr = array(
        "novel_id" => $novel->novel_id,
        "title" => $novel->title,
        "author_name" => $novel->author_name,
        "translator_name" => $novel->translator_name,
        "description" => $novel->description,
        "cover_image_url" => $novel->cover_image_url,
        "status" => $novel->status,
        "view_count" => $novel->view_count,
        "updated_at" => $novel->updated_at,
        "chapter_count" => $novel->chapter_count,
        "categories" => $novel->categories // *** 2. เพิ่ม categories ใน array ***
    );

    // set response code - 200 OK
    http_response_code(200);
    // make it json format
    echo json_encode($novel_arr);
} else {
    // set response code - 404 Not found
    http_response_code(404);
    // tell the user novel does not exist
    echo json_encode(array("message" => "Novel does not exist."));
}
?>