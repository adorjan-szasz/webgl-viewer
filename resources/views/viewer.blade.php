@extends('layouts.app')

@section('content')
    <!-- Canvas full-screen container -->
    <div id="canvas-container" class="relative fixed top-20 bottom-16 left-0 right-0 z-10">
        <canvas id="glcanvas" class="w-full h-full block bg-white rounded-lg shadow-inner"></canvas>
    </div>

    <!-- Upload form for 3D model file -->
    <form id="uploadForm"
          enctype="multipart/form-data"
          class="fixed top-4 right-4 z-30 bg-white border border-dashed border-gray-300 p-4 rounded-md shadow-md
          hover:border-blue-400 transition flex items-center space-x-3"
    >
        @csrf
        <label class="font-medium">Upload .obj file (drag & drop also works). Max 10MB</label>
        <input type="file" name="model_file" id="modelFile" accept=".obj"
               class="file:mr-3 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-md
               hover:file:bg-blue-700"
        >

        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
            Upload
        </button>
    </form>

    <!-- Rotate button -->
    <button id="rotateBtn" class="absolute bottom-28 left-6 z-30 px-5 py-2 bg-emerald-500 hover:bg-emerald-600
        text-white rounded-md shadow-md"
    >
        Rotate
    </button>

    <!-- Error message -->
    <div id="errorContainer" class="hidden fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border
        border-red-400 text-red-700 px-6 py-4 rounded shadow-md max-w-lg"
    >
        <p id="errorMessage" class="text-center"></p>
    </div>

    <!-- Loading spinner -->
    <div id="loadingIndicator" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-75"></div>
    </div>

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/gl-matrix-min.js"></script>
    <script defer type="module" src="{{ asset('js/webgl-viewer.js') }}"></script>
@endsection
