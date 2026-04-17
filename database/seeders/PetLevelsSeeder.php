<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\LearningPath;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\User;
use App\Models\VideoProgress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PetLevelsSeeder extends Seeder
{
    public function run(): void
    {
        // To make global ranking percentages work exactly (Phantom <= 2%, Golden <= 5%),
        // we need at least 100 total users. We'll generate dummy users to pad the base.
        $this->command->info('Padding database with 100 inactive filler users to ensure correct global rank percentages...');

        $fillerUsersData = [];
        for ($i = 1; $i <= 100; $i++) {
            $fillerUsersData[] = [
                'name' => "Filler User {$i}",
                'email' => "filler{$i}@example.com",
                'password' => bcrypt('password'),
                'xp_points' => rand(10, 50),
                'level' => 1,
                'current_streak' => 0,
                'learning_hours' => 0,
                'learning_seconds' => 0,
                'last_active_at' => now()->subDays(60),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        User::insert($fillerUsersData);

        // Fetch existing course/job role data to seed
        $jobRole = JobRole::first();
        if (! $jobRole) {
            $this->command->warn('No JobRoles found, skipping showcase data. Run CourseVideoSeeder first.');

            return;
        }
        $courses = $jobRole->courses;

        // The specific display accounts and their required XP to land in the right rank percentages
        $accounts = [
            // Ranking setup (Users ahead must perfectly match the rank % requirements):
            // Phantom requires Top 1% or 2%.
            // Golden requires Top 3%, 4% or 5%.
            // Max Eclipse requires > 5% but XP >= 15000.

            // Phantom #1 (0 users ahead -> Rank 1%)
            ['email' => 'phantom@example.com', 'name' => 'Phantom Master', 'xp' => 100000],
            // Phantom #2 (1 user ahead -> Rank 2%... wait, total users is ~110. 2/110 = 1.8% -> ceil = 2%)
            ['email' => 'padding_phantom@example.com', 'name' => 'Phantom Friend', 'xp' => 90000],

            // Golden #1 (2 users ahead -> 3/110 = 2.7% -> ceil = 3% -> Golden)
            ['email' => 'golden@example.com', 'name' => 'Golden Achiever', 'xp' => 80000],
            ['email' => 'padding_golden1@example.com', 'name' => 'Golden Guy 1', 'xp' => 70000],
            ['email' => 'padding_golden2@example.com', 'name' => 'Golden Guy 2', 'xp' => 60000],

            // Eclipse (5 users ahead -> 6/110 = 5.4% -> ceil = 6% > 5%)
            ['email' => 'eclipse@example.com', 'name' => 'Max Eclipse', 'xp' => 20000],

            // Other stages
            ['email' => 'astra@example.com', 'name' => 'Astra Stage', 'xp' => 10000],
            ['email' => 'volt@example.com', 'name' => 'Volt Stage', 'xp' => 4000],
            ['email' => 'nova@example.com', 'name' => 'Nova Stage', 'xp' => 1000],
            ['email' => 'rookie@example.com', 'name' => 'Rookie Spark', 'xp' => 200],
        ];

        $this->command->info('Creating interactive Showcase Accounts...');

        foreach ($accounts as $acc) {
            $user = User::updateOrCreate(
                ['email' => $acc['email']],
                [
                    'name' => $acc['name'],
                    'password' => bcrypt('password'),
                    'xp_points' => $acc['xp'],
                    'level' => max(1, floor($acc['xp'] / 500)),
                    'current_streak' => rand(10, 30),
                    'learning_hours' => rand(10, 100),
                    'learning_seconds' => rand(36000, 360000),
                    'last_active_at' => now(),
                ]
            );

            // Add Learning Path
            LearningPath::firstOrCreate([
                'user_id' => $user->id,
                'job_role_id' => $jobRole->id,
            ], [
                'status' => 'completed',
                'progress_percent' => 100,
            ]);

            // Complete all Videos in all courses of the job role
            foreach ($courses as $course) {
                $videos = $course->videos;
                foreach ($videos as $video) {
                    VideoProgress::firstOrCreate([
                        'user_id' => $user->id,
                        'video_id' => $video->id,
                    ], [
                        'completed' => true,
                        'last_watched_at' => now(),
                        'bookmarked' => false,
                    ]);
                }

                // Create a Course Certificate for each course
                Certificate::firstOrCreate([
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                ], [
                    'type' => 'course',
                    'job_role_id' => null,
                    'certificate_number' => 'CERT-CRS-'.strtoupper(Str::random(8)),
                    'issued_at' => now()->subDays(rand(1, 10)),
                ]);

                // Create Dummy Quizzes & Results for each course
                $quiz = Quiz::firstOrCreate([
                    'course_id' => $course->id,
                    'title' => 'Dummy Quiz for '.$course->title,
                    'type' => 'course',
                ]);

                QuizResult::firstOrCreate([
                    'user_id' => $user->id,
                    'quiz_id' => $quiz->id,
                ], [
                    'score' => rand(85, 100),
                    'passed' => true,
                    'completed_at' => now()->subDays(rand(1, 10)),
                ]);
            }

            // Create a Job Role Certificate
            Certificate::firstOrCreate([
                'user_id' => $user->id,
                'job_role_id' => $jobRole->id,
                'course_id' => null,
            ], [
                'type' => 'job_role',
                'certificate_number' => 'CERT-ROLE-'.strtoupper(Str::random(8)),
                'issued_at' => now()->subDays(1),
            ]);
        }

        $this->command->info("\n--- SHOWCASE ACCOUNTS CREATED ---");
        $this->command->info('Login with password: password');
        $this->command->info('1. phantom@example.com (Phantom Master - Top 1-2%)');
        $this->command->info('2. golden@example.com  (Golden Master - Top 3-5%)');
        $this->command->info('3. eclipse@example.com (Legendary Mentor - Maxed normal)');
        $this->command->info('4. astra@example.com   (Career Beast pet)');
        $this->command->info('5. volt@example.com    (Skill Hunter pet)');
        $this->command->info('6. nova@example.com    (Growing Learner pet)');
        $this->command->info('7. rookie@example.com  (Rookie Spark pet)');
    }
}
