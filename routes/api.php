<?php

use App\Http\Controllers\InteractionController;
use Illuminate\Support\Facades\Route;

Route::post('/log-interaction', [InteractionController::class, 'logInteraction']);
