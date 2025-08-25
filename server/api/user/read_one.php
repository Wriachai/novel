<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

if (!isset($_GET['user_id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Bad Request. user_id is missing."]);
    return;
}

$user->user_id = $_GET['user_id'];

$user->readOne();

if ($user->display_name != null) {
    $user_arr = [
        "user_id" => (int)$user->user_id,
        "firstname" => $user->firstname,
        "lastname" => $user->lastname,
        "email" => $user->email,
        "display_name" => $user->display_name,
        "created_at" => $user->created_at
    ];

    http_response_code(200); // OK
    echo json_encode($user_arr);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "User does not exist."]);
}
?>