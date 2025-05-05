<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ModelController extends Controller
{
    public function uploadModel(Request $request)
    {
        // Max 10MB
        $request->validate([
            'model_file' => 'required|file|max:10240'
        ]);

        $modelFile = $request->file('model_file');
        $modelFileExtension = $modelFile->getClientOriginalExtension();

        if ($modelFileExtension != 'obj' && $modelFileExtension != 'OBJ') {
            return response()->json([
                'message' => 'File format should be .obj!'
            ], 422);
        }

        $filename = uniqid() . '.obj';
        $path = $modelFile->storeAs('models', $filename, 'public');

        return response()->json([
            'success' => true,
            'path' => Storage::url($path)
        ]);
    }
}
