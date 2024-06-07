<?php

namespace Database\Seeders;

use App\Models\Microtask;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MicrotaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Microtask::factory()->create([
            'task_id' => '1',
            'title' => 'Define the objectives of the landing page',
            'description' => ' Establish the main purpose of the page (e.g., attract new clients, showcase the portfolio, etc.).',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '1',
            'title' => 'Identify the target audience:',
            'description' => 'Determine who the target visitors are.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '1',
            'title' => 'Structure the content:',
            'description' => 'Decide which sections to include (title, introduction, services, testimonials, team profiles, call-to-action).',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '2',
            'title' => 'Write the main headline and introduction:',
            'description' => 'Create a catchy title and a brief description of the team.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '2',
            'title' => 'Describe the services and write the call-to-actions:',
            'description' => 'List the main services offered and create persuasive messages to encourage visitor actions.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '2',
            'title' => 'Gather and write testimonials and team profiles',
            'description' => 'Obtain client testimonials and write brief biographies of team members.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '3',
            'title' => 'Select high-quality images:',
            'description' => 'Choose professional images that represent the team, projects, and services.',
            'progress' => 'to do',
            'assigned' => 'team design',
        ]);
        Microtask::factory()->create([
            'task_id' => '3',
            'title' => 'Prepare team photos and images of past projects:',
            'description' => 'Collect professional photos of team members and images of completed projects.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '4',
            'title' => 'Choose a clean and user-friendly layout:',
            'description' => 'Define a layout scheme that is clear and easy to navigate.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '4',
            'title' => 'Define color scheme and fonts:',
            'description' => "Choose a combination of colors and fonts consistent with the team's brand.",
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '4',
            'title' => 'Design the layout of sections:',
            'description' => 'Arrange various elements of the page logically and visually pleasing.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '5',
            'title' => 'Create HTML structure and style with CSS:',
            'description' => 'Implement the basic structure of the page with HTML and apply CSS styles.',
            'progress' => 'to do',
            'assigned' => 1,
        ]);
        Microtask::factory()->create([
            'task_id' => '5',
            'title' => 'Add interactivity with JavaScript:',
            'description' => 'Implement interactive elements such as sliders or modals.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '5',
            'title' => 'Optimize images and design for mobile devices:',
            'description' => 'Ensure all images are optimized for the web and the design is responsive.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '6',
            'title' => 'Test functionality and compatibility:',
            'description' => 'Ensure all links and buttons work correctly and the page is compatible with different browsers and devices.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '6',
            'title' => 'Launch the landing page:',
            'description' => 'Ensure all links and buttons work correctly and the page is compatible with different browsers and devices.',
            'progress' => 'to do',
        ]);
        Microtask::factory()->create([
            'task_id' => '6',
            'title' => 'Promote the landing page and monitor performance:',
            'description' => 'Use marketing channels to promote the page and monitor traffic with web analytics tools.',
            'progress' => 'to do',
        ]);
    }
}
