<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\RiderController;
use App\Http\Controllers\RideRequestController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DriverApplicationController;
use App\Http\Controllers\RideHistoryController;
use App\Http\Controllers\DriverLocationController;
use App\Http\Controllers\RiderLocationController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DriverRegistrationController;

// Public routes
Route::post('/driver-register', [DriverRegistrationController::class, 'register']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/users/{id}/credits', [UserController::class, 'getCredits']);


    // User info & auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/credits', fn() => response()->json(['credits' => auth()->user()->credits]));

    // Rides
    Route::get('/rides', [RideController::class, 'index']);
    Route::post('/rides', [RideController::class, 'store']);
    Route::post('/request-ride', [RideController::class, 'updateRideStatus']);

    // Location
    Route::post('/update-location', [LocationController::class, 'update']);

    // Payments
    Route::post('/payment/cash', [PaymentController::class, 'payWithCash']);
    Route::post('/payment/credits', [PaymentController::class, 'payWithCredits']);

    // Rider Profile
    Route::get('/rider/profile', [RiderController::class, 'profile']);
    Route::post('/rider/profile', [RiderController::class, 'updateProfile']);

    // Rider Locations
    Route::post('/rider-locations', [RiderLocationController::class, 'store']);
    Route::post('/rider-locations', [RiderLocationController::class, 'updateLocation']);
    Route::get('/rider-locations', [RiderLocationController::class, 'index']);
    Route::post('/rider-locations', [RiderLocationController::class, 'store']);

    // Driver Locations
    Route::post('/driver-locations', [DriverLocationController::class, 'updateLocation']);
    Route::get('/driver-locations', [DriverLocationController::class, 'index']);
    Route::get('/driver-locations/{id}', [DriverLocationController::class, 'show']);
    Route::delete('/driver-locations/{id}', [DriverLocationController::class, 'destroy']);

    // Ride Requests
    Route::get('/ride-requests', [RideRequestController::class, 'index']);
    Route::post('/ride-requests', [RideRequestController::class, 'store']);
    Route::get('/ride-requests/{id}', [RideRequestController::class, 'show']);
    Route::post('/ride-requests/{id}/cancel', [RideRequestController::class, 'cancel']);
    Route::post('/ride/request', [RideRequestController::class, 'requestRide']);
    Route::get('/ride/status/{rideId}', [RideRequestController::class, 'rideStatus']);

    // Driver Applications
    Route::post('/driver-applications', [DriverApplicationController::class, 'store']);
    Route::get('/driver-applications', [DriverApplicationController::class, 'index']);
    Route::post('/driver-applications/{id}/approve', [DriverApplicationController::class, 'approve']);
    Route::post('/driver-applications/{id}/deny', [DriverApplicationController::class, 'deny']);

    // Ride History
    Route::get('/rider/history', [RideHistoryController::class, 'riderHistory']);
    Route::get('/driver/history', [RideHistoryController::class, 'driverHistory']);

    // Nearby riders/drivers
    Route::get('/ridersnearby', [DriverLocationController::class, 'nearbyRiders']);
    Route::get('/driversnearby', [RiderLocationController::class, 'nearbyDrivers']);
    Route::get('/drivers/nearby-riders', [DriverLocationController::class, 'nearbyRiders']);
    Route::post('/nearby-drivers', [DriverLocationController::class, 'nearbyDrivers']);

Route::post('/driver/register', [DriverRegistrationController::class, 'register']);
