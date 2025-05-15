@extends('layouts.app')

@section('header-content')
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

    <!-- WebGL + OBJ loader -->
    <script src="https://cdn.jsdelivr.net/npm/webgl-obj-loader@2.0.3/dist/webgl-obj-loader.min.js"></script>
@endsection

@section('content')
    <!-- Left control panel -->
    <div class="fixed top-36 bottom-0 left-4 z-30 flex flex-col space-y-4">
        @include('components.model-selector')

        <button id="rotateToRight" class="control-panel-btn-gray">
            Rotate to Right
            <i class="fas fa-arrow-right ml-2"></i>
        </button>

        <button id="rotateToLeft" class="control-panel-btn-gray">
            <i class="fas fa-arrow-left mr-2"></i>
            Rotate to Left
        </button>

        <button id="resetCameraBtn" class="control-panel-btn-gray">Reset View</button>

        <button id="saveCameraBtn" class="control-panel-btn-gray">Save Camera</button>

        <button id="restoreCameraBtn" class="control-panel-btn-gray">Restore Camera</button>

        <button id="screenshotBtn" class="screenshot-btn">Save Screenshot</button>

        <div>
            <label for="ambientSlider" class="block text-sm text-white text-center mb-1">Ambient Light</label>
            <input type="range" id="ambientSlider" min="0" max="1" step="0.01" value="0.3" class="w-52">
        </div>
    </div>

    <div id="canvas-container">
        <canvas id="glcanvas"></canvas>
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

    @include('components.toast-notifications')

    @include('components.loading-spinner')

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/gl-matrix-min.js"></script>
    <script src="{{ asset('js/common/helper.js') }}"></script>
    <script defer type="module" src="{{ asset('js/webgl-viewer.js') }}"></script>
@endsection
