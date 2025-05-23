<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverLocation extends Model
{
    // If your table does not have timestamps, uncomment the next line:
    // public $timestamps = false;

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
    ];
}
