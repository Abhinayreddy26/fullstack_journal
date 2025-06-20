<?php

namespace App\Providers;

//use Illuminate\Support\ServiceProvider;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    
    public function boot()
    {
        $this->routes(function () {
            Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
            
            Route::middleware('web')
            ->group(base_path('routes/web.php'));
        });
    }
    
    public function map()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }
    
    protected function mapApiRoutes()
    {
        Route::prefix('api')
        ->middleware('api')
        ->namespace($this->namespace) // may or may not be here in Laravel 9/10+
        ->group(base_path('routes/api.php'));
    }
}
