<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRole;
use App\Models\LearningPath;
use Illuminate\Http\Request;

class LearningPathController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'job_role_id' => 'required|exists:job_roles,id',
        ]);

        $user = $request->user();
        $jobRole = JobRole::with('courses')->findOrFail($request->job_role_id);

        $path = LearningPath::firstOrCreate(
            ['user_id' => $user->id, 'job_role_id' => $jobRole->id],
            [
                'status' => 'in_progress',
                'progress_percent' => 0,
            ]
        );

        // Attach courses logically
        foreach ($jobRole->courses as $index => $course) {
            $status = ($index === 0) ? 'unlocked' : 'locked';

            $path->courses()->syncWithoutDetaching([
                $course->id => ['status' => $status],
            ]);
        }

        return response()->json([
            'message' => 'Learning path started successfully',
            'data' => $path->load('courses'),
        ]);
    }
}
