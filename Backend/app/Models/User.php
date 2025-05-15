<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'username', 'first_name', 'last_name', 'phone_number', 'gov_id', 
        'password', 'driving_license', 'car_plate', 'vehicle_brand', 
        'vehicle_type', 'total_seats', 'registration_type'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function ridesAsRider()
    {
        return $this->hasMany(Ride::class, 'rider_id');
    }

    public function ridesAsDriver()
    {
        return $this->hasMany(Ride::class, 'driver_id');
    }

    public function driverLocation()
    {
        return $this->hasOne(DriverLocation::class, 'driver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
