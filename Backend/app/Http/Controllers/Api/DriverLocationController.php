<?php

namespace App\Http\Controllers;

use App\Models\DriverLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DriverLocationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return DriverLocation::all();
    }

    public function show($id)
    {
        return DriverLocation::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'driver_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location = DriverLocation::create($validator->validated());
        return response()->json($location, 201);
    }

    public function update(Request $request, $id)
    {
        $location = DriverLocation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'driver_id' => 'sometimes|exists:users,id',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $location->update($validator->validated());
        return response()->json($location, 200);
    }

    public function destroy($id)
    {
        DriverLocation::destroy($id);
        return response()->json(null, 204);
    }
}
