<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! ($request->user()->isAdmin() || $request->user()->isEditor())) {
            return redirect('/login')->with('error', 'You must be an admin or editor to access this area.');
        }

        return $next($request);
    }
}
