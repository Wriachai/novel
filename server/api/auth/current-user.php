<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

require_once 'authCheck.php';

$userData = authCheck(); // ดึงข้อมูลจาก JWT

if (isset($_GET['role']) && $userData->role !== $_GET['role']) {
    http_response_code(403); // Forbidden
    echo json_encode(["message" => "Access denied"]);
    exit;
}

echo json_encode([
    "user" => $userData
]);
