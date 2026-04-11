<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminCourseController;
use App\Http\Controllers\Api\Admin\AdminJobRoleController;
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
    Route::post('/user/pet', [UserController::class, 'updatePet']);

    // Gamification Stats
    Route::post('/user/heartbeat', [StatsController::class, 'heartbeat']);
    Route::get('/stats/leaderboard', [StatsController::class, 'leaderboard']);
    Route::get('/stats/rewards', [StatsController::class, 'rewards']);
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
    Route::delete('/courses/{course}', [AdminCourseController::class, 'destroy']);

    // Job Role Management
    Route::get('/job-roles', [AdminJobRoleController::class, 'index']);
    Route::post('/job-roles', [AdminJobRoleController::class, 'store']);
    Route::get('/job-roles/{jobRole}', [AdminJobRoleController::class, 'show']);
    Route::put('/job-roles/{jobRole}', [AdminJobRoleController::class, 'update']);
    Route::delete('/job-roles/{jobRole}', [AdminJobRoleController::class, 'destroy']);
});

// AI Features
Route::post('/ai/cv-summary', [AiController::class, 'generateCvSummary']);
Route::post('/ai/match-jobs', [AiController::class, 'matchJobs']);
Route::post('/ai/generate-quiz', [AiController::class, 'generateQuiz']);

// Job Recommendation Wizard Endpoint
Route::post('/recommend-job', [RecommendationController::class, 'recommend']);

// Mock Endpoints for SPA Data fetching fallback
Route::get('/job-roles', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Frontend Developer', 'category' => 'Engineering', 'description' => 'Kuasai React, Vue, dan arsitektur CSS modern untuk membangun antarmuka pengguna yang memukau.', 'icon' => 'code'],
        ['id' => 2, 'name' => 'Backend Engineer', 'category' => 'Engineering', 'description' => 'Bangun API yang skalabel dan arsitektur server menggunakan Laravel, Node.js, dan pemodelan database tingkat lanjut.', 'icon' => 'database'],
        ['id' => 3, 'name' => 'UI/UX Designer', 'category' => 'Design', 'description' => 'Rancang pengalaman digital yang interaktif menggunakan Figma dan metodologi riset pengguna.', 'icon' => 'pen-tool'],
        ['id' => 4, 'name' => 'Data Scientist', 'category' => 'Data', 'description' => 'Pelajari SQL, Python, dan Tableau untuk mengekstrak wawasan yang dapat ditindaklanjuti dari data mentah.', 'icon' => 'bar-chart-2'],
    ]);
});

Route::get('/job-roles/{id}', function ($id) {
    if ($id == 1) {
        return response()->json([
            'id' => 1, 'name' => 'Frontend Developer', 'category' => 'Engineering', 'description' => 'Kuasai React, Vue, dan arsitektur CSS modern untuk membangun antarmuka pengguna yang memukau.', 'icon' => 'code',
        ]);
    }
    abort(404);
});

Route::get('/job-roles/{id}/courses', function () {
    return response()->json([
        ['id' => 1, 'title' => 'HTML & CSS Fundamentals', 'level' => 'Beginner', 'duration_minutes' => 120, 'field' => 'IT', 'thumbnail' => '/thumbnails/web-fundamentals.png'],
        ['id' => 2, 'title' => 'JavaScript Mastery', 'level' => 'Intermediate', 'duration_minutes' => 240, 'field' => 'IT', 'thumbnail' => '/thumbnails/web-fundamentals.png'],
        ['id' => 3, 'title' => 'React Modern Patterns', 'level' => 'Advanced', 'duration_minutes' => 180, 'field' => 'IT', 'thumbnail' => '/thumbnails/web-fundamentals.png'],
        ['id' => 99, 'title' => 'Mastering AI Tools (100% Complete)', 'level' => 'Master', 'duration_minutes' => 60, 'field' => 'AI', 'thumbnail' => '/thumbnails/web-fundamentals.png'],
    ]);
});

Route::get('/courses/{id}', function ($id) {
    if ($id == 99) {
        return response()->json([
            'id' => 99,
            'title' => 'Mastering AI Tools (100% Complete)',
            'level' => 'Master',
            'field' => 'AI',
            'description' => 'A special dummy course designed to test the 100% completion gamification features including Quiz unlocking.',
            'duration_minutes' => 60,
            'thumbnail' => '/thumbnails/web-fundamentals.png',
        ]);
    }

    $field = 'IT';
    $thumb = '/thumbnails/web-fundamentals.png';
    if ($id == 2) { $field = 'IT'; $thumb = '/thumbnails/web-fundamentals.png'; }
    if ($id == 3) { $field = 'Design'; $thumb = '/thumbnails/design.png'; }
    if ($id == 4) { $field = 'Data'; $thumb = '/thumbnails/data.png'; }

    return response()->json([
        'id' => $id,
        'title' => 'JavaScript Mastery', // Mocked title
        'level' => 'Intermediate',
        'field' => $field,
        'thumbnail' => $thumb,
        'description' => 'Deep dive into closures, promises, and the event loop.',
        'duration_minutes' => 240,
    ]);
});

Route::get('/courses/{id}/videos', function ($id) {
    if ($id == 99) {
        return response()->json([
            ['id' => 901, 'title' => 'Intro to AI', 'youtube_id' => 'TNhaISOUy6Q', 'duration_seconds' => 300, 'completed' => true, 'unlocked' => true],
            ['id' => 902, 'title' => 'Prompt Engineering', 'youtube_id' => 'J-g9ZJha8FE', 'duration_seconds' => 450, 'completed' => true, 'unlocked' => true],
            ['id' => 903, 'title' => 'Agentic Systems', 'youtube_id' => 'rFnfvhtrNbQ', 'duration_seconds' => 600, 'completed' => true, 'unlocked' => true],
        ]);
    }
    abort(404);
});
