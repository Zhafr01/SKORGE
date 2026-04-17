<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminVideoController extends Controller
{
    public function index(Course $course): JsonResponse
    {
        return response()->json($course->videos()->orderBy('order')->get());
    }

    public function store(Request $request, Course $course): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'required|url|max:255',
            'duration_seconds' => 'required|integer|min:0',
            'order' => 'required|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['title'].'-'.Str::random(6));

        $video = $course->videos()->create($validated);

        return response()->json(['data' => $video, 'message' => 'Video created successfully.'], 201);
    }

    public function show(Course $course, Video $video): JsonResponse
    {
        if ($video->course_id !== $course->id) {
            abort(404);
        }

        return response()->json(['data' => $video]);
    }

    public function update(Request $request, Course $course, Video $video): JsonResponse
    {
        if ($video->course_id !== $course->id) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'url' => 'sometimes|url|max:255',
            'duration_seconds' => 'sometimes|integer|min:0',
            'order' => 'sometimes|integer|min:0',
        ]);

        if (isset($validated['title']) && $validated['title'] !== $video->title) {
            $validated['slug'] = Str::slug($validated['title'].'-'.Str::random(6));
        }

        $video->update($validated);

        return response()->json(['data' => $video->fresh(), 'message' => 'Video updated successfully.']);
    }

    public function destroy(Course $course, Video $video): JsonResponse
    {
        if ($video->course_id !== $course->id) {
            abort(404);
        }

        $video->delete();

        return response()->json(['message' => 'Video deleted successfully.']);
    }
}
