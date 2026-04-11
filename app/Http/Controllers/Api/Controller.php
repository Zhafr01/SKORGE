<?php

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    description: 'L5 Swagger OpenApi description for SKORGE Learning System',
    title: 'SKORGE API Documentation',
    contact: new OA\Contact(email: 'admin@skorge.local')
)]
#[OA\Server(url: 'http://localhost:8000', description: 'API Server')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    name: 'bearerAuth',
    in: 'header',
    bearerFormat: 'JWT',
    scheme: 'bearer'
)]
class Controller extends \App\Http\Controllers\Controller {}
