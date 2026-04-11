<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_leaderboard_returns_top_users()
    {
        // Create 15 users with random XP
        User::factory()->count(15)->create()->each(function ($u) {
            $u->xp_points = mt_rand(10, 1000);
            $u->save();
        });

        // Top user
        $topUser = clone User::factory()->create(['xp_points' => 9999]);

        $response = $this->actingAs($topUser)->getJson('/api/stats/leaderboard');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => [['id', 'name', 'xp_points', 'level']]]);

        $data = $response->json('data');
        $this->assertCount(10, $data);
        $this->assertEquals(9999, $data[0]['xp_points']);
    }

    public function test_rewards_returns_correct_pet_evolution()
    {
        $user = clone User::factory()->create(['xp_points' => 6500, 'current_streak' => 15]);

        $response = $this->actingAs($user)->getJson('/api/stats/rewards');

        $response->assertStatus(200);

        $data = $response->json('data');
        
        // At 6500 XP, should be Stage 4: Astra
        $this->assertEquals(4, $data['pet']['stage']);
        $this->assertEquals('Astra', $data['pet']['name']);
        
        // Assert prizes unlocking (500, 2000, 6000 are unlocked) -> 3 prizes
        $unlockedCount = collect($data['prizes'])->where('unlocked', true)->count();
        $this->assertEquals(3, $unlockedCount);
    }
}
