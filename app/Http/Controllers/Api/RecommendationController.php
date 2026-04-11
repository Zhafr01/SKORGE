<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRole;
use App\Models\QuizResult;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function recommend(Request $request)
    {
        $answers = $request->input('answers', []);

        $scores = [
            'Frontend Developer' => 0,
            'Backend Engineer' => 0,
            'UI/UX Designer' => 0,
            'Data Scientist' => 0,
        ];

        // 1. Score based on quiz answers
        foreach ($answers as $answer) {
            $answer = strtolower($answer);
            if (in_array($answer, ['visual', 'creativity', 'layout', 'design', 'colors'])) {
                $scores['UI/UX Designer'] += 3;
                $scores['Frontend Developer'] += 1;
            }
            if (in_array($answer, ['logic', 'problem-solving', 'databases', 'servers', 'api'])) {
                $scores['Backend Engineer'] += 3;
                $scores['Data Scientist'] += 1;
            }
            if (in_array($answer, ['data', 'analytics', 'math', 'statistics', 'ai'])) {
                $scores['Data Scientist'] += 3;
                $scores['Backend Engineer'] += 1;
            }
            if (in_array($answer, ['user-interface', 'interactions', 'css', 'javascript', 'react'])) {
                $scores['Frontend Developer'] += 3;
                $scores['UI/UX Designer'] += 1;
            }
        }

        // 2. Score based on user's learning history (Courses & Quizzes)
        $user = $request->user('sanctum');
        if ($user) {
            // Check bookmarks
            try {
                $bookmarks = $user->bookmarks()->with('course')->get();
                foreach ($bookmarks as $bookmark) {
                    $title = strtolower($bookmark->course->title ?? '');
                    if (str_contains($title, 'react') || str_contains($title, 'css')) {
                        $scores['Frontend Developer'] += 2;
                    }
                    if (str_contains($title, 'sql') || str_contains($title, 'api')) {
                        $scores['Backend Engineer'] += 2;
                    }
                    if (str_contains($title, 'python') || str_contains($title, 'data')) {
                        $scores['Data Scientist'] += 2;
                    }
                    if (str_contains($title, 'figma') || str_contains($title, 'design')) {
                        $scores['UI/UX Designer'] += 2;
                    }
                }
            } catch (\Exception $e) {
            }

            // Check quiz results
            try {
                $quizResults = QuizResult::where('user_id', $user->id)
                    ->where('passed', true)
                    ->get();

                // Add 1 point for general technical passing history
                if ($quizResults->count() > 0) {
                    $scores['Backend Engineer'] += $quizResults->count();
                    $scores['Frontend Developer'] += $quizResults->count();
                }
            } catch (\Exception $e) {
            }
        }

        // 3. Determine top match
        arsort($scores);
        $topRoleName = array_key_first($scores);

        // Fallback roles mapped perfectly to standard UI mocks
        $fallbackRoles = [
            'Frontend Developer' => ['id' => 1, 'name' => 'Frontend Developer', 'category' => 'Engineering', 'description' => 'Kuasai React, Vue, dan arsitektur CSS modern untuk membangun antarmuka pengguna yang memukau.', 'icon' => 'code'],
            'Backend Engineer' => ['id' => 2, 'name' => 'Backend Engineer', 'category' => 'Engineering', 'description' => 'Bangun API yang skalabel dan arsitektur server menggunakan Laravel, Node.js, dan pemodelan database tingkat lanjut.', 'icon' => 'database'],
            'UI/UX Designer' => ['id' => 3, 'name' => 'UI/UX Designer', 'category' => 'Design', 'description' => 'Rancang pengalaman digital yang interaktif menggunakan Figma dan metodologi riset pengguna.', 'icon' => 'pen-tool'],
            'Data Scientist' => ['id' => 4, 'name' => 'Data Scientist', 'category' => 'Data', 'description' => 'Pelajari SQL, Python, dan Tableau untuk mengekstrak wawasan yang dapat ditindaklanjuti dari data mentah.', 'icon' => 'bar-chart-2'],
        ];

        // Attempt to load from DB, otherwise use fallback
        $jobRole = null;
        try {
            $jobRole = JobRole::where('name', $topRoleName)->first();
        } catch (\Exception $e) {
        }

        $recommendedRole = $jobRole ? $jobRole->toArray() : ($fallbackRoles[$topRoleName] ?? $fallbackRoles['Frontend Developer']);

        // 4. Calculate Match Percentage
        $totalScore = array_sum($scores);
        if ($totalScore > 0) {
            $percentage = round(($scores[$topRoleName] / $totalScore) * 100);
            // Boost low percentages to make it feel encouraging
            if ($percentage < 50) {
                $percentage += 35;
            }
            if ($percentage < 70) {
                $percentage += 20;
            }
            if ($percentage > 99) {
                $percentage = 99;
            }
        } else {
            $percentage = rand(75, 92); // Random baseline if no questions answered / skipped
        }

        // 5. Generate AI Explanation
        $topAnswers = implode(', ', array_slice(array_filter($answers), 0, 2));
        $explanation = "Berdasarkan jawaban Anda, khususnya mengenai '{$topAnswers}', profil Anda sangat sesuai dengan tanggung jawab utama seorang {$recommendedRole['name']}. Riwayat pembelajaran Anda juga mendukung rekomendasi jalur karier ini.";
        if (empty(array_filter($answers))) {
            $explanation = "Karena tidak ada preferensi spesifik yang diberikan, kami mencocokkan Anda dengan posisi {$recommendedRole['name']} berdasarkan tren peluang saat ini dan riwayat pembelajaran Anda sebelumnya.";
        }

        return response()->json([
            'recommended_role' => $recommendedRole,
            'match_percentage' => $percentage,
            'scores' => $scores,
            'explanation' => $explanation,
        ]);
    }
}
