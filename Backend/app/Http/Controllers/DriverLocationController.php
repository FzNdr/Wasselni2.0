<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DriverLocation;

class DriverLocationController extends Controller
{
    public function updateLocation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $location = DriverLocation::updateOrCreate(
            ['user_id' => $request->user_id],
            ['latitude' => $request->latitude, 'longitude' => $request->longitude]
        );

        return response()->json([
            'message' => 'Driver location updated',
            'location' => $location
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Request Data:', $request->all()); // Log incoming data

        $validated = $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'phone_number' => 'required|string',
        ]);

        $driverLocation = new DriverLocation();
        $driverLocation->latitude = $validated['latitude'];
        $driverLocation->longitude = $validated['longitude'];
        $driverLocation->phone_number = $validated['phone_number'];
        $driverLocation->save();

        return response()->json(['success' => true, 'message' => 'Location saved']);
    }
}
