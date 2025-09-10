<?php
require_once '../../config/init.php';

include_once '../../config/database.php';
include_once '../../models/Like.php';

$database = new Database();
$db = $database->getConnection();
$like = new Like($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->novel_id)) {
    $like->user_id = $data->user_id;
    $like->novel_id = $data->novel_id;

    if ($like->unlike()) {
        http_response_code(200);
        echo json_encode(["message" => "ยกเลิกการถูกใจนิยายเรียบร้อยแล้ว"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "ไม่สามารถยกเลิกการถูกใจนิยายได้ คุณอาจยังไม่ได้กดถูกใจ"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "ไม่สามารถยกเลิกการถูกใจนิยายได้ ข้อมูลไม่ครบ"]);
}
?>
