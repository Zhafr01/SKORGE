<?php

use App\Models\Certificate;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('fetches job roles from the database for cv builder role dropdown', function () {
    JobRole::factory()->create(['name' => 'Frontend Developer']);
    JobRole::factory()->create(['name' => 'Backend Developer']);

    $response = $this->getJson('/api/job-roles');

    $response->assertSuccessful()
        ->assertJsonCount(2);

    $names = collect($response->json())->pluck('name')->sort()->values()->all();
    expect($names)->toBe(['Backend Developer', 'Frontend Developer']);
});

it('fetches user certificates for cv builder certifications section', function () {
    $user = User::factory()->create();
    $jobRole = JobRole::factory()->create(['name' => 'Cloud Engineer']);

    Certificate::factory()->create([
        'user_id' => $user->id,
        'job_role_id' => $jobRole->id,
        'type' => 'job_role',
    ]);

    $response = $this->actingAs($user)->getJson('/api/user/certificates');

    $response->assertSuccessful()
        ->assertJsonCount(1, 'data');

    $cert = $response->json('data.0');
    expect($cert['type'])->toBe('job_role');
    expect($cert['job_role']['name'])->toBe('Cloud Engineer');
    expect($cert)->toHaveKey('certificate_number');
    expect($cert)->toHaveKey('issued_at');
});

it('fetches user completed courses as skills for cv builder', function () {
    $user = User::factory()->create();
    $jobRole = JobRole::factory()->create();
    $course = Course::factory()->create([
        'job_role_id' => $jobRole->id,
        'title' => 'React Fundamentals',
    ]);
    $video = Video::factory()->create(['course_id' => $course->id]);

    VideoProgress::create([
        'user_id' => $user->id,
        'video_id' => $video->id,
        'completed' => true,
    ]);

    $response = $this->actingAs($user)->getJson('/api/user/my-courses');

    $response->assertSuccessful();

    $courses = $response->json('data');
    expect($courses)->toHaveCount(1);
    expect($courses[0]['title'])->toBe('React Fundamentals');
});

it('returns empty courses for a user with no progress', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/user/my-courses');

    $response->assertSuccessful();
    expect($response->json('data'))->toBeEmpty();
});
