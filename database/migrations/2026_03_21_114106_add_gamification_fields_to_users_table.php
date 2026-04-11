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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'xp_points')) {
                $table->integer('xp_points')->default(0);
            }
            if (! Schema::hasColumn('users', 'level')) {
                $table->integer('level')->default(1);
            }
            if (! Schema::hasColumn('users', 'current_streak')) {
                $table->integer('current_streak')->default(0);
            }
            if (! Schema::hasColumn('users', 'learning_hours')) {
                $table->integer('learning_hours')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['xp_points', 'level', 'current_streak', 'learning_hours']);
        });
    }
};
