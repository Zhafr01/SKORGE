<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRole;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Job Roles', description: 'API Endpoints for Job Roles')]
class JobRoleController extends Controller
{
    #[OA\Get(path: '/api/job-roles', operationId: 'getJobRoles', summary: 'Get list of job roles', tags: ['Job Roles'])]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function index()
    {
        $jobRoles = JobRole::all();

        return response()->json(['data' => $jobRoles]);
    }

    public function show($slug)
    {
        $jobRole = JobRole::where('slug', $slug)->firstOrFail();

        return response()->json(['data' => $jobRole]);
    }

    public function courses($slug)
    {
        $jobRole = JobRole::where('slug', $slug)->firstOrFail();
        $courses = $jobRole->courses()->orderBy('order')->get();

        return response()->json(['data' => $courses]);
    }

    public function learningPath(Request $request, $slug)
    {
        $jobRole = JobRole::where('slug', $slug)->firstOrFail();
        $learningPath = $request->user()->learningPaths()
            ->where('job_role_id', $jobRole->id)
            ->with('courses')
            ->first();

        return response()->json(['data' => $learningPath]);
    }
}
