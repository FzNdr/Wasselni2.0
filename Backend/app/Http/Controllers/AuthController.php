<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $fields = $request->validate([
        'registrationType' => 'required|in:Rider,Driver',
        'username' => 'required|string|unique:users,username',
        'firstName' => 'required|string',
        'lastName' => 'required|string',
        'phoneNumber' => 'required|string|unique:users,phone_number',
        'govId' => 'required|string|unique:users,gov_id',
        'password' => 'required|string|confirmed',
        // Driver-only fields
        'drivingLicense' => 'required_if:registrationType,Driver|string|unique:users,driving_license',
        'carPlate' => 'required_if:registrationType,Driver|string|unique:users,car_plate',
        'vehicleBrand' => 'required_if:registrationType,Driver|string',
        'vehicleType' => 'required_if:registrationType,Driver|in:SUV,Sedan,Truck,Van,Other',
        'totalSeats' => 'required_if:registrationType,Driver|integer|min:1',
    ]);

    $user = User::create([
        'username' => $fields['username'],
        'first_name' => $fields['firstName'],
        'last_name' => $fields['lastName'],
        'phone_number' => $fields['phoneNumber'],
        'gov_id' => $fields['govId'],
        'role' => strtolower($fields['registrationType']),
        'password' => Hash::make($fields['password']),
        'driving_license' => $fields['drivingLicense'] ?? null,
        'car_plate' => $fields['carPlate'] ?? null,
        'vehicle_brand' => $fields['vehicleBrand'] ?? null,
        'vehicle_type' => $fields['vehicleType'] ?? null,
        'total_seats' => $fields['totalSeats'] ?? null,
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ], 201);
}


    public function login(Request $request)
{
    $fields = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
        'role' => 'required|in:rider,driver',
    ]);

    // Attempt to find the user by username and role
    $user = User::where('username', $fields['username'])
                ->where('role', $fields['role'])
                ->first();

    if (!$user || !Hash::check($fields['password'], $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ], 200);
}

}
