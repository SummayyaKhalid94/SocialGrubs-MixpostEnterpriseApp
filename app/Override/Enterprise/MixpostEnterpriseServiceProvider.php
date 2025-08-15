<?php

namespace app\Override\Enterprise;

use Inovector\MixpostEnterprise\MixpostEnterpriseServiceProvider as VendorMixpostEnterpriseServiceProvider;

class MixpostEnterpriseServiceProvider extends VendorMixpostEnterpriseServiceProvider
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
