<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'wasselni';
$username = 'root';
$password = '';
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]);
    exit;
}

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$start = $_POST['start_date'] ?? '';
$end = $_POST['end_date'] ?? '';
$description = $_POST['description'] ?? null;
$target_role = $_POST['target_role'] ?? 'all';

if (!$id || !$title || !$start || !$end) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
    exit;
}

// Prepare the update statement with updated_at set to current timestamp
$sql = "UPDATE promotions 
        SET title = ?, start_date = ?, end_date = ?, description = ?, target_role = ?, updated_at = NOW()
        WHERE id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

// Bind parameters (s = string, i = integer)
$stmt->bind_param("sssssi", $title, $start, $end, $description, $target_role, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Promotion updated successfully.']);
    } else {
        // No rows updated — either no change or invalid id
        echo json_encode(['success' => false, 'message' => 'No promotion updated. Please check the ID.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update promotion: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
