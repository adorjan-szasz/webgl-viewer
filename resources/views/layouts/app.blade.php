<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link id="favicon" rel="icon" type="image/png" href="{{ asset('assets/laravel_webgl_logo.png') }}">

        <title>3D Product Viewer</title>

        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- WebGL + OBJ loader -->
        <script src="https://cdn.jsdelivr.net/npm/webgl-obj-loader@2.0.3/dist/webgl-obj-loader.min.js"></script>

        <link rel="stylesheet" href="{{ asset('css/viewer.css') }}">
    </head>

    <body class="bg-gray-100 text-gray-900 font-sans">
        <header class="fixed top-0 left-0 right-0 h-20 bg-white shadow-md flex items-center justify-between px-6 z-20">
            <a href="/" class="h-full flex items-center">
                <img id="logo" src="{{ asset('assets/laravel_webgl_logo.png') }}" alt="Logo" class="max-h-full transition-all duration-300">
            </a>

            {{--            <nav class="space-x-4">--}}
            {{--                <a href="#about" class="text-blue-600 hover:underline font-semibold">About</a>--}}
            {{--            </nav>--}}
        </header>

        @yield('content')

        <footer class="fixed bottom-0 left-0 right-0 bg-gray-200 text-center py-4 text-sm text-gray-700 z-20">
            © 2025 Adorján Szász
        </footer>
    </body>
</html>
