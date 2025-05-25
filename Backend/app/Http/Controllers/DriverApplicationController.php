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
    try {
        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required.'], 400);
        }

        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $path = $request->file('photo')->store('applications', 'public');

        $application = DriverApplication::create([
            'photo_path' => $path,
            'status' => 'Pending',
            'submitted_at' => now(),
            'user_id' => $userId,
        ]);

        return response()->json([
            'message' => 'Driver application submitted successfully.',
            'application' => $application
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to submit application',
            'message' => $e->getMessage(),
        ], 500);
    }
}





    public function approve($id)
    {
        try {
            $application = DriverApplication::findOrFail($id);

            $user = User::create([
                'username' => request()->input('username'), 
                'password' => Hash::make(request()->input('password')),
                'phone_number' => request()->input('phone_number'),
                'role' => 'driver',
            ]);

            $application->update([
                'status' => 'Approved',
                'reviewed_at' => now(),
                'reviewer_id' => null, 
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

public function index(Request $request)
{
    $user = $request->user();  

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $applications = DriverApplication::where('user_id', $user->id)
        ->select('id', 'status', 'submitted_at', 'photo_path') // add fields you want to return
        ->get();

    return response()->json($applications);
}

}
