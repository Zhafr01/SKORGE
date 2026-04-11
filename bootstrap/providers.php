<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use L5Swagger\L5SwaggerServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    L5SwaggerServiceProvider::class,
];
