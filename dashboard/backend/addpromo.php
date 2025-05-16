<?php
$host = 'localhost';
$dbname = 'wasselni';
$username = 'root';
$password = '';

// Connect to DB
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$title = $_POST['title'];
$start = $_POST['start_date'];
$end = $_POST['end_date'];

// Insert query
$sql = "INSERT INTO Promotions (title, start_date, end_date) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $title, $start, $end);

if ($stmt->execute()) {
  echo "<script>alert('Promotion added successfully'); window.location.href='dashboard.html';</script>";
} else {
  echo "<script>alert('Failed to add promotion'); window.location.href='addprom.html';</script>";
}

$stmt->close();
$conn->close();
?>
