<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Model3D extends Model
{
    protected $table = 'model3_d_s';

    protected $fillable = ['name', 'type', 'files'];

    protected $casts = [
        'files' => 'array',
    ];
}
