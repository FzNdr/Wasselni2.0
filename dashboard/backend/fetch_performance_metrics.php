<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "wasselni");

if ($mysqli->connect_error) {
    echo json_encode(['error' => "Database connection failed"]);
    exit;
}

// Query monthly total rides, total sales, and new users for last 12 months
$query = "
    SELECT 
        DATE_FORMAT(r.created_at, '%Y-%m') AS month,
        COUNT(r.id) AS total_rides,
        IFNULL(SUM(p.amount), 0) AS total_sales,
        (SELECT COUNT(u.id) FROM users u WHERE DATE_FORMAT(u.created_at, '%Y-%m') = DATE_FORMAT(r.created_at, '%Y-%m')) AS new_users
    FROM rides r
    LEFT JOIN payments p ON p.ride_request_id = r.id
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
";

$result = $mysqli->query($query);
$data = [];

if (!$result) {
    echo json_encode(['error' => "Query failed"]);
    exit;
}

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
