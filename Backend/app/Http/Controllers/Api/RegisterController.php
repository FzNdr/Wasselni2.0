<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once("../config/db.php");
require_once("../models/User.php");

$user = new User($pdo);

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

// Validate required fields for all users
$required = ['username', 'password', 'first_name', 'last_name', 'phone_number', 'gov_id', 'registration_type'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

if (!in_array($data['registration_type'], ['Rider', 'Driver'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid registration type"]);
    exit;
}

// Validate vehicle info if Driver
if ($data['registration_type'] === 'Driver') {
    $vehicleFields = ['driving_license', 'car_plate', 'vehicle_brand', 'vehicle_type', 'total_seats'];
    if (!isset($data['vehicle'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing vehicle information"]);
        exit;
    }
    foreach ($vehicleFields as $field) {
        if (empty($data['vehicle'][$field])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing vehicle field: $field"]);
            exit;
        }
    }
    if (!in_array($data['vehicle']['vehicle_type'], ['SUV', 'Sedan', 'Van'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid vehicle type"]);
        exit;
    }
}

$result = $user->createUser($data);

if (isset($result['error'])) {
    http_response_code(400);
    echo json_encode(['error' => $result['error']]);
} else {
    echo json_encode(['success' => true, 'user_id' => $result['user_id']]);
}
?>
