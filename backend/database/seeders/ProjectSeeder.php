<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'cover_image' => 'https://theuniqueacademy.co.in/assets/images/test.png',
            'name' => 'Activities',
            'type' => 'free-time',
            'description' => 'I am looking forward to incorporating new activities into my routine, such as attending the gym, engaging in reading, and enjoying lunches with friends. These pursuits will enhance my physical fitness, intellectual growth, and social connections, respectively, contributing to a well-rounded and fulfilling lifestyle.',
        ]);
        User::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-clipart/20230814/original/pngtree-online-registration-or-sign-up-login-for-account-on-smartphone-app-picture-image_7930307.png',
            'name' => 'Project Butterfly',
            'type' => 'work',
            'description' => 'To create a landing page for a development team, focus on highlighting their skills, services, and past projects succinctly. Include a clear headline, brief introduction, service descriptions, client testimonials, team member profiles, high-quality visuals, and strong calls-to-action. Keep the design clean and user-friendly to engage visitors effectively.',
        ]);
        User::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-vector/20230728/ourmid/pngtree-meetings-clipart-cartoon-people-working-in-office-vector-png-image_6808182.png',
            'name' => 'Project Building',
            'type' => 'study',
            'description' => 'Completing an architectural project for university involves understanding requirements, creating a detailed plan, collaborating closely with team members and stakeholders, utilizing design software effectively, addressing challenges promptly, and presenting the completed project with clear documentation and compelling visuals.',
        ]);
        User::factory()->create([
            'cover_image' => 'https://png.pngtree.com/png-vector/20221007/ourmid/pngtree-young-man-learning-japanese-by-himself-semi-flat-color-vector-character-png-image_6263314.png',
            'name' => 'Marriage',
            'type' => 'event',
            'description' => 'Organizing a wedding involves several key aspects. Firstly, setting a date and venue for the ceremony and reception. Then, managing guest lists, catering, decor, and entertainment. Choosing attire, arranging photography and videography, and handling necessary paperwork are also essential. Lastly, planning the honeymoon and coordinating transportation for guests if needed.',
        ]);
    }
}
