<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$db = "wasselni";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  echo json_encode([
    'success' => false,
    'message' => 'Connection failed: ' . $conn->connect_error
  ]);
  exit;
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

if ($id <= 0) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid promotion ID.'
  ]);
  exit;
}

$stmt = $conn->prepare("DELETE FROM promotions WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo json_encode([
      'success' => true,
      'message' => 'Promotion deleted successfully.'
    ]);
  } else {
    echo json_encode([
      'success' => false,
      'message' => 'No promotion found with that ID.'
    ]);
  }
} else {
  echo json_encode([
    'success' => false,
    'message' => 'Error executing delete: ' . $stmt->error
  ]);
}

$stmt->close();
$conn->close();
