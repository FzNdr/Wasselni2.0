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
    try {
        \Log::info('Request Data:', ['data' => $request->all()]);
        $validated = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);
        $driverLocation = DriverLocation::updateOrCreate(
            ['user_id' => $validated['user_id']],
            ['latitude' => $validated['latitude'], 'longitude' => $validated['longitude']]
        );
        return response()->json([
            'success' => true,
            'message' => 'Location saved',
            'location' => $driverLocation
        ]);
    } catch (\Exception $e) {
        \Log::error('DriverLocation store error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to save location',
            'error'   => $e->getMessage()
        ], 500);
    }
}

public function index(Request $request)
{
   
        $driverLocations = DriverLocation::all();

    return response()->json([
        'success' => true,
'driverLocations' => $driverLocations
    ]);
}


}
