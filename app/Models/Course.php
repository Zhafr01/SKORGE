<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['thumbnail'];

    public function getThumbnailAttribute(): string
    {
        return match ($this->field) {
            'Design' => '/thumbnails/design.png',
            'Data' => '/thumbnails/data.png',
            'Marketing' => '/thumbnails/marketing.png',
            default => '/thumbnails/web-fundamentals.png',
        };
    }

    public function jobRole(): BelongsTo
    {
        return $this->belongsTo(JobRole::class);
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class);
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }
}
