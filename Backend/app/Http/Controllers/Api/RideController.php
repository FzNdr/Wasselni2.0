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
