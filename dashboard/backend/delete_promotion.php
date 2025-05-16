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

$sql = "DELETE FROM promotions WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo "Promotion deleted successfully.";
  } else {
    echo "No promotion found with that ID.";
  }
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
