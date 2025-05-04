<!DOCTYPE html>
<html>
<head>
    <title>3D Product Viewer</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        canvas { width: 100%; height: 100%; display: block; }
        body { margin: 0; overflow: hidden; }
    </style>
</head>

<body class="bg-gray text-black">
<header id="siteHeader" class="fixed w-full top-0 left-0 z-50 flex justify-between items-center px-6 h-24
    bg-white/70 text-black"
>
    <nav class="hidden md:flex items-center space-x-6 font-semibold">
        <a href="#home" class="hover:underline">Home</a>
        <a href="#about" class="hover:underline">About</a>

        <button id="themeToggle" class="flex items-center justify-center w-10 h-10">
            <i id="sunIcon" class="fas fa-sun"></i>
            <i id="moonIcon" class="fas fa-moon"></i>
        </button>
    </nav>
</header>

<main class="pt-28 px-4 md:px-6 lg:px-12">
    <section id="home" class="text-center mt-32">
        <h1 class="text-6xl font-bold mb-12">
            Welcome to Laravel WebGL 3D Product Viewer!
        </h1>
    </section>

    <section id="about" class="text-center mt-32">
        <h1 class="text-6xl font-bold mb-12">
            To be coming!
        </h1>
    </section>
</main>

<footer class="text-center p-4 mt-12 bg-gray-100">
    © 2025 Adorján Szász
</footer>

</body>
</html>
