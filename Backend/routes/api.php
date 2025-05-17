<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\Api\RiderController;
use App\Http\Controllers\Api\RiderLocationController;
use App\Http\Controllers\Api\RideRequestController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\DriverApplicationController;
use App\Http\Controllers\Api\RideHistoryController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected (requires Sanctum middleware if added)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::post('/request-ride', [RideController::class, 'request']);
    Route::get('/rides', [RideController::class, 'index']);
    Route::post('/update-location', [LocationController::class, 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payment/cash', [PaymentController::class, 'payWithCash']);
    Route::post('/payment/credits', [PaymentController::class, 'payWithCredits']);
});
Route::middleware('auth:sanctum')->get('/user/credits', function () {
    return response()->json(['credits' => auth()->user()->credits]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rider/profile', [RiderController::class, 'profile']);
    Route::post('/rider/profile', [RiderController::class, 'updateProfile']);

    Route::post('/rider/location', [RiderLocationController::class, 'updateLocation']);

    Route::post('/payment/cash', [PaymentController::class, 'payWithCash']);
    Route::post('/payment/credits', [PaymentController::class, 'payWithCredits']);

    Route::post('/ride/request', [RideRequestController::class, 'requestRide']);
    Route::get('/ride/status/{rideId}', [RideRequestController::class, 'rideStatus']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ride-requests', [RideRequestController::class, 'index']);
    Route::post('/ride-requests', [RideRequestController::class, 'store']);
    Route::get('/ride-requests/{id}', [RideRequestController::class, 'show']);
    Route::post('/ride-requests/{id}/cancel', [RideRequestController::class, 'cancel']);
});
Route::post('/rides', [RideController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/driver-applications', [DriverApplicationController::class, 'store']);
    Route::get('/driver-applications', [DriverApplicationController::class, 'index']);
    Route::post('/driver-applications/{id}/approve', [DriverApplicationController::class, 'approve']);
    Route::post('/driver-applications/{id}/deny', [DriverApplicationController::class, 'deny']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rider/history', [RideHistoryController::class, 'riderHistory']);
    Route::get('/driver/history', [RideHistoryController::class, 'driverHistory']);
});
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\UserController;

Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/users/{id}/credits', [UserController::class, 'getCredits']);
Route::post('/register', [AuthController::class, 'register']);
