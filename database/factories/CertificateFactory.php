<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'job_role_id' => JobRole::factory(),
            'type' => 'job_role',
            'course_id' => null,
            'certificate_number' => 'SKORGE-'.strtoupper(Str::random(10)),
        ];
    }

    /**
     * Create a course-type certificate.
     */
    public function courseType(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'course',
            'job_role_id' => null,
            'course_id' => Course::factory(),
        ]);
    }
}
