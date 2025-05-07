@extends('layouts.app')

@section('content')
    <div class="relative overflow-y-auto max-h-[calc(100vh-4rem)] px-4 py-6 mt-16">
        <h1 class="mt-8 mb-4 text-2xl font-semibold">Saved Screenshots</h1>

        <x-button variant="danger" id="delete-all-screenshots" extras="mb-4">Delete All Screenshots</x-button>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @foreach ($screenshots as $shot)
                <div class="border p-2 shadow rounded text-center">
                    <img src="{{ $shot['url'] }}" alt="Screenshot" class="w-full h-auto">
                    <p class="mt-2 text-sm break-words">{{ $shot['filename'] }}</p>
                    <div class="mt-2 flex justify-between">
                        <a href="{{ $shot['url'] }}" download class="text-blue-600 hover:underline">Download</a>
                        <x-button variant="danger" data-filename="{{ $shot['filename'] }}" extras="delete-screenshot">
                            Delete
                        </x-button>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer type="module" src="{{ asset('js/screenshots.js') }}"></script>
@endsection
