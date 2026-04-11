<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            // A quiz can belong to a course OR a job role (final test)
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('job_role_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['course', 'final'])->default('course');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
