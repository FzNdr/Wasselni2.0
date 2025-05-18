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
$table->string('phone_number')->unique();
$table->string('gov_id')->unique();
$table->string('role'); // rider or driver
$table->string('password');

// Optional fields for drivers
$table->string('driving_license')->nullable()->unique();
$table->string('car_plate')->nullable()->unique();
$table->string('vehicle_brand')->nullable();
$table->string('vehicle_type')->nullable(); // SUV, Sedan, etc.
$table->integer('total_seats')->nullable();

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
