<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //task project work
        Task::factory()->create([
            'project_id' => '2',
            'image1' => 'https://marketplace.canva.com/EAFLgV-dY84/2/0/1888w/canva-lavagna-mappa-mentale-in-stile-brainstorming-semplice-blu-e-giallo-mCybHQFx1QY.jpg',
            'title' => 'Planning and Structure',
            'description' => 'Planning and structure are essential to ensure the landing page effectively achieves its goals. In this task, we will define objectives, identify the target audience, and decide on the content structure.',
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'image1' => '',
            'title' => 'Textual Content',
            'description' => "Textual content is crucial to clearly communicate the team's strengths and services. In this task, we will create the headline, introduction, service descriptions, call-to-actions, testimonials, and team profiles.",
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'image1' => '',
            'title' => 'Visual Content.',
            'description' => 'High-quality images are essential to make the landing page visually appealing and professional. In this task, we will select and prepare all necessary images.',
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'image1' => 'https://uikitfree.com/wp-content/uploads/2022/06/Language-Learning-Figma-Dashboard.jpg',
            'title' => 'Design and Layout',
            'description' => 'A clean design and user-friendly layout are crucial to maintain visitor engagement and facilitate navigation. In this task, we will define the design scheme and organize the layout of sections.',
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'image1' => '',
            'title' => 'Development and Optimization',
            'description' => 'The development phase transforms the design into a functional web page, while optimization ensures the page is fast and accessible on all devices. In this task, we will develop the page and optimize it.',
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'image1' => 'https://fastercapital.com/i/Creating-Effective-Customer-Personas--Best-Practices--Testing-and-Refining-Your-Customer-Personas.webp',
            'title' => 'Testing, Launch, and Promotion',
            'description' => 'Testing ensures everything works correctly, launching puts the page online, and promotion attracts visitors. In this task, we will test the page, launch it, and start promoting it.',
            'progress' => 'to do',
            'assigned' => 1,
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'title' => 'For Textual Content with the client',
            'description' => 'Review session with clients to gather testimonials and finalize team member profiles.',
            'appointment' => fake()->dateTimeThisMonth(),
            'progress' => 'to do',
            'assigned' => 1,
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'title' => 'For Visual Content with the design',
            'description' => 'Review session with the design team to select and edit images for optimal visual impact.',
            'appointment' => fake()->dateTimeThisMonth(),
            'progress' => 'to do',
        ]);
        Task::factory()->create([
            'project_id' => '2',
            'title' => 'D-Day, Lunch app',
            'description' => ' Launch day meeting to deploy the landing page, monitor its performance, and discuss initial promotion strategies.',
            'appointment' => '2024-06-07 09:40:23',
            'progress' => 'to do',
            'assigned' => 1,
        ]);
    }
}
