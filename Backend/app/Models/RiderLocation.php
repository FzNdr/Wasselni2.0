<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiderLocation extends Model
{
    use HasFactory;
    protected $table = 'rider_locations';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
    ];
public function user()
{
    return $this->belongsTo(User::class);
}
    
}
