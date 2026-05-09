<?php
// api/bookings.php

require_once __DIR__ . '/../src/autoload.php';

use App\Database\Connection;
use App\Utils\Response;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", [], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    Response::error("Invalid input data");
}

// Basic validation
if (empty($input['serviceId']) || empty($input['contact']['email'])) {
    Response::error("Service ID and contact email are required");
}

try {
    $db = Connection::getInstance();
    $db->beginTransaction();

    // 1. Create or find customer
    $stmt = $db->prepare("SELECT id FROM customers WHERE user_id IN (SELECT id FROM users WHERE email = ?) OR id IN (SELECT id FROM customers WHERE phone = ?)");
    // For simplicity, just insert a new customer record for every booking if we don't have a login system fully integrated yet
    // In a real app, we'd check session or email
    
    $stmt = $db->prepare("INSERT INTO customers (first_name, last_name, phone, address) VALUES (?, ?, ?, ?)");
    $nameParts = explode(' ', $input['contact']['name'] ?? 'Guest User', 2);
    $firstName = $nameParts[0];
    $lastName = $nameParts[1] ?? '';
    
    $stmt->execute([
        $firstName,
        $lastName,
        $input['contact']['phone'] ?? null,
        'Address provided in metadata' // Simplified
    ]);
    $customerId = $db->lastInsertId();

    // 2. Get service price (ideally from DB, but we'll use a placeholder or match from JSON)
    // For this prototype, we'll assume a fixed price or calculate based on rooms
    $basePrice = 50.00; // Default
    
    // 3. Insert booking
    $stmt = $db->prepare("
        INSERT INTO bookings (customer_id, service_id, status, schedule_date, total_price, metadata) 
        VALUES (?, ?, 'pending', ?, ?, ?)
    ");
    
    $scheduleDate = ($input['schedule']['date'] ?? date('Y-m-d')) . ' ' . ($input['schedule']['time'] ?? '09:00:00');
    $serviceId = 1; // Map 'res-basic' etc. to DB IDs. For now, assume ID 1.
    
    $stmt->execute([
        $customerId,
        $serviceId,
        $scheduleDate,
        $basePrice,
        json_encode($input)
    ]);
    $bookingId = $db->lastInsertId();

    $db->commit();
    Response::success("Booking created successfully", ['booking_id' => $bookingId]);

} catch (\Exception $e) {
    if (isset($db)) $db->rollBack();
    Response::error("Failed to create booking: " . $e->getMessage(), [], 500);
}
