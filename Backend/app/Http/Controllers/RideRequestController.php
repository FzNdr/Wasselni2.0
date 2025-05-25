<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RideRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RideRequestController extends Controller
{
    // List all ride requests of the authenticated rider
    public function index()
    {
        $riderId = Auth::id();
        $rides = RideRequest::where('rider_id', $riderId)->orderBy('created_at', 'desc')->get();

        return response()->json($rides);
    }


public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'rider_id' => 'required|exists:users,id',
        'driver_id' => 'required|exists:users,id',
        'pickup_latitude' => 'required|numeric',
        'pickup_longitude' => 'required|numeric',
        'dropoff_latitude' => 'required|numeric',
        'dropoff_longitude' => 'required|numeric',
        'fare' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    $ride = RideRequest::create([
        'rider_id' => $request->rider_id,
        'driver_id' => $request->driver_id,
        'pickup_latitude' => $request->pickup_latitude,
        'pickup_longitude' => $request->pickup_longitude,
        'dropoff_latitude' => $request->dropoff_latitude,
        'dropoff_longitude' => $request->dropoff_longitude,
        'status' => 'pending',
        'fare' => $request->fare,
    ]);

    return response()->json(['success' => true, 'ride' => $ride]);
}


    // Show a specific ride request details
    public function show($id)
    {
        $rideRequest = RideRequest::where('id', $id)
            ->where('rider_id', Auth::id())
            ->firstOrFail();

        return response()->json($rideRequest);
    }
public function incoming(Request $request)
{
    $driver_id = $request->query('driver_id');
    $requests = RideRequest::where('driver_id', $driver_id)
                            ->where('status', 'pending')
                            ->get();

    return response()->json([
        'success' => true,
        'requests' => $requests,
    ]);
}
  public function getFare(Request $request)
{
    $validator = Validator::make($request->all(), [
        'rider_id' => 'required|exists:users,id',
        'driver_id' => 'required|exists:users,id',
        'distance_km' => 'required|numeric|min:0.1',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    $baseFare = 5.00;
    $perKmRate = 1.00;

    $distanceKm = $request->distance_km;
    $fare = $baseFare + ($distanceKm * $perKmRate);

    return response()->json([
        'success' => true,
        'fare' => [
            'amount' => number_format($fare, 2),
            'currency' => '$'
        ]
    ]);
}



    // Driver: Accept or decline a ride request
public function accept(Request $request, $id)
{
    $request->validate([
        'driver_id' => 'required|exists:users,id',
    ]);

    $ride = RideRequest::where('id', $id)
        ->where('status', 'pending')
        ->first();

    if (!$ride) {
        return response()->json([
            'success' => false,
            'message' => 'Ride not found or already accepted',
        ], 404);
    }

    $ride->driver_id = $request->driver_id;
    $ride->status = 'accepted';
    $ride->save();

    return response()->json([
        'success' => true,
        'message' => 'Ride accepted successfully',
        'ride' => $ride
    ]);
}


//driver deny request

public function deny($id)
{
    $rideRequest = RideRequest::find($id);

    if (!$rideRequest) {
        return response()->json(['error' => 'Ride request not found'], 404);
    }

    $rideRequest->status = 'denied';

    if ($rideRequest->save()) {
        return response()->json(['message' => 'Ride request denied successfully']);
    } else {
        return response()->json(['error' => 'Failed to update status'], 500);
    }
}


//driver offer counter offer

public function counter(Request $request)
{
    $validator = Validator::make($request->all(), [
        'ride_id' => 'required|exists:ride_requests,id',
        'counter_fare' => 'required|numeric|min:1',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 422);
    }

    $ride = RideRequest::find($request->ride_id);

    if ($ride && $ride->status === 'pending') {
        $ride->counter_fare = $request->counter_fare;
        $ride->status = 'countered';
        $ride->save();

        return response()->json([
            'success' => true,
            'message' => 'Counter offer sent',
            'ride' => $ride
        ]);
    }

    return response()->json(['success' => false, 'message' => 'Ride not found or already updated']);
}
//user agree on counter offer

public function confirmCounter(Request $request)
{
    $ride = RideRequest::find($request->ride_id);

    if ($ride && $ride->status === 'countered') {
        $ride->status = 'confirmed';
        $ride->fare = $ride->counter_fare;
        $ride->save();

        return response()->json(['success' => true, 'message' => 'Counter offer accepted']);
    }

    return response()->json(['success' => false, 'message' => 'No counter offer found']);
}

}
