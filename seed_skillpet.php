<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

try {
    echo "[INFO] Testing DB Connection...\n";
    $test = DB::select('show tables');
    echo "[INFO] Connected to DB!\n";

    $users = [
        ['name' => 'Stage 1', 'email' => 'stage1@skorge.test', 'xp_points' => 100, 'level' => 2],
        ['name' => 'Ready Stage 2', 'email' => 'ready2@skorge.test', 'xp_points' => 490, 'level' => 4],
        ['name' => 'Stage 2', 'email' => 'stage2@skorge.test', 'xp_points' => 1000, 'level' => 7],
        ['name' => 'Ready Stage 3', 'email' => 'ready3@skorge.test', 'xp_points' => 1980, 'level' => 9],
        ['name' => 'Stage 3', 'email' => 'stage3@skorge.test', 'xp_points' => 3000, 'level' => 12],
        ['name' => 'Ready Stage 4', 'email' => 'ready4@skorge.test', 'xp_points' => 5980, 'level' => 19],
        ['name' => 'Stage 4', 'email' => 'stage4@skorge.test', 'xp_points' => 8000, 'level' => 22],
        ['name' => 'Ready Stage 5', 'email' => 'ready5@skorge.test', 'xp_points' => 14980, 'level' => 34],
        ['name' => 'Stage 5', 'email' => 'stage5@skorge.test', 'xp_points' => 20000, 'level' => 40],
        ['name' => 'Phantom Pet', 'email' => 'phantom@skorge.test', 'xp_points' => 20000, 'current_streak' => 100, 'level' => 45],
        ['name' => 'Golden Pet', 'email' => 'golden@skorge.test', 'xp_points' => 20000, 'current_streak' => 10, 'level' => 50],
    ];

    $count = 0;
    foreach ($users as $u) {
        User::updateOrCreate(
            ['email' => $u['email']],
            [
                'name' => $u['name'],
                'level' => $u['level'],
                'xp_points' => $u['xp_points'],
                'current_streak' => $u['current_streak'] ?? 0,
                'password' => Hash::make('password'),
            ]
        );
        $count++;
    }
    echo "[SUCCESS] Seeded $count test users successfully to MySQL!\n";
} catch (Exception $e) {
    echo "\n[ERROR] ".$e->getMessage()."\n";
    echo '[TRACE] '.$e->getTraceAsString()."\n";
}
