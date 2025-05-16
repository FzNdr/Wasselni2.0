<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\WebSocketClient;
use App\Models\Ride;

class RideController extends Controller
{
    protected $wsClient;

    public function __construct(WebSocketClient $wsClient)
    {
        $this->wsClient = $wsClient;
    }

    public function updateRideStatus(Request $request, $rideId)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'targetUserId' => 'required|integer',
        ]);

        $ride = Ride::findOrFail($rideId);
        $ride->status = $validated['status'];
        $ride->save();

        $data = [
            'type' => 'ride_status_update',
            'rideId' => $rideId,
            'status' => $validated['status'],
            'targetUserId' => $validated['targetUserId'],
        ];

        $this->wsClient->send($data);

        return response()->json([
            'message' => 'Ride status updated and WebSocket notification sent.',
        ]);
    }
}
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ride;
use App\Models\User;

class RideController extends Controller
{
    public function index()
    {
        $rides = Ride::with('rider', 'driver')->orderByDesc('created_at')->get();
        return view('rides.index', compact('rides'));
    }
}
