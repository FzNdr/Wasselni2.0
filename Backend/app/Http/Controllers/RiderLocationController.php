<?php
// app/Http/Controllers/RiderLocationController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RiderLocation;

class RiderLocationController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'user_id' => 'required|integer',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
    ]);

    $location = RiderLocation::updateOrCreate(
        ['user_id' => $request->user_id],
        [
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]
    );

    return response()->json($location, 200);
}

    public function updateLocation(Request $request)
    {
        return $this->store($request); // reuse same logic
    }

    public function index()
    {
        return response()->json(RiderLocation::all());
    }
}
