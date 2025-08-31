@php

app()->setlocale(request()->route('lang') ?? app()->getLocale());

@endphp

<!DOCTYPE html>
<html lang="{{ request()->route('lang') ?? app()->getLocale() }}" dir="{{ (request()->route('lang') ?? app()->getLocale()) === 'ar-SA' ? 'rtl' : 'ltr' }}" class="scroll-smooth overflow-x-hidden">

<head>
    <title>
        @hasSection('title')
        @yield('title')
        @else
        {{ config('app.name') }}
        @endif
    </title>

    @yield('meta')

    @include('mixpost::partial.head')
</head>

<body class="font-sans">
    @yield('content')
</body>

</html>