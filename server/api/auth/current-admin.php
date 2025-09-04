<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once 'authCheck.php';

$userData = authCheck(); // ดึงข้อมูลจาก JWT

if ($userData->role !== 'admin') {
    http_response_code(403); // Forbidden
    echo json_encode(["message" => "Access denied: Admins only"]);
    exit;
}

echo json_encode([
    "user" => $userData
]);
