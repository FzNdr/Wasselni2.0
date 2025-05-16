<?php

namespace App\Http\Controllers;

use App\Models\DriverApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DriverApplicationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $path = $request->file('photo')->store('applications', 'public');

        $application = DriverApplication::create([
            'user_id' => Auth::id(),
            'photo_path' => $path,
            'status' => 'Pending',
            'submitted_at' => now(),
        ]);

        return response()->json(['message' => 'Application submitted.', 'data' => $application]);
    }

    public function approve($id)
    {
        $application = DriverApplication::findOrFail($id);
        $application->update([
            'status' => 'Approved',
            'reviewed_at' => now(),
            'reviewer_id' => Auth::id()
        ]);

        return response()->json(['message' => 'Application approved.']);
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
        return DriverApplication::with('user')->get();
    }
}
