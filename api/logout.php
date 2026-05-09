<?php
// api/logout.php

require_once __DIR__ . '/../src/autoload.php';

use App\Auth\Session;
use App\Utils\Response;

Session::destroy();
Response::success("Logout successful");
