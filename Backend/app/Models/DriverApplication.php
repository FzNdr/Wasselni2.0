<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverApplication extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'username',
    'firstName',
    'lastName',
    'phoneNumber',
    'govId',
    'password',
    'drivingLicense',
    'carPlate',
    'vehicleBrand',
    'vehicleType',
    'totalSeats',
    'photo_path',
    'status',
    'submitted_at',
    'reviewed_at',
    'reviewer_id',
];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
