<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ModelController extends Controller
{
    public function renderCanvas()
    {
        return view('models.viewer');
    }

    public function index()
    {
        $files = File::files(public_path('storage/models'));

        $models = array_map(function ($file) {
            return [
                'name' => $file->getFilename(),
                'url' => asset('storage/models/' . $file->getFilename()),
                'modified' => $file->getMTime(),
            ];
        }, $files);

        // latest first
        usort($models, fn($a, $b) => $b['modified'] <=> $a['modified']);

        return view('models.index', ['models' => $models]);
    }

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

        $filename = uniqid() . '_' . $modelFile->getClientOriginalName();
        $path = $modelFile->storeAs('models', $filename, 'public');

        return response()->json([
            'success' => true,
            'path' => Storage::url($path),
            'filename' => $filename,
        ]);
    }

    public function destroy(string $filename)
    {
        $path = 'models/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'File not found'], 404);
    }

    public function destroyAll()
    {
        $directory = public_path('storage/models');

        if (File::exists($directory)) {
            File::cleanDirectory($directory);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Directory not found'], 404);
    }
}
