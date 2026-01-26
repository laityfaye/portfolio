<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated and has admin abilities
        if (!$user || !$user->tokenCan('admin')) {
            return response()->json([
                'message' => 'Acces non autorise',
            ], 403);
        }

        return $next($request);
    }
}
