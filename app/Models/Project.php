<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'requirements' => 'array',
    ];

    public function jobRole(): BelongsTo
    {
        return $this->belongsTo(JobRole::class);
    }
}
