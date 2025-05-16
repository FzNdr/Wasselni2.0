<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'ride_request_id', 'rider_id', 'driver_id', 'payment_method', 'amount'
    ];

    public function ride()
    {
        return $this->belongsTo(Ride::class, 'ride_request_id');
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
