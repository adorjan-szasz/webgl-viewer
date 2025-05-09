@extends('layouts.app')

@section('header-content')
    <script type="importmap">
        {
          "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/"
          }
        }
    </script>
@endsection

@section('content')
    <!-- Left control panel -->
    <div class="fixed top-36 bottom-0 left-4 z-30 flex flex-col space-y-4">
        @include('components.model-selector')
    </div>

    <!-- 3D Canvas -->
    <div id="canvas-container">
        <canvas id="threeCanvas"></canvas>
    </div>

    <!-- Upload Form -->
    <form id="uploadModelForm"
          enctype="multipart/form-data"
          class="fixed top-32 right-4 z-30 bg-white border border-dashed border-gray-300 p-4 rounded-md shadow-md
                 hover:border-blue-400 transition flex flex-col space-y-3 w-136"
    >
        @csrf
        <label class="font-medium text-gray-800">Upload .obj and .mtl/.gltf and .glb/.dae file (drag & drop supported)</label>
        <input type="file" name="model_files[]" id="model_files" multiple
               accept=".obj,.mtl,.gltf,.glb,.dae"
               class="file:mr-3 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-md hover:file:bg-blue-700"
               required
        >
        <div id="file-names" class="mt-1 text-sm text-gray-600"></div>
        <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">
            Upload
        </button>
    </form>

    @include('components.toast-notifications')

    @include('components.loading-spinner')

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="{{ asset('js/common/helper.js') }}"></script>
    <script type="module" src="{{ asset('js/three-viewer.js') }}"></script>
@endsection
