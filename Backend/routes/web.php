<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/admin/ride-history', [RideController::class, 'index'])->name('ride.history');
