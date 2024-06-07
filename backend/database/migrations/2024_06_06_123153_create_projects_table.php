<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('cover_image', 500)->nullable();
            $table->string('name', 200);
            $table->enum('type', ['work', 'study', 'event', 'free-time']);
            $table->string('description', 1000)->nullable();
            $table->enum('progress', ['active', 'delete']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
