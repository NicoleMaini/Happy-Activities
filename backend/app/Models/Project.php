<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'cover_image',
        'name',
        'type',
        'progress',
        'description', // Campo opzionale
        // Altri campi che desideri includere
    ];

    public function toArray()
    {
        $data = parent::toArray();
        if ($this->cover_image) {
            $data['cover_image'] = asset(Storage::url($this->cover_image));
        } else {
            $data['cover_image'] = null; // oppure '' a seconda delle tue esigenze
        }
        return $data;
    }

    public $timestamps = false;

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('team');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
