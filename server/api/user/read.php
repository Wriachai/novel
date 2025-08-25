<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$stmt = $user->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $users_arr = [];
    $users_arr["records"] = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $user_item = [
            "user_id" => $user_id,
            "firstname" => $firstname,
            "lastname" => $lastname,
            "email" => $email,
            "display_name" => $display_name,
            "role" => $role,
            "status" => $status,
            "created_at" => $created_at
        ];
        array_push($users_arr["records"], $user_item);
    }

    http_response_code(200); // OK
    echo json_encode($users_arr);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "No users found."]);
}
?>
