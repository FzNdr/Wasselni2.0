<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "wasselni";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Fetch feedback from both Riders and Drivers
$sql = "
  SELECT f.rating, f.comment, u.name, u.phone, u.role
  FROM feedback f
  JOIN users u ON f.user_id = u.id
  ORDER BY f.rating ASC
";

$result = $conn->query($sql);

$feedback = [];
while ($row = $result->fetch_assoc()) {
  $feedback[] = $row;
}

header('Content-Type: application/json');
echo json_encode($feedback);
$conn->close();
?>
