<?php
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "novel_secret_key";

function authCheck() {
    global $secret_key;
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "No token provided"]);
        exit;
    }

    $jwt = str_replace("Bearer ", "", $headers['Authorization']);

    try {
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));

        // ตรวจสอบหมดอายุ
        if ($decoded->exp < time()) {
            http_response_code(401);
            echo json_encode(["message" => "Token expired"]);
            exit;
        }

        return $decoded->data; // เช่น user_id, email, role
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit;
    }
}
