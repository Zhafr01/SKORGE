<?php

use App\Models\Certificate;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns user certificates with job role and course relationships', function () {
    $user = User::factory()->create();
    $jobRole = JobRole::factory()->create();
    $course = Course::factory()->create(['job_role_id' => $jobRole->id]);

    Certificate::factory()->create([
        'user_id' => $user->id,
        'job_role_id' => $jobRole->id,
        'type' => 'job_role',
    ]);

    Certificate::factory()->courseType()->create([
        'user_id' => $user->id,
        'course_id' => $course->id,
    ]);

    $response = $this->actingAs($user)->getJson('/api/user/certificates');

    $response->assertSuccessful()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'user_id', 'type', 'certificate_number'],
            ],
        ]);

    $types = collect($response->json('data'))->pluck('type')->sort()->values()->all();
    expect($types)->toBe(['course', 'job_role']);
});

it('returns job role certificate with loaded job role relationship', function () {
    $user = User::factory()->create();
    $jobRole = JobRole::factory()->create(['name' => 'Frontend Developer']);

    Certificate::factory()->create([
        'user_id' => $user->id,
        'job_role_id' => $jobRole->id,
        'type' => 'job_role',
    ]);

    $response = $this->actingAs($user)->getJson('/api/user/certificates');

    $response->assertSuccessful();
    $cert = $response->json('data.0');
    expect($cert['type'])->toBe('job_role');
    expect($cert['job_role']['name'])->toBe('Frontend Developer');
});

it('returns course certificate with loaded course relationship', function () {
    $user = User::factory()->create();
    $course = Course::factory()->create(['title' => 'React Modern Patterns']);

    Certificate::factory()->courseType()->create([
        'user_id' => $user->id,
        'course_id' => $course->id,
    ]);

    $response = $this->actingAs($user)->getJson('/api/user/certificates');

    $response->assertSuccessful();
    $cert = $response->json('data.0');
    expect($cert['type'])->toBe('course');
    expect($cert['course']['title'])->toBe('React Modern Patterns');
});

it('requires authentication to view certificates', function () {
    $this->getJson('/api/user/certificates')->assertUnauthorized();
});
