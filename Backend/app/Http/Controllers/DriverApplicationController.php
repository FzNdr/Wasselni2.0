<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DriverApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DriverApplicationController extends Controller
{
   public function store(Request $request)
{
    $request->validate([
        'photo' => 'required|image|max:2048',
    ]);

    // Upload photo
    $path = $request->file('photo')->store('applications', 'public');

    // Store only what's allowed in driver_applications table
    $application = DriverApplication::create([
        'photo_path' => $path,
        'status' => 'Pending',
        'submitted_at' => now(),
        'user_id' => null, 
    ]);

    return response()->json([
        'message' => 'Driver application submitted successfully.',
        'application' => $application
    ]);
}


    public function approve($id)
    {
        try {
            $application = DriverApplication::findOrFail($id);

            // Sample creation logic – you must pass required info separately or extend the model/table
            $user = User::create([
                'username' => request()->input('username'), // Needs to come from frontend/admin
                'password' => Hash::make(request()->input('password')),
                'phone_number' => request()->input('phone_number'),
                'role' => 'driver',
            ]);

            $application->update([
                'status' => 'Approved',
                'reviewed_at' => now(),
                'reviewer_id' => null, // optional reviewer auth
                'user_id' => $user->id,
            ]);

            return response()->json(['message' => 'Application approved.']);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to approve application',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deny($id)
    {
        $application = DriverApplication::findOrFail($id);

        $application->update([
            'status' => 'Denied',
            'reviewed_at' => now(),
            'reviewer_id' => null
        ]);

        return response()->json(['message' => 'Application denied.']);
    }

    public function index()
    {
        return DriverApplication::with('user')->get(); // if relation exists
    }
}
