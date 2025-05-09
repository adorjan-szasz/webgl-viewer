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

        <link rel="stylesheet" href="{{ asset('css/viewer.css') }}">

        @yield('header-content')
    </head>

    <body class="bg-gray-100 text-gray-900 font-sans">
        <header>
            <a href="/" class="h-full flex items-center">
                <img id="logo" src="{{ asset('assets/laravel_webgl_logo.png') }}" alt="Logo" class="max-h-full transition-all duration-300">
            </a>

            <nav class="space-x-4">
                <a href="/" class="text-blue-600 hover:underline font-semibold">Home (WebGL2)</a>
                <a href="/three-viewer" class="text-blue-600 hover:underline font-semibold">ThreeJS Scene</a>
                <a href="/interactions" class="text-blue-600 hover:underline font-semibold">Interaction Logs</a>
                <a href="/models" class="text-blue-600 hover:underline font-semibold">Uploaded Models</a>
                <a href="/screenshots" class="text-blue-600 hover:underline font-semibold">My Screenshots</a>
            </nav>
        </header>

        @yield('content')

        <footer class="fixed bottom-0 left-0 right-0 bg-gray-200 text-center py-4 text-sm text-gray-700 z-20">
            © 2025 Adorján Szász
        </footer>
    </body>
</html>
