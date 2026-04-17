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
        Schema::table('certificates', function (Blueprint $table) {
            $table->string('type')->default('job_role')->after('job_role_id');
            $table->foreignId('course_id')->nullable()->after('type')->constrained()->nullOnDelete();
            $table->dropForeign(['job_role_id']);
            $table->foreignId('job_role_id')->nullable()->change();
            $table->foreign('job_role_id')->references('id')->on('job_roles')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn(['type', 'course_id']);
            $table->dropForeign(['job_role_id']);
            $table->foreignId('job_role_id')->nullable(false)->change();
            $table->foreign('job_role_id')->references('id')->on('job_roles')->cascadeOnDelete();
        });
    }
};
