<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PublicPortfolioController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminPaymentController;
use App\Http\Controllers\Api\Admin\AdminPortfolioController;
use App\Http\Controllers\Api\Admin\AdminPricingController;
use App\Http\Controllers\Api\PayTechController;
use App\Http\Controllers\Api\PublicPricingController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('public')->group(function () {
    Route::get('/portfolio/{slug}', [PublicPortfolioController::class, 'show']);
    Route::post('/portfolio/{slug}/contact', [PublicPortfolioController::class, 'contact']);
    Route::get('/pricing', [PublicPricingController::class, 'index']);
    Route::get('/sitemap.xml', [SitemapController::class, 'index']);
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Protected routes (require authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Portfolio (user's own) — /portfolio/cv et /portfolio/preview avant /portfolio pour le matching
    Route::get('/portfolio/cv', [PortfolioController::class, 'downloadCv']);
    Route::get('/portfolio/preview', [PortfolioController::class, 'preview']);
    Route::get('/portfolio', [PortfolioController::class, 'show']);
    Route::put('/portfolio', [PortfolioController::class, 'update']);
    Route::post('/portfolio/profile-image', [PortfolioController::class, 'uploadProfileImage']);
    Route::post('/portfolio/cv', [PortfolioController::class, 'uploadCv']);
    Route::put('/portfolio/theme', [PortfolioController::class, 'updateTheme']);
    Route::put('/portfolio/publish', [PortfolioController::class, 'publish']);

    // Projects
    Route::apiResource('/projects', ProjectController::class);
    Route::post('/projects/{project}/image', [ProjectController::class, 'uploadImage']);
    Route::put('/projects/reorder', [ProjectController::class, 'reorder']);

    // Skills
    Route::apiResource('/skills', SkillController::class);
    Route::put('/skills/reorder', [SkillController::class, 'reorder']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments/proof', [PaymentController::class, 'uploadProof']);
    Route::post('/payments/paytech/request', [PayTechController::class, 'requestPayment']);
    Route::get('/payments/paytech/check-status', [PayTechController::class, 'checkStatus']);
});

// PayTech IPN Webhooks (sans auth - PayTech appelle ces URLs)
Route::prefix('payments/paytech')->group(function () {
    Route::post('/ipn', [PayTechController::class, 'handleIpn']);
    Route::post('/refund-ipn', [PayTechController::class, 'handleRefundIpn']);
});

// Admin authentication
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
});

// Admin protected routes
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Auth
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/dashboard/pending-payments', [AdminDashboardController::class, 'pendingPayments']);
    Route::get('/dashboard/recent-users', [AdminDashboardController::class, 'recentUsers']);

    // Users management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/stats', [AdminUserController::class, 'stats']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::post('/users/{user}/activate', [AdminUserController::class, 'activate']);
    Route::post('/users/{user}/suspend', [AdminUserController::class, 'suspend']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

    // Payments management
    Route::get('/payments', [AdminPaymentController::class, 'index']);
    Route::get('/payments/stats', [AdminPaymentController::class, 'stats']);
    Route::get('/payments/{payment}', [AdminPaymentController::class, 'show']);
    Route::post('/payments/{payment}/approve', [AdminPaymentController::class, 'approve']);
    Route::post('/payments/{payment}/reject', [AdminPaymentController::class, 'reject']);

    // Portfolios management
    Route::get('/portfolios', [AdminPortfolioController::class, 'index']);
    Route::get('/portfolios/stats', [AdminPortfolioController::class, 'stats']);
    Route::get('/portfolios/{portfolio}', [AdminPortfolioController::class, 'show']);
    Route::put('/portfolios/{portfolio}', [AdminPortfolioController::class, 'update']);
    Route::post('/portfolios/{portfolio}/publish', [AdminPortfolioController::class, 'publish']);
    Route::post('/portfolios/{portfolio}/unpublish', [AdminPortfolioController::class, 'unpublish']);
    Route::delete('/portfolios/{portfolio}', [AdminPortfolioController::class, 'destroy']);

    // Tarification (modèles de prix)
    Route::get('/pricing-models', [AdminPricingController::class, 'index']);
    Route::put('/pricing-models/{pricingModel}', [AdminPricingController::class, 'update']);
});
