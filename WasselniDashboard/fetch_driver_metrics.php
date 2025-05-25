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

// Find driver by username with role = 'driver'
$driverQuery = "
    SELECT id, username
    FROM users
    WHERE role = 'driver' AND username = '$usernameEsc'
    LIMIT 1
";

$driverResult = $mysqli->query($driverQuery);
if ($driverResult->num_rows === 0) {
    echo json_encode(['error' => 'Driver not found']);
    exit;
}

$driver = $driverResult->fetch_assoc();
$driverId = $driver['id'];

// Total rides
$totalRidesQuery = "SELECT COUNT(*) AS total_rides FROM rides WHERE driver_id = $driverId";
$totalRidesResult = $mysqli->query($totalRidesQuery);
$totalRides = $totalRidesResult->fetch_assoc()['total_rides'] ?? 0;

// Ride details
$ridesQuery = "
    SELECT r.id AS ride_id, u.username AS rider_username, p.payment_method, p.amount
    FROM rides r
    LEFT JOIN users u ON r.rider_id = u.id
    LEFT JOIN payments p ON p.ride_request_id = r.id
    WHERE r.driver_id = $driverId
    ORDER BY r.created_at DESC
";

$ridesResult = $mysqli->query($ridesQuery);
$rides = [];

while ($row = $ridesResult->fetch_assoc()) {
    $rides[] = $row;
}

// Driver credits (sum of 'credits' payments)
$creditsQuery = "
    SELECT COALESCE(SUM(amount), 0) AS total_credits
    FROM payments
    WHERE driver_id = $driverId AND payment_method = 'credits'
";

$creditsResult = $mysqli->query($creditsQuery);
$credits = $creditsResult->fetch_assoc()['total_credits'] ?? 0;

echo json_encode([
    'driver' => $driver,
    'total_rides' => $totalRides,
    'rides' => $rides,
    'credits' => $credits
]);
