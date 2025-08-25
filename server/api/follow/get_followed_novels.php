<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/database.php';
include_once '../../models/Follow.php';

$database = new Database();
$db = $database->getConnection();
$follow = new Follow($db);

if (!empty($_GET['user_id'])) {
    $follow->user_id = $_GET['user_id'];

    $stmt = $follow->getFollowedNovels();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $novels_arr = [];
        $novels_arr["records"] = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $novel_item = [
                "novel_id" => $novel_id,
                "title" => $title,
                "cover_image_url" => $cover_image_url,
                "updated_at" => $updated_at
            ];
            array_push($novels_arr["records"], $novel_item);
        }

        http_response_code(200); // OK
        echo json_encode($novels_arr);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "No followed novels found for this user."]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Unable to get followed novels. user_id is required."]);
}
?>
