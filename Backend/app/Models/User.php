<?php
class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function createUser($data) {
        // Check if username exists
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$data['username']]);
        if ($stmt->rowCount() > 0) {
            return ['error' => 'Username already taken'];
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $sql = "INSERT INTO users 
                (username, password, first_name, last_name, phone_number, gov_id, driving_license, car_plate, vehicle_brand, vehicle_type, total_seats, registration_type, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

        $params = [
            $data['username'],
            $hashedPassword,
            $data['first_name'],
            $data['last_name'],
            $data['phone_number'],    // match your schema
            $data['gov_id'],
            null, // driving_license
            null, // car_plate
            null, // vehicle_brand
            'SUV', // default vehicle_type
            null, // total_seats
            $data['registration_type']
        ];

        if ($data['registration_type'] === 'Driver' && isset($data['vehicle'])) {
            $vehicle = $data['vehicle'];
            $params[6] = $vehicle['driving_license'];
            $params[7] = $vehicle['car_plate'];
            $params[8] = $vehicle['vehicle_brand'];
            $params[9] = $vehicle['vehicle_type'];
            $params[10] = $vehicle['total_seats'];
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return ['success' => true, 'user_id' => $this->pdo->lastInsertId()];
    }
}
?>
