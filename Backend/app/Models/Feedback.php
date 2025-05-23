<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    // The table name (optional if follows Laravel convention)
    protected $table = 'feedback';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id',
        'rating',
        'comment',
    ];

    // Relationships

    // Feedback belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
