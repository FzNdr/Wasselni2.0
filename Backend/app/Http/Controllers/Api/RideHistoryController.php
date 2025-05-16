<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ride;
use Illuminate\Support\Facades\Auth;

class RideHistoryController extends Controller
{
    // Rider Ride History
    public function riderHistory(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'rider') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $rides = Ride::where('rider_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['rides' => $rides]);
    }

    // Driver Ride History
    public function driverHistory(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'driver') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $rides = Ride::where('driver_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['rides' => $rides]);
    }
}
