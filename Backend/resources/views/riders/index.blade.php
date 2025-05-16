
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ride History</title>
    <link rel="stylesheet" href="{{ asset('css/admin-style.css') }}">
</head>
<body>
    <div class="container">
        <h1>Ride History</h1>
        <a href="/admin" class="back-button">Back to Dashboard</a>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Rider</th>
                    <th>Driver</th>
                    <th>Pickup</th>
                    <th>Drop-off</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Fare</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($rides as $ride)
                    <tr>
                        <td>{{ $ride->id }}</td>
                        <td>{{ $ride->rider->name ?? 'N/A' }}</td>
                        <td>{{ $ride->driver->name ?? 'N/A' }}</td>
                        <td>{{ $ride->pickup_location }}</td>
                        <td>{{ $ride->dropoff_location }}</td>
                        <td>{{ $ride->start_time }}</td>
                        <td>{{ $ride->end_time }}</td>
                        <td>${{ $ride->fare }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8">No rides found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</body>
</html>
