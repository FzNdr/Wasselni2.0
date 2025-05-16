<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('promotions', function (Blueprint $table) {
        $table->id();
        $table->string('title')->nullable();
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->text('description')->nullable();
        $table->string('action')->nullable(); // e.g. discount code or percentage
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::dropIfExists('promotions');
}

};
