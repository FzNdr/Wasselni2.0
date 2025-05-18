<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promotion;
use App\Models\User;

class PromotionController extends Controller
{
    public function index(Request $request)
{
    $userRole = $request->query('role', 'all'); // default to 'all' if no role specified

    $promotions = Promotion::where('start_date', '<=', now())
        ->where('end_date', '>=', now())
        ->where(function($query) use ($userRole) {
            $query->where('target_role', 'all')
                  ->orWhere('target_role', $userRole);
        })
        ->get(['id', 'name', 'start_date', 'description', 'end_date']);

    // Calculate time_remaining for each promotion
    $promotions->transform(function ($promo) {
        $diff = now()->diff($promo->end_date);
        $promo->time_remaining = $diff->format('%d days %h hours');
        return $promo;
    });

    return response()->json($promotions);
}

}
