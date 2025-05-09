<?php

namespace App\Http\Controllers;

use App\Enums\ModelType;
use App\Models\Model3D;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ModelController extends Controller
{
    public function webGLViewer()
    {
        $models = Model3D::where('type', ModelType::OBJ->value)
            ->orderBy('created_at')
            ->get();

        return view('models.webgl-viewer', compact('models'));
    }

    public function threeViewer()
    {
        $models = Model3D::all();

        return view('models.three-viewer', compact('models'));
    }

    public function index()
    {
        $models = Model3D::orderBy('created_at', 'desc')->get();

        return view('models.index', compact('models'));
    }

    public function uploadModel(Request $request)
    {
        // Max 10MB
        $request->validate([
            'model_file' => 'required|file|max:10240'
        ]);

        $modelFile = $request->file('model_file');
        $modelFileExtension = $modelFile->getClientOriginalExtension();

        if (strtolower($modelFileExtension) != 'obj') {
            return response()->json([
                'message' => 'File format should be .obj!'
            ], 422);
        }

        $filename = time() . '_' . $modelFile->getClientOriginalName();
        $path = $modelFile->storeAs('models', $filename, 'public');

        $model = Model3D::create([
            'name' => $modelFile->getClientOriginalName(),
            'type' => $modelFileExtension,
            'files' => [$filename]
        ]);

        return response()->json([
            'success' => true,
            'path' => Storage::url($path),
            'filename' => $filename,
            'model' => [
                'id' => $model->id,
                'name' => $model->name,
                'files' => $model->files
            ]
        ]);
    }

    public function threeUploadModel(Request $request)
    {
        $request->validate([
            'model_files.*' => 'required|file|max:10240'
        ]);

        foreach ($request->file('model_files') as $file) {
            $fileExtension = $file->getClientOriginalExtension();

            if (!in_array(strtolower($fileExtension), ['obj', 'mtl', 'gltf', 'glb', 'dae'])) {
                return response()->json([
                    'message' => 'File format should be .obj, .mtl, .gltf, .glb or .dae!'
                ], 422);
            }
        }

        $files = [];
        $modelName = pathinfo($request->file('model_files')[0]->getClientOriginalName(), PATHINFO_FILENAME);
        foreach ($request->file('model_files') as $file) {
            $filename = time() . '_' . $file->getClientOriginalName();

            $file->storeAs('models', $filename, 'public');

            $files[] = $filename;
        }

        $model = Model3D::create([
            'name' => $modelName,
            'type' => $request->file('model_files')[0]->getClientOriginalExtension(),
            'files' => $files
        ]);

        return response()->json([
            'success' => true,
            'model' => [
                'id' => $model->id,
                'name' => $model->name,
                'files' => $model->files
            ]
        ]);
    }

    public function destroy(string $id)
    {
        $model = Model3D::findOrFail($id);

        foreach ($model->files as $file) {
            $path = 'models/' . $file;

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            } else {
                return response()->json(['success' => false, 'message' => 'File not found'], 404);
            }
        }

        $model->delete();

        return response()->json(['success' => true]);
    }

    public function destroyAll()
    {
        $directory = public_path('storage/models');

        if (File::exists($directory)) {
            File::cleanDirectory($directory);

            Model3D::truncate();

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false, 'message' => 'Directory not found'], 404);
    }
}
