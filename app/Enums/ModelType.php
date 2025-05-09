<?php

namespace App\Enums;

use App\Enums\Traits\EnumHelper;

enum ModelType: string
{
    use EnumHelper;

    case OBJ = 'obj';
    case MTL = 'mtl';
    case GLTF = 'gltf';
    case GLB = 'glb';
    case DAE = 'dae';
}
