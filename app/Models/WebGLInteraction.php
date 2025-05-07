<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebGLInteraction extends Model
{
    protected $table = 'webgl_interactions';

    protected $fillable = [
        'event_type',
        'event_data',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
