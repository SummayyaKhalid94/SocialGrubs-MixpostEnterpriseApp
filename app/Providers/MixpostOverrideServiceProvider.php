<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inovector\Mixpost\Settings;
use App\Override\ProTeam\Settings as CustomSettings;
use Inovector\MixpostEnterprise\Http\Base\Controllers\Dashboard\Main\CreateWorkspaceController;

use App\Override\Enterprise\Base\Controllers\Dashboard\Main\CreateWorkspaceController as CustomCreateWorkspaceController;
use Inovector\Mixpost\Http\Base\Middleware\HandleInertiaRequests;
use App\Override\Enterprise\Base\Middleware\HandleInertiaRequests as CustomHandleInertiaRequests;
use Inovector\MixpostEnterprise\Http\Base\Controllers\Dashboard\Main\EmailVerificationNoticeController;
use App\Override\Enterprise\Base\Controllers\Dashboard\Main\EmailVerificationNoticeController as CustomEmailVerificationNoticeController;   

class MixpostOverrideServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(Settings::class, CustomSettings::class);
        $this->app->bind(CreateWorkspaceController::class, CustomCreateWorkspaceController::class);
        $this->app->bind(HandleInertiaRequests::class, CustomHandleInertiaRequests::class);
        $this->app->bind(EmailVerificationNoticeController::class, CustomEmailVerificationNoticeController::class);
    }
}
