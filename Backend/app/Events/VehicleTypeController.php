<?php

namespace App\Http\Controllers;

use App\Models\VehicleType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        return VehicleType::all();
    }

    public function show($id)
    {
        return VehicleType::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:vehicle_types,name',
            'description' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $vehicleType = VehicleType::create($validator->validated());
        return response()->json($vehicleType, 201);
    }

    public function update(Request $request, $id)
    {
        $vehicleType = VehicleType::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100|unique:vehicle_types,name,' . $id,
            'description' => 'sometimes|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $vehicleType->update($validator->validated());
        return response()->json($vehicleType, 200);
    }

    public function destroy($id)
    {
        VehicleType::destroy($id);
        return response()->json(null, 204);
    }
}
