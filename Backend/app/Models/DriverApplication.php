<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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
