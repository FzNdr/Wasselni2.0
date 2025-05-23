<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RideRequest;
use Illuminate\Support\Facades\Auth;

class RideRequestController extends Controller
{
    // List all ride requests of the authenticated rider
    public function index()
    {
        $riderId = Auth::id();
        $rides = RideRequest::where('rider_id', $riderId)->orderBy('created_at', 'desc')->get();

        return response()->json($rides);
    }

    // Create a new ride request
    public function store(Request $request)
    {
        $request->validate([
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'dropoff_latitude' => 'required|numeric',
            'dropoff_longitude' => 'required|numeric',
        ]);

        $rideRequest = RideRequest::create([
            'rider_id' => Auth::id(),
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'dropoff_latitude' => $request->dropoff_latitude,
            'dropoff_longitude' => $request->dropoff_longitude,
            'status' => 'pending',
        ]);

        return response()->json($rideRequest, 201);
    }

    // Show a specific ride request details
    public function show($id)
    {
        $rideRequest = RideRequest::where('id', $id)
            ->where('rider_id', Auth::id())
            ->firstOrFail();

        return response()->json($rideRequest);
    }

    // Cancel a ride request (only if pending)
    public function cancel($id)
    {
        $rideRequest = RideRequest::where('id', $id)
            ->where('rider_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        $rideRequest->status = 'canceled';
        $rideRequest->save();

        return response()->json(['message' => 'Ride request canceled']);
    }

    // Driver: Get all pending ride requests without assigned driver
    public function driverPendingRequests()
    {
        $rides = RideRequest::where('status', 'pending')
            ->whereNull('driver_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rides);
    }

    // Driver: Accept or decline a ride request
    public function respondToRequest(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:accepted,declined',
        ]);

        $driverId = Auth::id();

        // Only get pending ride requests that are unassigned
        $rideRequest = RideRequest::where('id', $id)
            ->where('status', 'pending')
            ->whereNull('driver_id')
            ->first();

        if (!$rideRequest) {
            return response()->json(['error' => 'Ride request not found or already assigned'], 404);
        }

        if ($request->action === 'accepted') {
            $rideRequest->driver_id = $driverId;
            $rideRequest->status = 'accepted';
            $rideRequest->save();

            return response()->json(['message' => 'Ride request accepted', 'ride' => $rideRequest]);
        } else {
            // declined - do not assign driver_id, just update status
            $rideRequest->status = 'declined';
            $rideRequest->save();

            return response()->json(['message' => 'Ride request declined']);
        }
    }
}
