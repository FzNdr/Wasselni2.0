<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RideRequest extends Model
{
    use HasFactory;

    protected $table = 'ride_requests';

    // Mass assignable fields
    protected $fillable = [
        'rider_id',
        'pickup_latitude',
        'pickup_longitude',
        'dropoff_latitude',
        'dropoff_longitude',
        'status',
        'driver_id',  // optional if assigned later
        'fare',       // optional fare price
    ];

    // Relationship to Rider (User)
    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    // Relationship to Driver (User)
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
