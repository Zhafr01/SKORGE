<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@skorge.com'],
            [
                'name' => 'SKORGE Admin',
                'email' => 'admin@skorge.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'xp_points' => 0,
            ]
        );

        $this->command->info('Admin account created: admin@skorge.com / password');
    }
}
