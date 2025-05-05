<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link id="favicon" rel="icon" type="image/png" href="assets/laravel_webgl_logo.png">

        <title>3D Product Viewer</title>

        <!-- Tailwind CSS via CDN -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- WebGL + OBJ loader -->
        <script src="https://cdn.jsdelivr.net/npm/webgl-obj-loader@2.0.3/dist/webgl-obj-loader.min.js"></script>

        <link rel="stylesheet" href="{{ asset('css/viewer.css') }}">
    </head>

    <body class="bg-gray-100 text-gray-800 font-sans">
        <header class="fixed top-0 left-0 right-0 h-20 bg-white shadow-md flex items-center justify-between px-6 z-20">
            <a href="/" class="h-full flex items-center">
                <img id="logo" src="assets/laravel_webgl_logo.png" alt="Logo" class="max-h-full transition-all duration-300">
            </a>

{{--            <nav class="space-x-4">--}}
{{--                <a href="#about" class="text-blue-600 hover:underline font-semibold">About</a>--}}
{{--            </nav>--}}
        </header>

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

        <footer class="fixed bottom-0 left-0 right-0 bg-gray-200 text-center py-4 text-sm text-gray-700 z-20">
            © 2025 Adorján Szász
        </footer>

        <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/gl-matrix-min.js"></script>
        <script defer src="{{ asset('js/webgl-viewer.js') }}"></script>
    </body>
</html>
