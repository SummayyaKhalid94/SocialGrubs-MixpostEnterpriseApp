<?php

namespace App\Http\Middleware;

use Closure;

class SetLocaleFromUrl
{
    public function handle($request, Closure $next)
    {
        $lang = $request->route('lang');

        app()->setLocale($lang ?? config('app.locale'));

        return $next($request);
    }
}
