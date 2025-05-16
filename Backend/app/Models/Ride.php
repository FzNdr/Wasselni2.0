<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    protected $fillable = [
        'rider_id', 'driver_id', 'pickup_location', 'dropoff_location', 'status', 'fare'
    ];

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'ride_request_id');
    }
}
