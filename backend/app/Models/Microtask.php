<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Microtask extends Model
{
    use HasFactory;

    protected $fillable = ['progress', 'task_id', 'description']; // Assicurati che 'progress' sia fillable

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
