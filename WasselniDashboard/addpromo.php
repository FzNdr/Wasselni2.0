<?php
$host = 'localhost';
$dbname = 'wasselni';
$username = 'root';
$password = '';
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$title = $_POST['title'];
$start = $_POST['start_date'];
$end = $_POST['end_date'];
$description = $_POST['description'] ?? null;
$target_role = $_POST['target_role'] ?? 'all';
$created_at = date('Y-m-d H:i:s'); 

$sql = "INSERT INTO promotions (title, start_date, end_date, description, target_role, created_at) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $title, $start, $end, $description, $target_role, $created_at);
if ($stmt->execute()) {
  echo "<script>alert('Promotion added successfully'); window.location.href='dashboard.html';</script>";
} else {
  echo "Error: " . $stmt->error;
  echo "<script>alert('Failed to add promotion'); window.location.href='addprom.html';</script>";
}

$stmt->close();
$conn->close();
?>
