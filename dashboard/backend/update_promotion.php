<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "wasselni";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$id = $_POST['id'];
$title = $_POST['title'];
$start = $_POST['start_date'];
$end = $_POST['end_date'];

if ($start > $end) {
  echo "Error: Start date must be before end date.";
  exit;
}

$sql = "UPDATE promotions SET title=?, start_date=?, end_date=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $title, $start, $end, $id);

if ($stmt->execute()) {
  echo "Promotion updated successfully.";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
