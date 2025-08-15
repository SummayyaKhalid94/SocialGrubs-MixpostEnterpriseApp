<?php

namespace app\Override\ProTeam;

use Inovector\Mixpost\MixpostServiceProvider as VendorMixpostServiceProvider;

class MixpostServiceProvider extends VendorMixpostServiceProvider
{
    public function configurePackage(\Spatie\LaravelPackageTools\Package $package): void
    {
        parent::configurePackage($package);
    }

    public function boot(): void
    {
        parent::boot();
        // $this->loadRoutesFrom(base_path('custom-routes/web.php'));
    }
}
