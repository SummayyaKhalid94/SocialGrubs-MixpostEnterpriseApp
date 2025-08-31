<?php

namespace App\Override\Enterprise\Base\Controllers\Dashboard\Main;

use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Inovector\MixpostEnterprise\Configs\OnboardingConfig;
use Inovector\Mixpost\Util;
use Inovector\Mixpost\Facades\Settings;

class EmailVerificationNoticeController extends Controller
{
    public function __invoke(): RedirectResponse|Response
    {
        if (!app(OnboardingConfig::class)->get('email_verification') || Auth::user()->hasVerifiedEmail()) {
            return redirect()->route('mixpost.home');
        }

        return Inertia::render('Dashboard/Main/EmailVerificationNotice', [
            'settings' => Settings::all(),
            'locales' => Util::config('locales'),
        ]);
    }
}
