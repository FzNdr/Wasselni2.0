<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date', 'target_role', 'description'];

    protected $dates = ['start_date', 'end_date'];
}
