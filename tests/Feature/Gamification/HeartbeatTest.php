<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('records learning seconds and calculates learning hours', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->postJson('/api/user/heartbeat', ['duration' => 60])
        ->assertSuccessful()
        ->assertJsonPath('data.learning_seconds', 60);

    expect($user->fresh()->learning_seconds)->toBe(60);

    // Hit again with 3600 seconds to see if hours update
    actingAs($user)
        ->postJson('/api/user/heartbeat', ['duration' => 3600])
        ->assertSuccessful()
        ->assertJsonPath('data.learning_seconds', 3660)
        ->assertJsonPath('data.learning_hours', 1); // 3660 / 3600 = 1 hour
});

it('starts streak on first heartbeat', function () {
    $user = User::factory()->create(['last_active_at' => null]);

    actingAs($user)->postJson('/api/user/heartbeat');

    expect($user->fresh()->current_streak)->toBe(1);
    expect($user->fresh()->last_active_at)->not->toBeNull();
});

it('increments streak if active yesterday', function () {
    $yesterday = now()->subDay()->subHours(2); // strictly yesterday
    $user = User::factory()->create(['last_active_at' => $yesterday, 'current_streak' => 1]);

    actingAs($user)->postJson('/api/user/heartbeat');

    expect($user->fresh()->current_streak)->toBe(2);
});

it('resets streak if missed a day', function () {
    $twoDaysAgo = now()->startOfDay()->subDays(2);
    $user = User::factory()->create(['last_active_at' => $twoDaysAgo, 'current_streak' => 5]);

    actingAs($user)->postJson('/api/user/heartbeat');

    expect($user->fresh()->current_streak)->toBe(1);
});

it('awards xp and levels up on sufficient time', function () {
    $user = User::factory()->create([
        'xp_points' => 499,
        'level' => 1,
    ]);

    // 60 seconds = 1 XP. 499 + 1 = 500 XP = level 2
    actingAs($user)->postJson('/api/user/heartbeat', ['duration' => 60]);

    $freshUser = $user->fresh();
    expect($freshUser->xp_points)->toBe(500);
    expect($freshUser->level)->toBe(2);
});
