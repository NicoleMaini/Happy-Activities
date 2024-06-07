<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Mario Rossi',
            'email' => 'mariorossi@gmail.com',
            'profile_image' => 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.672697106.1717632000&semt=ais_user',
            'role' => 'lead',
        ]);
        User::factory()->create([
            'name' => 'Rossella Giallo',
            'email' => 'rossellagiallo@libero.it',
            'profile_image' => 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg?size=338&ext=jpg&ga=GA1.1.672697106.1717632000&semt=ais_user',
            'role' => 'lead',
        ]);
        User::factory()->create([
            'name' => 'Lisa Blu',
            'email' => 'lisablu@hotmail.it',
            'profile_image' => 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303065.jpg?size=338&ext=jpg&ga=GA1.1.672697106.1717632000&semt=ais_user',
            'role' => 'lead',
        ]);
        User::factory()->create([
            'name' => 'Gino Verdi',
            'email' => 'ginoverdi@gmail.com',
            'profile_image' => 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833546.jpg?size=338&ext=jpg&ga=GA1.1.672697106.1717632000&semt=ais_user',
            'role' => 'lead',
        ]);

        $users = User::all();
        $projects = Project::all();

        // Popola la tabella ponte project_user
        foreach ($users as $user) {
            $user->projects()->attach($user->id);
        }
    }
}
