<?php
// update_driver_application.php
header('Content-Type: application/json');

// 1. Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

$id = intval($data['id']);
$status = $data['status'];

// 2. Connect to DB
$conn = new mysqli("localhost", "root", "", "wasselni");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// 3. Update query
$stmt = $conn->prepare("UPDATE driver_applications SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Application status updated to '$status'"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
$stmt->close();
$conn->close();
?>
