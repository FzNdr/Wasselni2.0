<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('feedback', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('from_user_id');
    $table->unsignedBigInteger('to_user_id');
    $table->unsignedBigInteger('ride_id')->nullable();
    $table->float('rating', 2);
    $table->text('comment')->nullable();
    $table->timestamps();

    $table->foreign('from_user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('to_user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('ride_id')->references('id')->on('rides')->onDelete('set null');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
