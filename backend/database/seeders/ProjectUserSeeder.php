<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ottieni tutti gli utenti
        $users = User::all();

        // Ottieni tutti i progetti
        $projects = Project::all()->pluck('id')->toArray();

        // Associa ogni utente a tutti i progetti
        foreach ($users as $user) {
            $user->projects()->syncWithoutDetaching($projects);
        }
    }
}
