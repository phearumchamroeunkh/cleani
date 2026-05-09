<?php
// api/dashboard_bookings.php

require_once __DIR__ . '/../src/autoload.php';

use App\Database\Connection;
use App\Utils\Response;
use App\Auth\Session;

// Session::requireLogin(); // Enable in production

try {
    $db = Connection::getInstance();
    $stmt = $db->query("
        SELECT b.id, b.status, b.schedule_date, b.total_price, 
               CONCAT(c.first_name, ' ', c.last_name) as customer_name,
               s.name as service_name
        FROM bookings b
        JOIN customers c ON b.customer_id = c.id
        JOIN services s ON b.service_id = s.id
        ORDER BY b.created_at DESC
        LIMIT 20
    ");
    $bookings = $stmt->fetchAll();

    Response::success("Bookings retrieved", $bookings);
} catch (\Exception $e) {
    Response::error("Failed to fetch bookings: " . $e->getMessage(), [], 500);
}
