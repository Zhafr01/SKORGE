<?php

use App\Models\Course;
use App\Models\QuizResult;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard stats returns correct courses completed count', function () {
    $user = User::factory()->create();
    $course = Course::factory()->create();
    $videos = Video::factory()->count(3)->create(['course_id' => $course->id]);

    foreach ($videos as $video) {
        VideoProgress::create([
            'user_id' => $user->id,
            'video_id' => $video->id,
            'watched_percent' => 100,
            'completed' => true,
            'last_watched_at' => now(),
        ]);
    }

    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/user/dashboard');

    $response->assertSuccessful();
    $response->assertJsonPath('data.stats.coursesCompleted', 1);
});

test('dashboard stats returns zero courses completed when not all videos done', function () {
    $user = User::factory()->create();
    $course = Course::factory()->create();
    $videos = Video::factory()->count(3)->create(['course_id' => $course->id]);

    VideoProgress::create([
        'user_id' => $user->id,
        'video_id' => $videos[0]->id,
        'watched_percent' => 100,
        'completed' => true,
        'last_watched_at' => now(),
    ]);

    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/user/dashboard');

    $response->assertSuccessful();
    $response->assertJsonPath('data.stats.coursesCompleted', 0);
});

test('dashboard stats returns correct quizzes passed count', function () {
    $user = User::factory()->create();

    QuizResult::create([
        'user_id' => $user->id,
        'quiz_id' => null,
        'score' => 5,
        'passed' => true,
    ]);

    QuizResult::create([
        'user_id' => $user->id,
        'quiz_id' => null,
        'score' => 1,
        'passed' => false,
    ]);

    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/user/dashboard');

    $response->assertSuccessful();
    $response->assertJsonPath('data.stats.quizzesCompleted', 1);
});

test('dashboard stats returns current streak from user model', function () {
    $user = User::factory()->create(['current_streak' => 5]);

    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/user/dashboard');

    $response->assertSuccessful();
    $response->assertJsonPath('data.stats.currentStreak', 5);
});
