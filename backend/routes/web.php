<?php

use App\Http\Controllers\Api\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Sitemap portfolio — accessible sans préfixe /api (pour Google Search Console)
Route::get('/sitemap-portfolios.xml', [SitemapController::class, 'index']);
