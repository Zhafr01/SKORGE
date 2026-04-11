<?php

test('cors headers allow the vite frontend origin', function () {
    $response = $this->withHeaders([
        'Origin' => 'http://localhost:5173',
    ])->options('/api/job-roles');

    $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
});

test('cors does not allow arbitrary origins', function () {
    $response = $this->withHeaders([
        'Origin' => 'http://evil.com',
    ])->options('/api/job-roles');

    $this->assertNotEquals('http://evil.com', $response->headers->get('Access-Control-Allow-Origin'));
});
