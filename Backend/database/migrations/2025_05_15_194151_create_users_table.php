<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('username')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number');
            $table->string('gov_id');
            $table->string('password');

            // Driver specific fields (nullable since not all users are drivers)
            $table->string('driving_license')->nullable();
            $table->string('car_plate')->nullable();
            $table->string('vehicle_brand')->nullable();
            $table->string('vehicle_type')->default('SUV')->nullable();
            $table->integer('total_seats')->nullable();

            $table->string('registration_type')->default('Rider'); // Rider or Driver

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}
