<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\User;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'answers' => 'required|array',
        ]);

        $quiz = Quiz::with('questions')->findOrFail($request->quiz_id);

        $score = 0;
        $totalQuestions = $quiz->questions->count();
        $answersGiven = $request->answers;

        foreach ($quiz->questions as $question) {
            $providedAnswer = $answersGiven[$question->id] ?? null;
            if ($providedAnswer === $question->correct_answer) {
                $score++;
            }
        }

        $percentage = ($totalQuestions > 0) ? ($score / $totalQuestions) * 100 : 0;
        $passed = $percentage >= 80;

        $result = QuizResult::create([
            'user_id' => $request->user()->id,
            'quiz_id' => $quiz->id,
            'score' => $percentage,
            'answers' => $answersGiven,
            'passed' => $passed,
        ]);

        /** @var User $user */
        $user = $request->user();

        if ($passed) {
            $user->xp_points += 50;

            while ($user->xp_points >= $user->level * 500) {
                $user->level++;
            }

            $user->save();
        }

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'passed' => $passed,
            'score' => $percentage,
            'correct_answers' => $score,
            'total_questions' => $totalQuestions,
            'xp_awarded' => $passed ? 50 : 0,
            'data' => $result,
        ]);
    }
}
