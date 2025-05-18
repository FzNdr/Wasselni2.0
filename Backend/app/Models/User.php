<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'phone_number',
        'gov_id',
        'role',
        'password',
        // Driver-specific fields
        'driving_license',
        'car_plate',
        'vehicle_brand',
        'vehicle_type',
        'total_seats',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
