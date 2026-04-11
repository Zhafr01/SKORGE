<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VideoProgress;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $learningPaths = $user->learningPaths()->with('jobRole')->get();

        // Format paths
        $activePaths = $learningPaths->map(function ($path) {
            $jobRole = $path->jobRole;
            $courses = clone $jobRole->courses; // Assuming JobRole has courses
            $totalCourses = max($courses->count(), 1);
            // Simulate progression for demo unless tracked
            $progress = 45;

            return [
                'id' => $path->id,
                'job_role' => $jobRole,
                'progress' => $progress,
                'next_course' => clone $courses->first(),
            ];
        });

        // Global Rank %
        $totalUsers = max(User::count(), 1);
        $usersAhead = User::where('xp_points', '>', $user->xp_points)->count();
        $rankPercent = max(1, ceil((($usersAhead + 1) / $totalUsers) * 100));

        $coursesCompleted = VideoProgress::query()
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->distinct('course_id')
            ->count('course_id');

        return response()->json([
            'data' => [
                'user' => $user,
                'active_paths' => $activePaths,
                'ongoing_courses' => [],
                'stats' => [
                    'coursesCompleted' => $coursesCompleted,
                    'hoursLearning' => $user->learning_hours ?? 0,
                    'currentStreak' => $user->current_streak ?? 0,
                    'globalRank' => "Top {$rankPercent}%",
                ],
            ],
        ]);
    }

    public function progress(Request $request)
    {
        return response()->json([
            'data' => $request->user()->learningPaths()->with('jobRole')->get(),
        ]);
    }

    public function certificates(Request $request)
    {
        return response()->json([
            'data' => $request->user()->certificates()->with('jobRole')->get(),
        ]);
    }

    public function bookmarks(Request $request)
    {
        return response()->json([
            'data' => $request->user()->bookmarks()->with('video.course')->get(),
        ]);
    }

    public function updatePet(Request $request)
    {
        $request->validate([
            'pet_name' => 'nullable|string|max:50',
            'pet_accessories' => 'nullable|array',
        ]);

        $request->user()->update([
            'pet_name' => $request->pet_name,
            'pet_accessories' => $request->pet_accessories,
        ]);

        return response()->json(['message' => 'Pet updated successfully.']);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user = $request->user();
        $user->name = $request->name;

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }
}
