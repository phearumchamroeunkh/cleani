<?php
// api/login.php

require_once __DIR__ . '/../src/autoload.php';

use App\Database\Connection;
use App\Utils\Response;
use App\Auth\Session;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", [], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    Response::error("Email and password are required");
}

try {
    $db = Connection::getInstance();
    $stmt = $db->prepare("
        SELECT u.*, r.name as role_name, r.permissions 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND u.status = 'active'
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        Session::start();
        Session::set('user_id', $user['id']);
        Session::set('role', $user['role_name']);
        Session::set('permissions', json_decode($user['permissions'], true));
        
        Response::success("Login successful", [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role_name']
        ]);
    } else {
        Response::error("Invalid credentials", [], 401);
    }
} catch (\Exception $e) {
    Response::error("An error occurred during login", [], 500);
}
