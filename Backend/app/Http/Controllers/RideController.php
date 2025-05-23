<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WebSocketClient;
use App\Models\Ride;
use App\Models\User;

class RideController extends Controller
{
    protected $wsClient;

    public function __construct(WebSocketClient $wsClient)
    {
        $this->wsClient = $wsClient;
    }

    // List all rides (e.g., for admin dashboard)
    public function index()
    {
        $rides = Ride::with('rider', 'driver')->orderByDesc('created_at')->get();
        return view('rides.index', compact('rides'));
    }

    // Helper function to calculate distance between two points in km
    private function calculateDistanceKm($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    // Update ride status and notify via WebSocket
    public function updateRideStatus(Request $request, $rideId)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'targetUserId' => 'required|integer',
        ]);

        $ride = Ride::findOrFail($rideId);

        // Only proceed to credits update if status changes to completed and wasn't completed before
        if ($validated['status'] === 'completed' && $ride->status !== 'completed') {
            // Decode pickup and dropoff locations assuming JSON stored as strings
            $pickup = json_decode($ride->pickup_location, true);
            $dropoff = json_decode($ride->dropoff_location, true);

            if ($pickup && $dropoff &&
                isset($pickup['latitude'], $pickup['longitude'], $dropoff['latitude'], $dropoff['longitude'])) {

                $distanceKm = $this->calculateDistanceKm(
                    $pickup['latitude'],
                    $pickup['longitude'],
                    $dropoff['latitude'],
                    $dropoff['longitude']
                );

                // Calculate credits
                $riderCredits = $distanceKm * 5;
                $driverCredits = $distanceKm * 50;

                // Update users' credits
                $rider = User::find($ride->rider_id);
                $driver = User::find($ride->driver_id);

                if ($rider) {
                    $rider->credits += $riderCredits;
                    $rider->save();
                }

                if ($driver) {
                    $driver->credits += $driverCredits;
                    $driver->save();
                }
            }
        }

        // Update ride status
        $ride->status = $validated['status'];
        $ride->save();

        $data = [
            'type' => 'ride_status_update',
            'rideId' => $rideId,
            'status' => $validated['status'],
            'targetUserId' => $validated['targetUserId'],
        ];

        $this->wsClient->send($data);

        return response()->json([
            'message' => 'Ride status updated and WebSocket notification sent.',
        ]);
    }
}
