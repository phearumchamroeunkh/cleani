<?php
// api/services.php

require_once __DIR__ . '/../src/autoload.php';

use App\Utils\Response;

$filePath = __DIR__ . '/../data/services.json';

if (!file_exists($filePath)) {
    Response::error("Services data not found", [], 404);
}

$services = json_decode(file_get_contents($filePath), true);

if ($services === null) {
    Response::error("Failed to parse services data", [], 500);
}

Response::success("Services retrieved successfully", $services);
