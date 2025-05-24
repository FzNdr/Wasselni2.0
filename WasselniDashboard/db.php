<?php
// db.php - Database connection

$host = "localhost";      // Database host, e.g., localhost
$username = "root";  // Your DB username
$password = "";  // Your DB password
$dbname = "wasselni";  // Your database name

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: Set charset to UTF-8 for proper encoding
$conn->set_charset("utf8");

?>
