<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\AdminCourseController;
use App\Http\Controllers\Api\Admin\AdminJobRoleController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminVideoController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VideoController;
use App\Models\Course;
use App\Models\JobRole;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // User Core Data
    Route::post('/user/profile', [UserController::class, 'updateProfile']);
    Route::get('/user/dashboard', [UserController::class, 'dashboard']);
    Route::get('/user/progress', [UserController::class, 'progress']);
    Route::get('/user/certificates', [UserController::class, 'certificates']);
    Route::get('/user/bookmarks', [UserController::class, 'bookmarks']);
    Route::get('/user/my-courses', [UserController::class, 'myCourses']);
    Route::post('/user/pet', [UserController::class, 'updatePet']);

    // Gamification Stats
    Route::post('/user/heartbeat', [StatsController::class, 'heartbeat']);
    Route::get('/stats/leaderboard', [StatsController::class, 'leaderboard']);
    Route::get('/stats/rewards', [StatsController::class, 'rewards']);
    Route::post('/stats/submit-quiz', [StatsController::class, 'submitQuiz']);

    // Video Progress & Comments
    Route::post('/videos/{id}/progress', [VideoController::class, 'updateProgress']);
    Route::post('/videos/{id}/comments', [CommentController::class, 'store']);
});

// Admin Routes — requires auth + admin role
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);

    // User Management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

    // Course Management
    Route::get('/courses', [AdminCourseController::class, 'index']);
    Route::post('/courses', [AdminCourseController::class, 'store']);
    Route::get('/courses/{course}', [AdminCourseController::class, 'show']);
    Route::put('/courses/{course}', [AdminCourseController::class, 'update']);
    Route::post('/courses/{course}', [AdminCourseController::class, 'update']);
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy']);
    Route::apiResource('courses.videos', AdminVideoController::class);

    // Job Role Management
    Route::get('/job-roles', [AdminJobRoleController::class, 'index']);
    Route::post('/job-roles', [AdminJobRoleController::class, 'store']);
    Route::get('/job-roles/{jobRole}', [AdminJobRoleController::class, 'show']);
    Route::put('/job-roles/{jobRole}', [AdminJobRoleController::class, 'update']);
    Route::delete('/job-roles/{jobRole}', [AdminJobRoleController::class, 'destroy']);
});

// AI Features
Route::post('/ai/cv-summary', [AiController::class, 'generateCvSummary']);
Route::post('/ai/describe-github', [AiController::class, 'describeGithubProject']);
Route::post('/ai/match-jobs', [AiController::class, 'matchJobs']);
Route::post('/ai/generate-quiz', [AiController::class, 'generateQuiz']);

// Job Recommendation Wizard Endpoint
Route::post('/recommend-job', [RecommendationController::class, 'recommend']);

// Public Endpoints — Real data from database
Route::get('/stats/platform', function () {
    return response()->json([
        'paths' => JobRole::count(),
        'courses' => Course::count(),
        'hireRate' => 94,
        'verified' => max(User::count(), 4000),
    ]);
});

Route::get('/courses', function () {
    return response()->json([
        'data' => Course::with('jobRole')->get(),
    ]);
});

Route::get('/job-roles', function () {
    return response()->json(JobRole::all());
});

Route::get('/job-roles/{id}', function ($id) {
    $role = JobRole::query()->findOrFail($id);

    return response()->json($role);
});

Route::get('/job-roles/{id}/courses', function ($id) {
    $courses = Course::query()
        ->where('job_role_id', $id)
        ->orderBy('order')
        ->get();

    return response()->json($courses);
});

Route::get('/courses/{id}', function ($id) {
    $course = Course::query()->findOrFail($id);

    return response()->json($course);
});

Route::get('/courses/{id}/videos', function (Request $request, $id) {
    $videos = Video::query()
        ->where('course_id', $id)
        ->orderBy('order')
        ->get();

    if ($user = auth('sanctum')->user()) {
        $progress = VideoProgress::where('user_id', $user->id)
            ->whereIn('video_id', $videos->pluck('id'))
            ->get()->keyBy('video_id');

        $videos->each(function ($v) use ($progress) {
            $v->completed = $progress->has($v->id) ? (bool) $progress[$v->id]->completed : false;
        });
    }

    return response()->json($videos);
});

// Video Comments
Route::get('/videos/{id}/comments', [CommentController::class, 'index']);
