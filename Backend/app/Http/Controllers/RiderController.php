<?php

namespace App\Http\Controllers\Api;
use App\Models\DriverLocation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class RiderController extends Controller
{

    public function nearbyDrivers(Request $request)
{
    $latitude = $request->input('latitude');
    $longitude = $request->input('longitude');
    $radius = 2; // km

    if (!$latitude || !$longitude) {
        return response()->json(['error' => 'Latitude and longitude are required.'], 422);
    }

    $drivers = DriverLocation::select('*')
        ->selectRaw("
            (6371 * acos(
                cos(radians(?)) *
                cos(radians(latitude)) *
                cos(radians(longitude) - radians(?)) +
                sin(radians(?)) *
                sin(radians(latitude))
            )) AS distance
        ", [$latitude, $longitude, $latitude])
        ->having('distance', '<=', $radius)
        ->orderBy('distance')
        ->get();

    return response()->json($drivers);
}
    // Get rider profile
    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }

    // Update rider profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'phone_number' => 'string|max:255',
            // Add other fields if needed
        ]);

        $user->update($data);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }
}
