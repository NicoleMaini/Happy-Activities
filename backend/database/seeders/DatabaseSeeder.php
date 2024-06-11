<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\ProjectSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([ProjectSeeder::class, TaskSeeder::class, MicrotaskSeeder::class, UserSeeder::class]);
    }
}
