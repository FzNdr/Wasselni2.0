<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRidesTable extends Migration
{
    public function up()
    {
        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rider_id');
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->string('pickup_location');
            $table->string('dropoff_location');
            $table->enum('status', ['requested', 'accepted', 'completed', 'canceled'])->default('requested');
            $table->decimal('fare', 8, 2)->nullable();
            $table->timestamps();

            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('rides');
    }
}
