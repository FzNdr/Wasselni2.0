<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RideController;
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
use App\Http\Controllers\FeedbackController;

// Public routes (no auth)
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
    Route::post('/request-ride', [RideController::class, 'updateRideStatus']); // might be better named

    // Payments
    Route::post('/payment/cash', [PaymentController::class, 'payWithCash']);
    Route::post('/payment/credits', [PaymentController::class, 'payWithCredits']);

    // Rider Profile
    Route::get('/rider/profile', [RiderController::class, 'profile']);
    Route::post('/rider/profile', [RiderController::class, 'updateProfile']);


Route::get('/rider-locations', [RiderLocationController::class, 'index']);
Route::post('/rider-locations-store', [RiderLocationController::class, 'store']);
Route::post('/rider-locations/update', [RiderLocationController::class, 'updateLocation']);

    // Driver Locations
    Route::post('/driver-locations/store', [DriverLocationController::class, 'store']);
    Route::post('/driver-locations/update', [DriverLocationController::class, 'updateLocation']);
    Route::get('/driver-locations', [DriverLocationController::class, 'index']);

    // Ride Requests (Rider-side)
     Route::post('/ride-requests', [RideRequestController::class, 'store']);
Route::post('/ride-requests/{id}/accept', [RideRequestController::class, 'accept']);
Route::post('ride-requests/{id}/deny', [RideRequestController::class, 'deny']);
Route::post('/ride-requests/{id}/counter', [RideRequestController::class, 'counter']);
Route::post('/ride-requests/confirm', [RideRequestController::class, 'confirmCounter']);
Route::get('/ride-requests/incoming', [RideRequestController::class, 'incoming']);
Route::get('/ride/fare', [RideRequestController::class, 'getFare']);


    // Driver Applications
    Route::post('/driver-applications', [DriverApplicationController::class, 'store']);
    Route::get('/driver-applications', [DriverApplicationController::class, 'index']);
    Route::post('/driver-applications/{id}/approve', [DriverApplicationController::class, 'approve']);
    Route::post('/driver-applications/{id}/deny', [DriverApplicationController::class, 'deny']);

    // Ride History
    Route::get('/rider/history', [RideHistoryController::class, 'riderHistory']);
    Route::get('/driver/history', [RideHistoryController::class, 'driverHistory']);

    // Nearby Riders and Drivers
    Route::get('/ridersnearby', [DriverLocationController::class, 'nearbyRiders']);
    Route::get('/driversnearby', [RiderLocationController::class, 'nearbyDrivers']);
    Route::get('/drivers/nearby-riders', [DriverLocationController::class, 'nearbyRiders']);
    Route::post('/nearby-drivers', [DriverLocationController::class, 'nearbyDrivers']);

//feedback 
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback', [FeedbackController::class, 'index']); 


Route::post('/rider-locations/store', [RiderLocationController::class, 'store']);
Route::post('/rider-locations/update', [RiderLocationController::class, 'updateLocation']);
Route::get('/rider-locations', [RiderLocationController::class, 'index']);