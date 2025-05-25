<?php
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
        return $this->store($request); 
    }

    public function index(Request $request)
{
    $riderLocations = RiderLocation::with('user')->get();

    $formatted = $riderLocations->map(function ($location) {
        return [
            'id' => $location->id,
            'latitude' => $location->latitude,
            'longitude' => $location->longitude,
            'user_id' => $location->user_id,
            'name' => trim(optional($location->user)->first_name . ' ' . optional($location->user)->last_name),
            'phone_number' => optional($location->user)->phone_number,
        ];
    });

    return response()->json([
        'success' => true,
        'riderLocations' => $formatted
    ]);
}


}
