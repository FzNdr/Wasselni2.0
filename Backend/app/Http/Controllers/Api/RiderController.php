<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class RiderController extends Controller
{
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
