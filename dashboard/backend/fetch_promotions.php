<?php
$host = 'localhost';
$dbname = 'wasselni';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die(json_encode(['error' => 'Database connection failed']));
}

$sql = "SELECT id, title, start_date, end_date FROM Promotions";
$result = $conn->query($sql);

$promotions = [];
while ($row = $result->fetch_assoc()) {
  $promotions[] = $row;
}

header('Content-Type: application/json');
echo json_encode($promotions);
$conn->close();
?>
