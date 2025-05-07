@props([
'type' => 'button',
'variant' => 'primary',
'size' => 'md',
'block' => false, // full width
'disabled' => false,
'extras' => ''
])

@php
    $baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition';

    $variantClasses = match($variant) {
        'primary' => 'bg-blue-600 text-white hover:bg-blue-700',
        'secondary' => 'bg-gray-600 text-white hover:bg-gray-700',
        'danger' => 'bg-red-600 text-white hover:bg-red-700',
        'outline' => 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        default => '',
    };

    $sizeClasses = match($size) {
        'sm' => 'px-3 py-1.5 text-xs',
        'md' => 'px-4 py-2 text-sm',
        'lg' => 'px-6 py-3 text-base',
        default => 'px-4 py-2 text-sm',
    };

    $blockClass = $block ? 'w-full' : '';

    $disabledClass = $disabled ? 'opacity-50 cursor-not-allowed' : '';
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->merge(['class' => "$baseClasses $variantClasses $sizeClasses $blockClass $disabledClass $extras"]) }}
    @if ($disabled) disabled @endif
>
    {{ $slot }}
</button>
