<?php

namespace App\Enums\Traits;

trait EnumHelper
{
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function array(): array
    {
        return array_combine(self::values(), self::names());
    }

    public static function containsValue(string $value): bool
    {
        return in_array($value, self::values(), true);
    }

    public static function valuesToString(): string
    {
        return implode(',', array_column(self::cases(), 'value'));
    }
}
