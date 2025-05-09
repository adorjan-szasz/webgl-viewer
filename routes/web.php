<?php

use App\Http\Controllers\InteractionController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\ScreenshotController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ModelController::class, 'webGLViewer']);
Route::post('/models/upload', [ModelController::class, 'uploadModel'])->name('webgl-viewer.upload');
Route::get('/models', [ModelController::class, 'index']);
Route::delete('/models/{id}', [ModelController::class, 'destroy']);
Route::delete('/models', [ModelController::class, 'destroyAll']);
Route::get('/three-viewer', [ModelController::class, 'threeViewer']);
Route::post('/three-viewer/upload', [ModelController::class, 'threeUploadModel'])->name('three-viewer.upload');

Route::get('/interactions', [InteractionController::class, 'index']);
Route::delete('/interactions', [InteractionController::class, 'clearAll']);
Route::delete('/interactions/bulk', [InteractionController::class, 'deleteSelected']);
//Route::post('/log-interaction', [InteractionController::class, 'logInteraction']);

Route::get('/screenshots', [ScreenshotController::class, 'index']);
Route::post('save-screenshot', [ScreenshotController::class, 'save']);
Route::delete('/screenshots/{filename}', [ScreenshotController::class, 'destroy']);
Route::delete('/screenshots', [ScreenshotController::class, 'destroyAll']);
