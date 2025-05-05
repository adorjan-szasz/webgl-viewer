<?php

use App\Http\Controllers\ModelController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('viewer');
});

Route::post('/upload-model', [ModelController::class, 'uploadModel']);
