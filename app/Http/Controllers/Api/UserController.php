<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\QuizResult;
use App\Models\User;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $learningPaths = $user->learningPaths()->with('jobRole')->get();

        $activePaths = $learningPaths->map(function ($path) {
            $jobRole = $path->jobRole;
            $courses = clone $jobRole->courses;
            $totalCourses = max($courses->count(), 1);
            $progress = $path->progress_percent ?? 0;

            return [
                'id' => $path->id,
                'job_role' => $jobRole,
                'progress' => $progress,
                'next_course' => clone $courses->first(),
            ];
        });

        $totalUsers = max(User::count(), 1);
        $usersAhead = User::where('xp_points', '>', $user->xp_points)->count();
        $rankPercent = max(1, ceil((($usersAhead + 1) / $totalUsers) * 100));

        $userCourses = $this->getUserCoursesWithProgress($user);
        $coursesCompleted = $userCourses->where('status', 'completed')->count();
        $ongoingCourses = $userCourses->where('status', '!=', 'completed')->values();

        $quizzesCompleted = QuizResult::query()
            ->where('user_id', $user->id)
            ->where('passed', true)
            ->count();

        return response()->json([
            'data' => [
                'user' => $user,
                'active_paths' => $activePaths,
                'ongoing_courses' => $ongoingCourses,
                'stats' => [
                    'coursesCompleted' => $coursesCompleted,
                    'quizzesCompleted' => $quizzesCompleted,
                    'hoursLearning' => $user->learning_hours ?? 0,
                    'currentStreak' => $user->current_streak ?? 0,
                    'globalRank' => "Top {$rankPercent}%",
                ],
            ],
        ]);
    }

    public function myCourses(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => $this->getUserCoursesWithProgress($user)->values(),
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
            'data' => $request->user()->certificates()->with(['jobRole', 'course.jobRole'])->get(),
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
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/'.$path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Get all courses where the user has at least one video progress record.
     *
     * @return Collection<int, array{id: int, title: string, slug: string, field: string|null, level: string, thumbnail: string, progress: int, status: string, completed_videos: int, total_videos: int}>
     */
    private function getUserCoursesWithProgress(User $user): Collection
    {
        $userVideoProgress = VideoProgress::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('video_id');

        if ($userVideoProgress->isEmpty()) {
            return collect();
        }

        $videoIds = $userVideoProgress->keys()->toArray();

        return Course::query()
            ->whereHas('videos', fn ($q) => $q->whereIn('id', $videoIds))
            ->with('videos')
            ->get()
            ->map(function ($course) use ($userVideoProgress) {
                $totalVideos = $course->videos->count();
                $completedVideos = $course->videos->filter(
                    fn ($v) => $userVideoProgress->has($v->id) && $userVideoProgress[$v->id]->completed
                )->count();

                $progress = $totalVideos > 0 ? (int) round(($completedVideos / $totalVideos) * 100) : 0;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'field' => $course->field,
                    'level' => $course->level,
                    'thumbnail' => $course->thumbnail,
                    'thumbnail_url' => $course->thumbnail,
                    'progress' => $progress,
                    'status' => $progress >= 100 ? 'completed' : 'in_progress',
                    'completed_videos' => $completedVideos,
                    'total_videos' => $totalVideos,
                ];
            });
    }
}
