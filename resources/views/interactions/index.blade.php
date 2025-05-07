@extends('layouts.app')

@section('content')
    <div class="relative overflow-y-auto max-h-[calc(100vh-4rem)] px-4 py-6 mt-16">
        <h1 class="mt-8 mb-4">WebGL Interaction History</h1>

        <div>
            <x-button variant="danger" id="clear-all-interactions" extras="mb-2">
                Clear all
            </x-button>
        </div>

        <div>
            <x-button variant="danger" id="delete-selected-interactions" extras="mb-4">
                Delete Selected Logs
            </x-button>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" id="select-all-interactions">
                        Select All
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Data
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                    </th>
                </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
                @foreach ($logs as $log)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input type="checkbox" class="log-checkbox" value="{{ $log->id }}">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $log->id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $log->event_type }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ json_encode($log->event_data) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $log->created_at?->format('Y-m-d H:i:s') }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="mt-6 flex justify-center">
            {{ $logs->links() }}
        </div>
    </div>

    <script defer src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer type="module" src="{{ asset('js/interaction-logs.js') }}"></script>
@endsection
