<?php
// api/faq.php

require_once __DIR__ . '/../src/autoload.php';

use App\Utils\Response;

$filePath = __DIR__ . '/../data/faq.json';

if (!file_exists($filePath)) {
    Response::error("FAQ data not found", [], 404);
}

$faq = json_decode(file_get_contents($filePath), true);

Response::success("FAQ retrieved successfully", $faq);
