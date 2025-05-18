<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
{
    Schema::table('users', function (Blueprint $table) {
        if (!Schema::hasColumn('users', 'role')) {
            $table->string('role')->after('gov_id');
        }
        if (!Schema::hasColumn('users', 'driving_license')) {
            $table->string('driving_license')->nullable()->after('password');
        }
        if (!Schema::hasColumn('users', 'car_plate')) {
            $table->string('car_plate')->nullable()->after('driving_license');
        }
        if (!Schema::hasColumn('users', 'vehicle_brand')) {
            $table->string('vehicle_brand')->nullable()->after('car_plate');
        }
        if (!Schema::hasColumn('users', 'vehicle_type')) {
            $table->string('vehicle_type')->nullable()->after('vehicle_brand');
        }
        if (!Schema::hasColumn('users', 'total_seats')) {
            $table->integer('total_seats')->nullable()->after('vehicle_type');
        }
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'role',
            'driving_license',
            'car_plate',
            'vehicle_brand',
            'vehicle_type',
            'total_seats'
        ]);
    });
}
};
