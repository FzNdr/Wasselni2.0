<?php
header('Content-Type: application/json');
$mysqli = new mysqli("localhost", "root", "", "wasselni");

if ($mysqli->connect_error) {
    echo json_encode(['error' => "Database connection failed"]);
    exit;
}

$search = $_GET['search'] ?? '';

if (empty($search)) {
    echo json_encode(['error' => 'Search parameter required']);
    exit;
}

$search_esc = $mysqli->real_escape_string($search);

// Find driver by username, gov_id, or id
$driverQuery = "
    SELECT id, username
    FROM users
    WHERE registration_type = 'Driver' AND
    (username = '$search_esc' OR gov_id = '$search_esc' OR id = '$search_esc')
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
$totalRides = $totalRidesResult->fetch_assoc()['total_rides'];

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
$credits = $creditsResult->fetch_assoc()['total_credits'];

echo json_encode([
    'driver' => $driver,
    'total_rides' => $totalRides,
    'rides' => $rides,
    'credits' => $credits
]);
