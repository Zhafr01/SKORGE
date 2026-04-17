<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $totalUsers = User::query()->where('role', 'user')->count();
        $totalAdmins = User::query()->where('role', 'admin')->count();
        $totalCourses = Course::query()->count();
        $totalJobRoles = JobRole::query()->count();
        $totalXp = User::query()->sum('xp_points');

        $activeToday = User::query()
            ->whereDate('last_active_at', today())
            ->count();

        $recentUsers = User::query()
            ->where('role', 'user')
            ->latest()
            ->take(10)
            ->get(['id', 'name', 'email', 'xp_points', 'role', 'created_at']);

        $topUsers = User::query()
            ->orderByDesc('xp_points')
            ->take(5)
            ->get(['id', 'name', 'email', 'xp_points', 'current_streak']);

        return response()->json([
            'data' => [
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_admins' => $totalAdmins,
                    'total_courses' => $totalCourses,
                    'total_job_roles' => $totalJobRoles,
                    'total_xp' => $totalXp,
                    'active_today' => $activeToday,
                ],
                'recent_users' => $recentUsers,
                'top_users' => $topUsers,
            ],
        ]);
    }
}
