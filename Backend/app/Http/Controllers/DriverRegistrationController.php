<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DriverApplication;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DriverRegistrationController extends Controller
{
    public function register(Request $request)
    {
        DB::beginTransaction();

        try {
            // Step 1: Create User
            $user = User::create([
    'username' => $request->username,
    'first_name' => $request->firstName,
    'last_name' => $request->lastName,
    'phone_number' => $request->phoneNumber,
    'gov_id' => $request->govId,
    'password' => bcrypt($request->password),
    'role' => 'driver',
]);


            // Step 2: Handle photo upload
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('driver_photos', 'public');
            }

            // Step 3: Create Driver Application
            DriverApplication::create([
                'user_id' => $user->id,
                'driving_license' => $request->driving_license,
                'car_plate' => $request->car_plate,
                'vehicle_brand' => $request->vehicle_brand,
                'vehicle_type' => $request->vehicle_type,
                'total_seats' => $request->total_seats,
                'photo_path' => $photoPath,
            ]);

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
