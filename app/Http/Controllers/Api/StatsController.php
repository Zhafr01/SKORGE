<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizResult;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Gamification Stats', description: 'API Endpoints for User Gamification, Leaderboards, and Rewards')]
class StatsController extends Controller
{
    #[OA\Post(path: '/api/stats/submit-quiz', operationId: 'submitQuiz', summary: 'Submit quiz and earn XP', tags: ['Gamification Stats'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function submitQuiz(Request $request)
    {
        $request->validate([
            'quiz_id' => 'nullable|integer',
            'score' => 'required|integer|min:0',
            'total_questions' => 'required|integer|min:1',
            'answers' => 'nullable|array',
        ]);

        $user = $request->user();
        $score = $request->input('score');
        $total = $request->input('total_questions');
        $passed = ($score / $total) >= 0.6; // 60% passing mark

        $quizResult = QuizResult::create([
            'user_id' => $user->id,
            'quiz_id' => $request->input('quiz_id'),
            'score' => $score,
            'answers' => $request->input('answers'),
            'passed' => $passed,
        ]);

        $xpEarned = 0;
        $leveledUp = false;

        if ($passed) {
            $xpEarned = 50; // Award 50 XP for passing
            $user->xp_points += 50;

            while ($user->xp_points >= $user->level * 500) {
                $user->level++;
                $leveledUp = true;
            }
            $user->save();
        }

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'data' => $quizResult,
            'gamification' => [
                'xp_earned' => $xpEarned,
                'leveled_up' => $leveledUp,
                'new_level' => $user->level,
                'total_xp' => $user->xp_points,
                'passed' => $passed,
            ],
        ]);
    }

    #[OA\Post(path: '/api/user/heartbeat', operationId: 'heartbeat', summary: 'Track user active time and daily streak', tags: ['Gamification Stats'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function heartbeat(Request $request)
    {
        $user = $request->user();
        $duration = (int) $request->input('duration', 60);

        $user->learning_seconds += $duration;
        $user->learning_hours = (int) floor($user->learning_seconds / 3600);

        $now = now();
        if ($user->last_active_at) {
            $lastActive = Carbon::parse($user->last_active_at);
            if ($lastActive->isYesterday()) {
                $user->current_streak += 1;
            } elseif ($lastActive->isBefore(now()->startOfDay()->subDay())) {
                $user->current_streak = 1;
            }
        } else {
            $user->current_streak = 1;
        }

        if ($duration >= 60) {
            $user->xp_points += floor($duration / 60);
            while ($user->xp_points >= $user->level * 500) {
                $user->level++;
            }
        }

        $user->last_active_at = $now;
        $user->save();

        return response()->json([
            'message' => 'Heartbeat logged',
            'data' => [
                'current_streak' => $user->current_streak,
                'learning_hours' => $user->learning_hours,
                'learning_seconds' => $user->learning_seconds,
                'xp_points' => $user->xp_points,
                'level' => $user->level,
            ],
        ]);
    }

    #[OA\Get(path: '/api/stats/leaderboard', operationId: 'getLeaderboard', summary: 'Get global leaderboard', tags: ['Gamification Stats'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function leaderboard(Request $request)
    {
        $leaderboard = User::orderBy('xp_points', 'desc')
            ->orderBy('id', 'asc')
            ->take(10)
            ->get(['id', 'name', 'xp_points', 'level']);

        return response()->json([
            'data' => $leaderboard,
        ]);
    }

    #[OA\Get(path: '/api/stats/rewards', operationId: 'getRewards', summary: 'Get user XP milestones and SkillPet status', tags: ['Gamification Stats'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function rewards(Request $request)
    {
        $user = $request->user();
        $xp = $user->xp_points ?? 0;
        $streak = $user->current_streak ?? 0;

        $totalUsers = max(User::count(), 1);
        $usersAhead = User::where('xp_points', '>', $xp)->count();
        $rankPercent = max(1, ceil((($usersAhead + 1) / $totalUsers) * 100));

        $isPhantomPercent = $rankPercent <= 2;
        $isGoldenPercent = $rankPercent <= 5;

        $prizes = [
            [
                'id' => 1,
                'name' => 'Rookie Spark',
                'description' => 'Reached Stage 2 — 500 XP',
                'xp_required' => 500,
                'unlocked' => $xp >= 500,
                'icon' => 'zap',
            ],
            [
                'id' => 2,
                'name' => 'Growing Learner',
                'description' => 'Reached Stage 3 — 2,000 XP',
                'xp_required' => 2000,
                'unlocked' => $xp >= 2000,
                'icon' => 'trending-up',
            ],
            [
                'id' => 3,
                'name' => 'Skill Hunter',
                'description' => 'Reached Stage 4 — 6,000 XP',
                'xp_required' => 6000,
                'unlocked' => $xp >= 6000,
                'icon' => 'target',
            ],
            [
                'id' => 4,
                'name' => 'Career Legend',
                'description' => 'Reached Stage 5 — 15,000 XP',
                'xp_required' => 15000,
                'unlocked' => $xp >= 15000,
                'icon' => 'crown',
            ],
            [
                'id' => 5,
                'name' => 'Phantom Unlock',
                'description' => 'Top 2% of all users — Phantom Mode',
                'xp_required' => null,
                'unlocked' => $isPhantomPercent,
                'icon' => 'ghost',
            ],
            [
                'id' => 6,
                'name' => 'Golden Eclipse',
                'description' => 'Top 5% of all users — Golden Mode',
                'xp_required' => null,
                'unlocked' => $isGoldenPercent,
                'icon' => 'star',
            ],
        ];

        $petStage = match (true) {
            $xp >= 15000 => ['stage' => 5, 'name' => 'Eclipse', 'title' => 'Legendary Mentor'],
            $xp >= 6000 => ['stage' => 4, 'name' => 'Astra', 'title' => 'Career Beast'],
            $xp >= 2000 => ['stage' => 3, 'name' => 'Volt', 'title' => 'Skill Hunter'],
            $xp >= 500 => ['stage' => 2, 'name' => 'Nova', 'title' => 'Growing Learner'],
            default => ['stage' => 1, 'name' => 'Spark', 'title' => 'Rookie Spark'],
        };

        return response()->json([
            'data' => [
                'prizes' => $prizes,
                'pet' => $petStage,
                'rank_percent' => $rankPercent,
            ],
        ]);
    }
}
