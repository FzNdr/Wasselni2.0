<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DriverRegistrationController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        // your validation rules
        'driving_license' => 'required|string',
        'car_plate' => 'required|string',
        'vehicle_brand' => 'required|string',
        'vehicle_type' => 'required|string',
        'total_seats' => 'required|integer',
        'photo' => 'required|image',
    ]);

    $user = auth()->user();

    // handle photo upload
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('driver_photos', 'public');
    } else {
        return response()->json(['error' => 'Photo is required'], 422);
    }

    $driverApplication = DriverApplication::create([
        'user_id' => $user->id,
        'driving_license' => $request->driving_license,
        'car_plate' => $request->car_plate,
        'vehicle_brand' => $request->vehicle_brand,
        'vehicle_type' => $request->vehicle_type,
        'total_seats' => $request->total_seats,
        'photo' => $path,
    ]);

    return response()->json(['message' => 'Driver application submitted successfully.']);
}
}
