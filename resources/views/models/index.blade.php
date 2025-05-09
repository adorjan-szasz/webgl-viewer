@extends('layouts.app')

@section('content')
    <div class="relative overflow-y-auto max-h-[calc(100vh-4rem)] px-4 py-6 mt-16">
        <h1 class="mt-8 mb-4 text-2xl font-semibold">Uploaded 3D Models</h1>

        <x-button variant="danger" id="delete-all-models" extras="mb-4">Delete All Models</x-button>

        <table class="min-w-full divide-y divide-gray-400 shadow-md rounded-lg overflow-hidden text-sm">
            <thead class="bg-gray-300">
            <tr>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Model Name</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Model Files</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Last Modified</th>
                <th class="px-6 py-3 text-left font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-400">
            @foreach ($models as $model)
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-gray-900 font-medium">{{ $model->name }}</td>

                    <td class="px-6 py-4 text-gray-800">
                        <ul class="space-y-1">
                            @foreach ($model->files as $file)
                                <li>
                                    <a href="{{ asset('storage/models/' . $file) }}" target="_blank" class="text-blue-600 hover:underline">
                                        {{ $file }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </td>

                    <td class="px-6 py-4 text-gray-600">{{ $model->updated_at->format('Y-m-d H:i:s') }}</td>

                    <td class="px-6 py-4 space-x-2">
                        <x-button variant="danger"
                                  data-filename="{{ $model->name }}"
                                  extras="delete-model"
                                  data-model-id="{{ $model->id }}">
                            Delete
                        </x-button>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer type="module" src="{{ asset('js/delete-model.js') }}"></script>
@endsection
