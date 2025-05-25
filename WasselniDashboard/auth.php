<?php
// auth.php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $action = $_GET['action'] ?? '';

    if ($action === 'register') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) respond(['error' => 'Invalid JSON'], 400);

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $first_name = trim($data['first_name'] ?? '');
        $last_name = trim($data['last_name'] ?? '');
        $phone_number = trim($data['phone_number'] ?? '');
        $gov_id = trim($data['gov_id'] ?? '');
        $registration_type = $data['registration_type'] ?? 'Rider';

        // Vehicle/driver fields (nullable for Riders)
        $driving_license = $data['driving_license'] ?? null;
        $car_plate = $data['car_plate'] ?? null;
        $vehicle_brand = $data['vehicle_brand'] ?? null;
        $vehicle_type = $data['vehicle_type'] ?? 'SUV';
        $total_seats = isset($data['total_seats']) ? (int)$data['total_seats'] : null;

        if (!$username || !$password || !$first_name || !$last_name || !$phone_number || !$gov_id) {
            respond(['error' => 'Missing required fields'], 400);
        }

        // Check username if unique
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            respond(['error' => 'Username already exists'], 409);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("INSERT INTO users 
          (username, first_name, last_name, phone_number, gov_id, password, driving_license, car_plate, vehicle_brand, vehicle_type, total_seats, registration_type, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

        $stmt->execute([
            $username, $first_name, $last_name, $phone_number, $gov_id, $hash,
            $driving_license, $car_plate, $vehicle_brand, $vehicle_type, $total_seats, $registration_type
        ]);

        respond(['message' => 'Registration successful']);
    }
    elseif ($action === 'login') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) respond(['error' => 'Invalid JSON'], 400);

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (!$username || !$password) {
            respond(['error' => 'Missing username or password'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            respond(['error' => 'Invalid username or password'], 401);
        }

        
        unset($user['password']);
        respond(['message' => 'Login successful', 'user' => $user]);
    }
    else {
        respond(['error' => 'Invalid action'], 400);
    }
} else {
    respond(['error' => 'Method not allowed'], 405);
}
