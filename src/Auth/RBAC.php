<?php
// src/Auth/RBAC.php

namespace App\Auth;

class RBAC {
    public static function hasPermission(string $permission): bool {
        $userPermissions = Session::get('permissions', []);
        
        if (isset($userPermissions['all']) && $userPermissions['all'] === true) {
            return true;
        }

        // Handle nested permissions like "bookings.read"
        $parts = explode('.', $permission);
        $temp = $userPermissions;
        
        foreach ($parts as $part) {
            if (!isset($temp[$part])) {
                return false;
            }
            $temp = $temp[$part];
        }

        return $temp === true || (is_array($temp) && !empty($temp));
    }

    public static function requirePermission(string $permission): void {
        if (!self::hasPermission($permission)) {
            http_response_code(403);
            echo json_encode(['status' => 403, 'message' => 'Forbidden: Insufficient permissions']);
            exit;
        }
    }
}
