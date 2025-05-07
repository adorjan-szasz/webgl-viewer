<?php

namespace App\Http\Controllers;

use App\Enums\WebGLEventType;
use App\Models\WebGLInteraction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InteractionController extends Controller
{
    public function index()
    {
        $logs = WebGLInteraction::orderBy('created_at', 'desc')->paginate(20);

        return view('interactions.index', ['logs' => $logs]);
    }

    public function logInteraction(Request $request)
    {
        $validated = $request->validate([
            'event_type' => 'required|in:' . WebGLEventType::valuesToString(),
            'event_data' => 'nullable|array',
        ]);

        DB::table('webgl_interactions')->insert([
            'event_type' => $validated['event_type'],
            'event_data' => json_encode($validated['event_data']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function clearAll()
    {
        DB::table('webgl_interactions')->truncate();

        return response()->json(['success' => true]);
    }

    public function deleteSelected(Request $request)
    {
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return response()->json(['success' => false, 'message' => 'Invalid request'], 400);
        }

        DB::table('webgl_interactions')->whereIn('id', $ids)->delete();

        return response()->json(['success' => true]);
    }
}
