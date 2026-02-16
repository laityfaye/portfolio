<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingModel extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'template',
        'amount',
        'currency',
        'duration_days',
        'is_active',
        'sort_order',
    ];

    public const TEMPLATES = ['classic', 'minimal', 'elegant', 'luxe'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'duration_days' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public static function getBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->where('is_active', true)->first();
    }

    /** Prix pour un template donné (Classic, Minimal, Elegant, Luxe). */
    public static function getByTemplate(?string $template): ?self
    {
        if (empty($template) || !in_array($template, self::TEMPLATES, true)) {
            return null;
        }
        return static::where('template', $template)->where('is_active', true)->first();
    }

    /** Montant pour un template ; sinon défaut portfolio_1y. */
    public static function getAmountForTemplate(?string $template): float
    {
        $model = static::getByTemplate($template);
        if ($model) {
            return (float) $model->amount;
        }
        return static::getPortfolioYearlyAmount();
    }

    public static function getPortfolioYearlyAmount(): float
    {
        $model = static::getBySlug('portfolio_1y');
        return $model ? (float) $model->amount : (float) config('paytech.default_amount', 2500);
    }
}
