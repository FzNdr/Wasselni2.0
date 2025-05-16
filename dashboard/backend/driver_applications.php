<?php
include '../db.php'; // Database connection
session_start();

// Fetch all driver applications
$sql = "SELECT da.*, u.name, u.email FROM driver_applications da
        JOIN users u ON da.user_id = u.id ORDER BY submitted_at DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Driver Applications</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
    <h2>Driver Applications</h2>
    <table border="1" cellpadding="10" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Driver</th>
                <th>Email</th>
                <th>Photo</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['id'] ?></td>
                    <td><?= htmlspecialchars($row['name']) ?></td>
                    <td><?= htmlspecialchars($row['email']) ?></td>
                    <td><a href="../storage/<?= $row['photo_path'] ?>" target="_blank">View</a></td>
                    <td><?= $row['status'] ?></td>
                    <td><?= $row['submitted_at'] ?></td>
                    <td>
                        <?php if ($row['status'] === 'Pending'): ?>
                            <form method="post" action="update_driver_application.php" style="display:inline;">
                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                <input type="hidden" name="action" value="approve">
                                <button type="submit">Approve</button>
                            </form>
                            <form method="post" action="update_driver_application.php" style="display:inline;">
                                <input type="hidden" name="id" value="<?= $row['id'] ?>">
                                <input type="hidden" name="action" value="deny">
                                <button type="submit">Deny</button>
                            </form>
                        <?php else: ?>
                            <?= $row['status'] ?>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</body>
</html>
