<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\JobRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search', '');
        $jobRoleId = $request->query('job_role_id', '');

        $courses = Course::query()
            ->with('jobRole:id,name')
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%"))
            ->when($jobRoleId, fn ($q) => $q->where('job_role_id', $jobRoleId))
            ->orderBy('order')
            ->paginate(20);

        return response()->json($courses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_role_id' => 'required|exists:job_roles,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'field' => 'nullable|string|max:100',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'duration_minutes' => 'required|integer|min:0',
            'order' => 'nullable|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['title'] . '-' . Str::random(6));

        $course = Course::query()->create($validated);

        return response()->json(['data' => $course->load('jobRole:id,name'), 'message' => 'Course created successfully.'], 201);
    }

    public function show(Course $course): JsonResponse
    {
        return response()->json(['data' => $course->load('jobRole', 'videos')]);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $validated = $request->validate([
            'job_role_id' => 'sometimes|exists:job_roles,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'field' => 'nullable|string|max:100',
            'level' => 'sometimes|in:Beginner,Intermediate,Advanced',
            'duration_minutes' => 'sometimes|integer|min:0',
            'order' => 'nullable|integer|min:0',
        ]);

        $course->update($validated);

        return response()->json(['data' => $course->fresh()->load('jobRole:id,name'), 'message' => 'Course updated successfully.']);
    }

    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully.']);
    }
}
