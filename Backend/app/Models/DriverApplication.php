<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverApplication extends Model
{
    protected $table = 'driver_applications';

    protected $fillable = [
        'user_id',
        'photo_path',
    ];

    // Relationship back to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
