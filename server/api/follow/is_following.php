<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/database.php';
include_once '../../models/Follow.php';

$database = new Database();
$db = $database->getConnection();
$follow = new Follow($db);

if (!empty($_GET['user_id']) && !empty($_GET['novel_id'])) {
    $follow->user_id = $_GET['user_id'];
    $follow->novel_id = $_GET['novel_id'];

    $isFollowing = $follow->isFollowing();

    http_response_code(200); // OK
    echo json_encode(["is_following" => $isFollowing]);

} else {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Unable to check follow status. user_id and novel_id are required."]);
}
?>
