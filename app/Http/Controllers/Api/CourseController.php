<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Courses', description: 'API Endpoints for Courses')]
class CourseController extends Controller
{
    #[OA\Get(path: '/api/courses', operationId: 'getCourses', summary: 'Get list of courses', tags: ['Courses'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function index(Request $request)
    {
        $query = Course::query()->with('jobRole');

        if ($request->has('field')) {
            $query->where('field', $request->field);
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $courses = $query->get();

        return response()->json(['data' => $courses]);
    }

    public function show($slug)
    {
        $course = Course::where('slug', $slug)->with('jobRole')->firstOrFail();

        return response()->json(['data' => $course]);
    }

    public function videos($slug)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        $videos = $course->videos()->orderBy('order')->get();

        return response()->json(['data' => $videos]);
    }

    public function quiz($slug)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        $quiz = $course->quizzes()->with('questions')->first();

        if (! $quiz) {
            return response()->json(['message' => 'No quiz found for this course.'], 404);
        }

        return response()->json(['data' => $quiz]);
    }
}
