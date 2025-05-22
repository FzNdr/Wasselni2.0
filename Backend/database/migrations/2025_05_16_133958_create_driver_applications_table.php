<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriverApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('driver_applications', function (Blueprint $table) {
        $table->id();
        $table->string('photo_path')->nullable();
        $table->string('status')->default('pending');
        $table->timestamp('submitted_at')->nullable();
        $table->timestamps(); // 👈 this adds created_at and updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('driver_applications');
    }
}
