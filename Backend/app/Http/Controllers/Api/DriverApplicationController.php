<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\DriverApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DriverApplicationController extends Controller
{



    public function store(Request $request)
    {
        // Validate all necessary fields, add rules as needed
        $request->validate([
            'username' => 'required|string|max:255',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'govId' => 'required|string|max:50',
            'password' => 'required|string|min:6|confirmed',
            'drivingLicense' => 'required|string|max:50',
            'carPlate' => 'required|string|max:20',
            'vehicleBrand' => 'required|string|max:255',
            'vehicleType' => 'required|string|max:255',
            'totalSeats' => 'required|integer|min:1',
            'photo' => 'required|image|max:2048',
        ]);

        // Save the uploaded photo
        $path = $request->file('photo')->store('applications', 'public');

        // Store driver application data
        $application = DriverApplication::create([
            'username' => $request->username,
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'phoneNumber' => $request->phoneNumber,
            'govId' => $request->govId,
            // You probably want to hash the password here if storing it in the application,
            // or consider not storing it here but rather only after approval.
            'password' => bcrypt($request->password),
            'drivingLicense' => $request->drivingLicense,
            'carPlate' => $request->carPlate,
            'vehicleBrand' => $request->vehicleBrand,
            'vehicleType' => $request->vehicleType,
            'totalSeats' => $request->totalSeats,
            'photo_path' => $path,
            'status' => 'Pending',
            'submitted_at' => now(),
            // 'user_id' => Auth::id(), // Only if you want to link to a user now
        ]);

        return response()->json(['message' => 'Application submitted.', 'data' => $application]);
    }

    public function approve($id)
{
    try {
        $application = DriverApplication::findOrFail($id);

        // Create the user
        $user = User::create([
            'username' => $application->username,
            'firstName' => $application->firstName,
            'lastName' => $application->lastName,
            'phoneNumber' => $application->phoneNumber,
            'govId' => $application->govId,
            'password' => $application->password,
            'role' => 'driver',
        ]);

        $application->update([
            'status' => 'Approved',
            'reviewed_at' => now(),
            'reviewer_id' => Auth::id()
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
            'reviewer_id' => Auth::id()
        ]);

        return response()->json(['message' => 'Application denied.']);
    }

    public function index()
    {
        // Return all applications with user info if related
        return DriverApplication::all();
    }
   
}
