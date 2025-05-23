<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTimestampsToDriverLocationsTable extends Migration
{
    public function up()
    {
        Schema::table('driver_locations', function (Blueprint $table) {
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('driver_locations', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
}
