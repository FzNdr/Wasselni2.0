<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "wasselni");

if ($mysqli->connect_error) {
    echo json_encode(['error' => "Database connection failed"]);
    exit;
}

$username = $_GET['username'] ?? '';

if (empty($username)) {
    echo json_encode(['error' => 'Username is required']);
    exit;
}

$usernameEsc = $mysqli->real_escape_string($username);

// Find rider by username, checking role = 'rider'
$riderQuery = "
    SELECT id, username
    FROM users
    WHERE role = 'rider' AND username = '$usernameEsc'
    LIMIT 1
";

$riderResult = $mysqli->query($riderQuery);
if ($riderResult->num_rows === 0) {
    echo json_encode(['error' => 'Rider not found']);
    exit;
}

$rider = $riderResult->fetch_assoc();
$riderId = $rider['id'];

// Total rides for rider
$totalRidesQuery = "SELECT COUNT(*) AS total_rides FROM rides WHERE rider_id = $riderId";
$totalRidesResult = $mysqli->query($totalRidesQuery);
$totalRides = $totalRidesResult->fetch_assoc()['total_rides'] ?? 0;

// Ride details for rider
$ridesQuery = "
    SELECT r.id AS ride_id, d.username AS driver_username, p.payment_method, p.amount
    FROM rides r
    LEFT JOIN users d ON r.driver_id = d.id
    LEFT JOIN payments p ON p.ride_request_id = r.id
    WHERE r.rider_id = $riderId
    ORDER BY r.created_at DESC
";

$ridesResult = $mysqli->query($ridesQuery);
$rides = [];

while ($row = $ridesResult->fetch_assoc()) {
    $rides[] = $row;
}

// Rider credits (sum of 'credits' payments if applicable, else 0)
$creditsQuery = "
    SELECT COALESCE(SUM(amount), 0) AS total_credits
    FROM payments
    WHERE rider_id = $riderId AND payment_method = 'credits'
";

$creditsResult = $mysqli->query($creditsQuery);
$credits = $creditsResult->fetch_assoc()['total_credits'] ?? 0;

echo json_encode([
    'rider' => $rider,
    'total_rides' => $totalRides,
    'rides' => $rides,
    'credits' => $credits
]);
