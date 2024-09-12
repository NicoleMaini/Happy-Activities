<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::factory()->create([
            'cover_image' => 'https://theuniqueacademy.co.in/assets/images/test.png',
            'name' => 'Activities',
            'type' => 'together',
            'progress' => 'active',
            'description' => 'I am looking forward to incorporating new activities into my routine',
        ]);
        Project::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-clipart/20230814/original/pngtree-online-registration-or-sign-up-login-for-account-on-smartphone-app-picture-image_7930307.png',
            'name' => 'Project Butterfly',
            'type' => 'together',
            'progress' => 'active',
            'description' => 'To create a landing page for a development team, focus on highlighting their skills, services, and past projects succinctly',
        ]);
        Project::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-meetings-clipart-cartoon-people-working-in-office-vector-png-image_6808182.png',
            'name' => 'Project Building',
            'type' => 'alone',
            'progress' => 'active',
            'description' => 'Completing an architectural project for university involves understanding requirements, creating a detailed plan, collaborating closely with team members and stakeholders',
        ]);
        Project::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-vector/20221007/ourmid/pngtree-young-man-learning-japanese-by-himself-semi-flat-color-vector-character-png-image_6263314.png',
            'name' => 'Marriage',
            'type' => 'alone',
            'progress' => 'active',
            'description' => 'Organizing a wedding involves several key aspects. Firstly, setting a date and venue for the ceremony and reception. Then, managing guest lists, catering, decor, and entertainment',
        ]);
    }
}
