<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverApplication extends Model
{
    protected $table = 'driver_applications';

    protected $fillable = [
        'user_id',
        'driving_license',
        'car_plate',
        'vehicle_brand',
        'vehicle_type',
        'total_seats',
        'photo_path',
    ];

    // Relationship back to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
