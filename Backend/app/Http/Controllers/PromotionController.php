<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
  public function index(Request $request)
{
    $role = $request->query('role');  // e.g. 'driver' or 'rider'
    $now = now();

    $query = Promotion::query();

    if ($role) {
        $query->where('target_role', $role);
    }

    // Only active promotions
    $query->where('start_date', '<=', $now)
          ->where('end_date', '>=', $now);

    $promotions = $query->get();

    return response()->json($promotions);
}

}
