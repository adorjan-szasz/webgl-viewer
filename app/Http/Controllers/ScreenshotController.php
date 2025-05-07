<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ScreenshotController extends Controller
{
    public function index()
    {
        $files = Storage::disk('public')->files('screenshots');

        $screenshots = collect($files)->map(function ($path) {
            return [
                'url' => Storage::url($path),
                'filename' => basename($path),
            ];
        });

        return view('screenshots.index', compact('screenshots'));
    }

    public function save(Request $request)
    {
        $request->validate([
            'screenshot' => 'required|image|mimes:png'
        ]);

        $file = $request->file('screenshot');

        if (!$file || !$file->isValid()) {
            return response()->json(['message' => 'Invalid file'], 400);
        }

        $filename = 'screenshot_' . time() . '.png';
        $path = $file->storeAs('screenshots', $filename, 'public');

        return response()->json([
            'success' => true,
            'path' => Storage::url($path),
            'filename' => $filename
        ]);
    }

    public function destroy($filename)
    {
        $path = 'screenshots/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'File not found.'], 404);
    }

    public function destroyAll()
    {
        $directory = public_path('storage/screenshots');

        if (File::exists($directory)) {
            File::cleanDirectory($directory);

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Directory not found'], 404);
    }
}
