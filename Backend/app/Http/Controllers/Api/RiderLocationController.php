<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RiderLocation;

class RiderLocationController extends Controller
{
    // Update rider location
    public function updateLocation(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // Update or create rider location
        $location = RiderLocation::updateOrCreate(
            ['rider_id' => $user->id],
            ['latitude' => $data['latitude'], 'longitude' => $data['longitude']]
        );

        return response()->json(['message' => 'Location updated', 'location' => $location]);
    }
}
