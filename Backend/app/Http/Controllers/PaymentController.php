<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // Process cash payment and log it
    public function payWithCash(Request $request)
    {
        $user = $request->user();

        // You can add validation for ride ID, amount etc.
        $data = $request->validate([
            'ride_id' => 'required|integer',
            'amount' => 'required|numeric',
        ]);

        // Log payment as cash
        $payment = Payment::create([
            'ride_id' => $data['ride_id'],
            'payer_id' => $user->id,
            'payment_method' => 'cash',
            'amount' => $data['amount'],
            'status' => 'completed',
        ]);

        return response()->json(['message' => 'Cash payment recorded', 'payment' => $payment]);
    }

    // Use in-app credits to pay
    public function payWithCredits(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'ride_id' => 'required|integer',
            'amount' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            if ($user->credits < $data['amount']) {
                return response()->json(['error' => 'Insufficient credits'], 400);
            }

            // Deduct credits from rider
            $user->credits -= $data['amount'];
            $user->save();

            // TODO: Add credits to driver (you might need to find the driver from ride_id)

            // Log payment as credits
            $payment = Payment::create([
                'ride_id' => $data['ride_id'],
                'payer_id' => $user->id,
                'payment_method' => 'credits',
                'amount' => $data['amount'],
                'status' => 'completed',
            ]);

            DB::commit();

            return response()->json(['message' => 'Payment done with credits', 'payment' => $payment]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Payment failed'], 500);
        }
    }
}
