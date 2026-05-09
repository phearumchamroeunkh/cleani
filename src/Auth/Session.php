<?php
// src/Auth/Session.php

namespace App\Auth;

class Session {
    public static function start(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start([
                'cookie_httponly' => true,
                'cookie_secure' => isset($_SERVER['HTTPS']),
                'cookie_samesite' => 'Strict',
            ]);
        }
    }

    public static function set(string $key, $value): void {
        self::start();
        $_SESSION[$key] = $value;
    }

    public static function get(string $key, $default = null) {
        self::start();
        return $_SESSION[$key] ?? $default;
    }

    public static function destroy(): void {
        self::start();
        $_SESSION = [];
        session_destroy();
    }

    public static function isLoggedIn(): bool {
        return self::get('user_id') !== null;
    }

    public static function requireLogin(): void {
        if (!self::isLoggedIn()) {
            http_response_code(401);
            echo json_encode(['status' => 401, 'message' => 'Unauthorized']);
            exit;
        }
    }
}
