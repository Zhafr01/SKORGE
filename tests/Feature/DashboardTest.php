<?php

use App\Models\User;

test('guests cannot access protected api routes', function () {
    $response = $this->getJson('/api/user');
    $response->assertUnauthorized();
});

test('authenticated users can access their data', function () {
    $user = User::factory()->create();
    $this->actingAs($user, 'sanctum');

    $response = $this->getJson('/api/user');
    $response->assertOk();
    $response->assertJson([
        'email' => $user->email,
    ]);
});
