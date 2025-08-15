<?php

namespace Inovector\Mixpost\Http\Base\Controllers\Workspace;

use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Inovector\Mixpost\Http\Base\Resources\AccountResource;
use Inovector\Mixpost\Models\Account;
use Inovector\Mixpost\Util;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Workspace/Dashboard', [
            'accounts' => fn() => AccountResource::collection(Account::oldest()->get())->resolve(),
            'locales' => Util::config('locales'),
        ]);
    }
}
