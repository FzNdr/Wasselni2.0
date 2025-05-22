<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\DriverApplication;

class AuthController extends Controller
{
public function register(Request $request)
{
    $fields = $request->validate([
        // ... existing validation rules ...
        'photo' => 'required_if:registrationType,Driver|image|max:2048', // validate photo upload
    ]);

    // Create user first
    $user = User::create([
        'username' => $fields['username'],
        'first_name' => $fields['firstName'],
        'last_name' => $fields['lastName'],
        'phone_number' => $fields['phoneNumber'],
        'gov_id' => $fields['govId'],
        'role' => strtolower($fields['registrationType']),
        'password' => Hash::make($fields['password']),
    ]);

    // Handle driver application if registrationType == Driver
    if (strtolower($fields['registrationType']) === 'driver') {
        // Store photo file
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('driver_photos', 'public');
        }

        DriverApplication::create([
            'user_id' => $user->id,
            'photo_path' => $photoPath,
            'status' => 'Pending',
            // other fields can be added if you want (driving_license, etc.) or store them separately
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ], 201);
}

    public function login(Request $request) {
    try {
        $fields = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|in:rider,driver',
        ]);

        $role = strtolower($fields['role']); // normalize role

        $user = User::where('username', $fields['username'])
                    ->where('role', $role)
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

    } catch (\Exception $e) {
        // Log the exception message
        \Log::error('Login error: ' . $e->getMessage());

        // Return JSON error response
        return response()->json([
            'message' => 'Server error',
            'error' => $e->getMessage()
        ], 500);
    }
}


}
