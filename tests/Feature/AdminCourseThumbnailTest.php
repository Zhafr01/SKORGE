<?php

use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('stores a thumbnail when creating a course', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $jobRole = JobRole::factory()->create();

    $response = $this->actingAs($admin)->postJson('/api/admin/courses', [
        'title' => 'Test Course With Photo',
        'job_role_id' => $jobRole->id,
        'level' => 'Beginner',
        'duration_minutes' => 60,
        'thumbnail' => UploadedFile::fake()->image('course-photo.png', 400, 300),
    ]);

    $response->assertStatus(201);

    $course = Course::query()->where('title', 'Test Course With Photo')->first();
    expect($course->getRawOriginal('thumbnail'))->toStartWith('/storage/thumbnails/');

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $course->getRawOriginal('thumbnail')));
});

it('updates the thumbnail when editing a course via POST with _method PUT', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $jobRole = JobRole::factory()->create();
    $course = Course::factory()->create(['job_role_id' => $jobRole->id]);

    expect($course->getRawOriginal('thumbnail'))->toBeNull();

    $response = $this->actingAs($admin)->post("/api/admin/courses/{$course->id}", [
        '_method' => 'PUT',
        'title' => $course->title,
        'level' => $course->level,
        'duration_minutes' => $course->duration_minutes,
        'thumbnail' => UploadedFile::fake()->image('updated-photo.jpg', 800, 600),
    ]);

    $response->assertSuccessful();

    $course->refresh();
    expect($course->getRawOriginal('thumbnail'))->toStartWith('/storage/thumbnails/');

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $course->getRawOriginal('thumbnail')));
});

it('returns default thumbnail when no custom thumbnail is set', function () {
    $jobRole = JobRole::factory()->create();
    $course = Course::factory()->create(['job_role_id' => $jobRole->id, 'field' => 'Design']);

    expect($course->thumbnail)->toBe('/thumbnails/design.png');
});
