<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\JobRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminJobRoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search', '');

        $jobRoles = JobRole::query()
            ->withCount('courses')
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('courses', function ($qc) use ($search) {
                        $qc->where('title', 'like', "%{$search}%");
                    });
            })
            ->orderBy('name')
            ->paginate(20);

        return response()->json($jobRoles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'category' => 'required|string|max:100',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $jobRole = JobRole::query()->create($validated);

        return response()->json(['data' => $jobRole, 'message' => 'Job role created successfully.'], 201);
    }

    public function show(JobRole $jobRole): JsonResponse
    {
        return response()->json(['data' => $jobRole->load('courses')]);
    }

    public function update(Request $request, JobRole $jobRole): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'category' => 'sometimes|string|max:100',
            'courses_sync' => 'sometimes|array',
            'courses_sync.*' => 'exists:courses,id',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $coursesSync = $validated['courses_sync'] ?? null;
        unset($validated['courses_sync']);

        $jobRole->update($validated);

        if ($coursesSync !== null) {
            if (empty($coursesSync)) {
                Course::where('job_role_id', $jobRole->id)->update(['job_role_id' => null]);
            } else {
                Course::where('job_role_id', $jobRole->id)
                    ->whereNotIn('id', $coursesSync)
                    ->update(['job_role_id' => null]);

                Course::whereIn('id', $coursesSync)->update(['job_role_id' => $jobRole->id]);
            }
        }

        return response()->json(['data' => $jobRole->fresh()->load('courses'), 'message' => 'Job role updated successfully.']);
    }

    public function destroy(JobRole $jobRole): JsonResponse
    {
        $jobRole->delete();

        return response()->json(['message' => 'Job role deleted successfully.']);
    }
}
