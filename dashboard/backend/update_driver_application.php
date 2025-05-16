<?php
include '../db.php';
session_start();

$id = $_POST['id'];
$action = $_POST['action'];
$status = $action === 'approve' ? 'Approved' : 'Denied';
$reviewer_id = $_SESSION['admin_id'] ?? 1; // Default to admin ID 1 if session not set

$stmt = $conn->prepare("UPDATE driver_applications SET status = ?, reviewed_at = NOW(), reviewer_id = ? WHERE id = ?");
$stmt->bind_param("sii", $status, $reviewer_id, $id);
$stmt->execute();

header("Location: driver_applications.php");
exit();
