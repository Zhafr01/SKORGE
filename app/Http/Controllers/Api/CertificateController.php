<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\JobRole;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'job_role_id' => 'required|exists:job_roles,id',
        ]);

        $user = $request->user();
        $jobRole = JobRole::findOrFail($request->job_role_id);

        // Verify user completed the job role path (Mock Logic)
        $learningPath = $user->learningPaths()->where('job_role_id', $jobRole->id)->first();
        if (! $learningPath || $learningPath->status !== 'completed') {
            return response()->json([
                'message' => 'Cannot generate certificate. Learning path not completed.',
            ], 403);
        }

        // Check if already exists
        $existing = Certificate::where('user_id', $user->id)
            ->where('job_role_id', $jobRole->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Certificate already generated',
                'data' => $existing,
            ]);
        }

        $certificate = Certificate::create([
            'user_id' => $user->id,
            'job_role_id' => $jobRole->id,
            'certificate_number' => 'SKORGE-'.strtoupper(Str::random(10)),
        ]);

        return response()->json([
            'message' => 'Certificate generated successfully',
            'data' => $certificate,
        ]);
    }
}
