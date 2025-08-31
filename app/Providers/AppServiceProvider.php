<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Inovector\Mixpost\Settings;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Ensure new users receive verification email automatically
        User::observe(UserObserver::class);

        // Share Mixpost settings with Inertia (keeps existing behavior)
        Inertia::share([
            'settings' => function () {
                return app(Settings::class)->all();
            },
        ]);
    }
}
