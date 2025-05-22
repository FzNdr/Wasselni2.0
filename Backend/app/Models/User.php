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
        'password',
        'role',  // 'rider' or 'driver'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function driverApplication()
    {
        return $this->hasOne(DriverApplication::class);
    }
}
