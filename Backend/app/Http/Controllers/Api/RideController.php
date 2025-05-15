<?php

namespace App\Http\Controllers;

use App\Models\Ride;
use Illuminate\Http\Request;

class RideController extends Controller
{
    public function request(Request $request)
    {
        $request->validate([
            'pickup_lat' => 'required|numeric',
            'pickup_lng' => 'required|numeric',
            'dropoff_lat' => 'required|numeric',
            'dropoff_lng' => 'required|numeric',
        ]);

        $ride = Ride::create([
            'rider_id' => auth()->id(),
            'pickup_lat' => $request->pickup_lat,
            'pickup_lng' => $request->pickup_lng,
            'dropoff_lat' => $request->dropoff_lat,
            'dropoff_lng' => $request->dropoff_lng,
            'status' => 'requested',
        ]);

        return response()->json(['ride' => $ride, 'message' => 'Ride requested']);
    }

    public function index()
    {
        $rides = Ride::where('rider_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rides);
    }

    public function cancel(Request $request)
    {
        $ride = Ride::where('id', $request->ride_id)
            ->where('rider_id', auth()->id())
            ->firstOrFail();

        if ($ride->status !== 'requested') {
            return response()->json(['message' => 'Cannot cancel ride after it’s accepted'], 403);
        }

        $ride->status = 'cancelled';
        $ride->save();

        return response()->json(['message' => 'Ride cancelled']);
    }
}
