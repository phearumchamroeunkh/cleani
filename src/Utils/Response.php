<?php
// src/Utils/Response.php

namespace App\Utils;

class Response {
    public static function json(int $status, string $message, $data = null, array $errors = []): void {
        header('Content-Type: application/json');
        http_response_code($status);
        
        echo json_encode([
            'status' => $status,
            'message' => $message,
            'data' => $data,
            'errors' => $errors
        ]);
        exit;
    }

    public static function success(string $message, $data = null): void {
        self::json(200, $message, $data);
    }

    public static function error(string $message, array $errors = [], int $status = 400): void {
        self::json($status, $message, null, $errors);
    }
}
