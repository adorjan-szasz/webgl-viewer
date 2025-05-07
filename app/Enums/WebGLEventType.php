<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelper;

enum WebGLEventType: string
{
    use EnumHelper;

    case LOAD = 'load';
    case ROTATE = 'rotate';
    case ZOOM = 'zoom';
}
