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

// อ่านนิยายตาม pagination
$stmt = $novel->read($limit, $offset);
$num = $stmt->rowCount();

// นับจำนวนทั้งหมด
$stmtTotal = $novel->countAll();
$totalRecords = $stmtTotal->fetchColumn();
$totalPages = ceil($totalRecords / $limit);

if ($num > 0) {
    $novel_arr = array();
    $novel_arr["records"] = array();
    $novel_arr["totalRecords"] = (int)$totalRecords;
    $novel_arr["totalPages"] = (int)$totalPages;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $novel_item = array(
            "novel_id" => $novel_id,
            "user_id" => $user_id,
            "title" => $title,
            "translator_name" => $translator_name,
            "description" => $description,
            "cover_image_url" => $cover_image_url,
            "status" => $status,
            "view_count" => (int)$view_count,
            "chapter_count" => (int)$chapter_count,
            "display_name" => $display_name,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );

        array_push($novel_arr["records"], $novel_item);
    }

    http_response_code(200);
    echo json_encode($novel_arr);
} else {
    $novel_arr = array(
        "records" => [],
        "totalRecords" => (int)$totalRecords,
        "totalPages" => (int)$totalPages,
        "message" => "No novels found."
    );
    http_response_code(200);
    echo json_encode($novel_arr);
}
