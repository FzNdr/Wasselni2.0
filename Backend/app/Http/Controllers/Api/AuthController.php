<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'drivingLicense' => 'required_if:registrationType,Driver|string|unique:vehicles,driving_license',
            'carPlate' => 'required_if:registrationType,Driver|string|unique:vehicles,car_plate',
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
            'email' => $request->input('email', null),  // Optional email
        ]);

        if ($fields['registrationType'] === 'Driver') {
            $user->vehicles()->create([
                'car_plate' => $fields['carPlate'],
                'vehicle_brand' => $fields['vehicleBrand'],
                'vehicle_type' => $fields['vehicleType'],
                'total_seats' => $fields['totalSeats'],
                'driving_license' => $fields['drivingLicense'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}
