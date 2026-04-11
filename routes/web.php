<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/api/documentation');
});

// Any other frontend route requested on the backend can just redirect to the SPA or return 404
