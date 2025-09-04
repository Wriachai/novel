<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once 'authCheck.php';

$userData = authCheck();

if ($userData->role !== 'writer') {
    http_response_code(403);
    echo json_encode(["message" => "Access denied: Writers only"]);
    exit;
}

echo json_encode([
    "user" => $userData
]);
