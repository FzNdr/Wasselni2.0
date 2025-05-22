<?php

namespace App\Http\Controllers;

use App\Models\DriverLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
class DriverLocationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Find nearby drivers within 2km radius
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

    // Get all driver locations
    public function index()
    {
        return DriverLocation::all();
    }

    // Show specific driver location
    public function show($id)
    {
        return DriverLocation::findOrFail($id);
    }

    // Create new driver location
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'driver_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location = DriverLocation::create($validator->validated());

        return response()->json($location, 201);
    }

    // Update or create driver location based on driver_id
    public function updateLocation(Request $request)
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        // Use driver_id consistently
        $location = DriverLocation::updateOrCreate(
            ['driver_id' => $request->driver_id],
            ['latitude' => $request->latitude, 'longitude' => $request->longitude]
        );

        return response()->json([
            'message' => 'Driver location updated',
            'location' => $location
        ]);
    }

    // Delete driver location by id
    public function destroy($id)
    {
        DriverLocation::destroy($id);
        return response()->json(null, 204);
    }
}
