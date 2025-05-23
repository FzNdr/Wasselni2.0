<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "wasselni");

if ($mysqli->connect_error) {
    echo json_encode(['error' => "Database connection failed"]);
    exit;
}

$query = "
    SELECT 
        m.month,
        IFNULL(r.total_rides, 0) AS total_rides,
        IFNULL(r.total_sales, 0) AS total_sales,
        IFNULL(u.new_users, 0) AS new_users
    FROM (
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month FROM rides
        UNION
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS month FROM users
    ) AS m
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS ride_month, 
            COUNT(*) AS total_rides,
            ROUND(SUM(distance_km), 2) AS total_sales  -- $1 per km
        FROM rides
        GROUP BY ride_month
    ) r ON m.month = r.ride_month
    LEFT JOIN (
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS user_month, COUNT(*) AS new_users
        FROM users
        GROUP BY user_month
    ) u ON m.month = u.user_month
    GROUP BY m.month
    ORDER BY m.month DESC
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
?>
