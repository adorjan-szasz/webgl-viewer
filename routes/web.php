<?php

use App\Http\Controllers\InteractionController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\ScreenshotController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ModelController::class, 'renderCanvas']);
Route::post('/models/upload', [ModelController::class, 'uploadModel']);
Route::get('/models', [ModelController::class, 'index']);
Route::delete('/models/{filename}', [ModelController::class, 'destroy'])
    ->where('filename', '[A-Za-z0-9._-]+');
Route::delete('/models', [ModelController::class, 'destroyAll']);

Route::get('/interactions', [InteractionController::class, 'index']);
Route::delete('/interactions', [InteractionController::class, 'clearAll']);
Route::delete('/interactions/bulk', [InteractionController::class, 'deleteSelected']);
//Route::post('/log-interaction', [InteractionController::class, 'logInteraction']);

Route::get('/screenshots', [ScreenshotController::class, 'index']);
Route::post('save-screenshot', [ScreenshotController::class, 'save']);
Route::delete('/screenshots/{filename}', [ScreenshotController::class, 'destroy']);
Route::delete('/screenshots', [ScreenshotController::class, 'destroyAll']);
