<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'user_id',
        'car_plate',
        'vehicle_brand',
        'vehicle_type',
        'total_seats',
        'driving_license',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
