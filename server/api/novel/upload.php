<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// กำหนดโฟลเดอร์เก็บรูป
$targetDir = "../../image/novel/";

// ถ้าโฟลเดอร์ยังไม่มี ให้สร้างขึ้นมา
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// ลบไฟล์เก่า (ถ้ามีส่งมาจาก frontend)
if (!empty($_POST["old_url"])) {
    $oldFilePath = "../../" . ltrim($_POST["old_url"], "/");
    if (file_exists($oldFilePath)) {
        if (!unlink($oldFilePath)) {
            error_log("Failed to delete old file: " . $oldFilePath);
        }
    }
}

// ตรวจสอบว่ามีไฟล์ส่งมาจริง
if (!empty($_FILES["file"]) && $_FILES["file"]["error"] === UPLOAD_ERR_OK) {
    $fileName = time() . "_" . basename($_FILES["file"]["name"]);
    $targetFilePath = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        echo json_encode([
            "message" => "Upload successful",
            "url" => "/image/novel/" . $fileName
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to move uploaded file"]);
    }
} else {
    // Debug: แสดง error ถ้าไม่มีไฟล์หรือเกิดปัญหา
    $errorCode = $_FILES["file"]["error"] ?? "No file key";
    echo json_encode([
        "message" => "No file uploaded or upload error",
        "error_code" => $errorCode,
        "_FILES" => $_FILES,
        "_POST" => $_POST
    ]);
    http_response_code(400);
}
