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

class DummyAccountSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or Find Dummy User
        $user = User::firstOrCreate(
            ['email' => 'dummy@example.com'],
            [
                'name' => 'Dummy Account',
                'password' => bcrypt('password'),
                'xp_points' => 3500,
                'level' => 12,
                'current_streak' => 15,
                'learning_hours' => 45,
                'learning_seconds' => 45 * 3600,
                'last_active_at' => now(),
            ]
        );

        // Fetch existing data
        $jobRole = JobRole::first();
        if (! $jobRole) {
            $this->command->warn('No JobRoles found, skipping dummy data. Run CourseVideoSeeder first.');

            return;
        }

        $course = $jobRole->courses()->first();

        // 2. Add Learning Path
        LearningPath::firstOrCreate([
            'user_id' => $user->id,
            'job_role_id' => $jobRole->id,
        ], [
            'status' => 'completed',
            'progress_percent' => 100,
        ]);

        // 3. Complete all Videos in all courses of the job role
        $courses = $jobRole->courses;
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

            // 4. Create a Course Certificate for each course
            Certificate::firstOrCreate([
                'user_id' => $user->id,
                'course_id' => $course->id,
            ], [
                'type' => 'course',
                'job_role_id' => null,
                'certificate_number' => 'CERT-CRS-'.strtoupper(Str::random(8)),
                'issued_at' => now()->subDays(rand(1, 10)),
            ]);

            // 6. Create Dummy Quizzes & Results for each course
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

        // 5. Create a Job Role Certificate
        Certificate::firstOrCreate([
            'user_id' => $user->id,
            'job_role_id' => $jobRole->id,
            'course_id' => null, // Ensure course_id is explicitly null for job role certificates
        ], [
            'type' => 'job_role',
            'certificate_number' => 'CERT-ROLE-'.strtoupper(Str::random(8)),
            'issued_at' => now()->subDays(1),
        ]);

        $this->command->info('Dummy Account created/updated with gamification data and certificates.');
    }
}
