<?php
// src/Utils/Sanitize.php

namespace App\Utils;

class Sanitize {
    public static function clean(array $data): array {
        $clean = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $clean[$key] = self::clean($value);
            } else {
                $clean[$key] = htmlspecialchars(strip_tags(trim((string)$value)), ENT_QUOTES, 'UTF-8');
            }
        }
        return $clean;
    }

    public static function string(string $value): string {
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
    }
}
