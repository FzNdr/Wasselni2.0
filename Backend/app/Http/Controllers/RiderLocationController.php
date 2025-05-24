<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RiderLocation;

class RiderLocationController extends Controller
{
 public function index()
    {
        // Fetch all locations, or filter by something if you like
        $locations = RiderLocation::all();

        return response()->json($locations);
    }

    public function updateLocation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $location = RiderLocation::updateOrCreate(
            ['user_id' => $request->user_id],
            ['latitude' => $request->latitude, 'longitude' => $request->longitude]
        );

        return response()->json([
            'message' => 'Rider location updated',
            'location' => $location
        ]);
    }

  public function store(Request $request)
{
    \Log::info('Request Data:', ['data' => $request->all()]);

    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'latitude' => 'required|numeric|between:-90,90',
        'longitude' => 'required|numeric|between:-180,180',
    ]);

    $riderLocation = RiderLocation::updateOrCreate(
        ['user_id' => $validated['user_id']],
        [
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude']
        ]
    );

    return response()->json(['success' => true, 'message' => 'Location saved', 'location' => $riderLocation]);
}

}
