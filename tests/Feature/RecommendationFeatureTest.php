<?php

use App\Models\User;

test('job recommendation algorithm returns valid job role based on answers', function () {
    $user = User::factory()->create();

    // Simulating frontend answering purely logic/backend questions
    $response = $this->actingAs($user)->postJson('/api/recommend-job', [
        'answers' => ['logic', 'databases', 'servers', 'api'],
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'recommended_role' => ['name', 'category', 'description', 'icon'],
            'match_percentage',
            'scores',
        ]);

    $recommendedName = $response->json('recommended_role.name');

    // Because answers are extremely backend-heavy, we expect Backend Engineer
    expect($recommendedName)->toContain('Backend');
});

test('job recommendation handles empty database and empty answers gracefully', function () {
    $response = $this->postJson('/api/recommend-job', [
        'answers' => [], // Skipping all questions
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'recommended_role',
            'match_percentage',
        ]);

    // It should at least return a fallback role (likely Frontend Developer Default)
    expect($response->json('recommended_role'))->not->toBeNull();
});
