<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $randomNumber = fake()->numberBetween(1, 500);
        // URL dell'immagine con numero casuale
        $profileImageUrl = 'https://source.unsplash.com/random/500x500?sig=' . $randomNumber;

        User::factory()->create([
            'name' => 'Mario Rossi',
            'email' => 'mariorossi@gmail.com',
            'profile_image' => 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg?size=338&ext=jpg&ga=GA1.1.672697106.1717632000&semt=ais_user',
        ]);
    }
}
