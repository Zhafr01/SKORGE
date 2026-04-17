<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\JobRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'job_role_id' => JobRole::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'field' => fake()->randomElement(['IT', 'Design', 'Marketing', 'Data']),
            'level' => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
            'duration_minutes' => fake()->numberBetween(30, 300),
            'order' => 0,
        ];
    }
}
