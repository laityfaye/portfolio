<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Génère un sitemap XML dynamique incluant tous les portfolios publiés.
     * Accessible sans authentification pour les moteurs de recherche.
     */
    public function index(): Response
    {
        $baseUrl = rtrim(config('app.frontend_url', config('app.url')), '/');
        $portfolioBase = str_ends_with($baseUrl, '/p') ? $baseUrl : $baseUrl . '/p';

        $users = User::where('status', 'active')
            ->whereHas('portfolio', function ($q) {
                $q->where('status', 'published')
                    ->where('expires_at', '>', now());
            })
            ->with('portfolio:id,user_id,published_at,expires_at')
            ->get(['id', 'slug', 'first_name', 'last_name']);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Pages statiques
        $staticPages = [
            ['loc' => $portfolioBase . '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => $portfolioBase . '/login', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => $portfolioBase . '/register', 'priority' => '0.9', 'changefreq' => 'monthly'],
            ['loc' => $portfolioBase . '/demo', 'priority' => '0.8', 'changefreq' => 'weekly'],
        ];

        foreach ($staticPages as $page) {
            $loc = $page['loc'];
            if (!str_starts_with($loc, 'http')) {
                $loc = 'https://' . ltrim($loc, '/');
            }
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($loc) . "</loc>\n";
            $xml .= "    <lastmod>" . now()->format('Y-m-d') . "</lastmod>\n";
            $xml .= "    <changefreq>{$page['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$page['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        // Portfolios publiés
        foreach ($users as $user) {
            $url = rtrim($portfolioBase, '/') . '/' . $user->slug;
            if (!str_starts_with($url, 'http')) {
                $url = 'https://' . ltrim($url, '/');
            }
            $lastmod = $user->portfolio?->published_at?->format('Y-m-d') ?? now()->format('Y-m-d');
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($url) . "</loc>\n";
            $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>0.7</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
