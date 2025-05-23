<?php
namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
  public function store(Request $request)
{
    $validated = $request->validate([
        'ride_id' => 'required|exists:rides,id',
        'rating' => 'required|numeric|min:1|max:5',
        'feedback' => 'nullable|string',
        'user_type' => 'required|in:rider,driver',
        'ride_completed' => 'required|boolean',
    ]);

    // Determine user based on ride and type
    $ride = Ride::findOrFail($validated['ride_id']);
    $userId = $validated['user_type'] === 'rider' ? $ride->rider_id : $ride->driver_id;

    // Create feedback entry
    Feedback::create([
        'user_id' => $userId,
        'rating' => $validated['rating'],
        'comment' => $validated['feedback'],
    ]);

    return response()->json(['message' => 'Feedback submitted successfully.'], 201);
}

}
