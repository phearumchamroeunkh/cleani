<?php
// src/Utils/Logger.php

namespace App\Utils;

use App\Database\Connection;
use App\Auth\Session;

class Logger {
    public static function log(string $action, string $entity = null, int $entityId = null): void {
        try {
            $db = Connection::getInstance();
            $userId = Session::get('user_id');
            
            $stmt = $db->prepare("
                INSERT INTO audit_logs (user_id, action, entity, entity_id) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$userId, $action, $entity, $entityId]);
        } catch (\Exception $e) {
            // Silently fail logging or log to file
            error_log("Audit logging failed: " . $e->getMessage());
        }
    }
}
