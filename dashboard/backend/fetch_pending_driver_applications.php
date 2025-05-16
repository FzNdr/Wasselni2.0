<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "wasselni");

if ($mysqli->connect_error) {
    echo json_encode([]);
    exit;
}

$query = "
  SELECT da.id, da.user_id, u.username, da.photo_path, da.submitted_at
  FROM driver_applications da
  JOIN users u ON da.user_id = u.id
  WHERE da.status = 'Pending'
  ORDER BY da.submitted_at ASC
";

$result = $mysqli->query($query);

$applications = [];
while ($row = $result->fetch_assoc()) {
    $row['photo_path'] = htmlspecialchars($row['photo_path']); 
    $applications[] = $row;
}

echo json_encode($applications);
