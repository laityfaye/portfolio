<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SearchEngineIndexingService
{
    /**
     * Notifie les moteurs de recherche qu'un nouveau portfolio a été publié.
     * Appelé automatiquement à chaque publication.
     */
    public static function notifyPortfolioPublished(string $portfolioUrl): void
    {
        $url = rtrim($portfolioUrl, '/');
        if (!str_starts_with($url, 'http')) {
            $url = 'https://' . $url;
        }

        // 1. Ping Google (sitemap) - Google recrawlera le sitemap
        self::pingGoogleSitemap();

        // 2. Ping Bing (sitemap)
        self::pingBingSitemap();

        // 3. IndexNow - Bing, Yandex et autres (indexation immédiate)
        self::submitIndexNow($url);

        Log::info('Indexation notifiée pour le portfolio', ['url' => $url]);
    }

    /**
     * Ping Google pour demander le recrawl du sitemap
     */
    private static function pingGoogleSitemap(): void
    {
        $sitemapUrl = self::getSitemapUrl();
        $pingUrl = 'https://www.google.com/ping?sitemap=' . urlencode($sitemapUrl);

        try {
            Http::timeout(5)->get($pingUrl);
        } catch (\Throwable $e) {
            Log::warning('Ping Google sitemap échoué', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Ping Bing pour demander le recrawl du sitemap
     */
    private static function pingBingSitemap(): void
    {
        $sitemapUrl = self::getSitemapUrl();
        $pingUrl = 'https://www.bing.com/ping?sitemap=' . urlencode($sitemapUrl);

        try {
            Http::timeout(5)->get($pingUrl);
        } catch (\Throwable $e) {
            Log::warning('Ping Bing sitemap échoué', ['error' => $e->getMessage()]);
        }
    }

    /**
     * IndexNow - indexation quasi-instantanée (Bing, Yandex, etc.)
     */
    private static function submitIndexNow(string $url): void
    {
        $key = config('app.indexnow_key');
        $keyLocation = config('app.indexnow_key_location');

        if (!$key || !$keyLocation) {
            return;
        }

        try {
            Http::timeout(5)
                ->withHeaders(['Content-Type' => 'application/json; charset=utf-8'])
                ->post('https://api.indexnow.org/indexnow', [
                    'host' => parse_url($url, PHP_URL_HOST),
                    'key' => $key,
                    'keyLocation' => $keyLocation,
                    'urlList' => [$url],
                ]);
        } catch (\Throwable $e) {
            Log::warning('IndexNow échoué', ['error' => $e->getMessage()]);
        }
    }

    private static function getSitemapUrl(): string
    {
        $apiUrl = rtrim(config('app.url'), '/');
        return $apiUrl . '/api/public/sitemap.xml';
    }
}
