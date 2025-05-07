@extends('layouts.app')

@section('content')
    <div class="relative overflow-y-auto max-h-[calc(100vh-4rem)] px-4 py-6 mt-16">
        <h1 class="mt-8 mb-4">Uploaded 3D Models</h1>

        <x-button variant="danger" id="delete-all-models" extras="mb-4">Delete All Models</x-button>

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model File</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
            @foreach ($models as $model)
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $model['name'] }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ date('Y-m-d H:i:s', $model['modified']) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <x-link-button href="{{ $model['url'] }}" target="_blank">View</x-link-button>

                        <x-button variant="danger" data-filename="{{ $model['name'] }}" extras="delete-model">Delete</x-button>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer type="module" src="{{ asset('js/delete-model.js') }}"></script>
@endsection
