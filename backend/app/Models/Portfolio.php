<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'display_name',
        'job_title',
        'hero_description',
        'profile_image',
        'hero_stats',
        'about_paragraph_1',
        'about_paragraph_2',
        'about_highlights',
        'about_stats',
        'cv_file',
        'contact_info',
        'social_links',
        'brand_name',
        'theme_color',
        'theme_mode',
        'template',
        'status',
        'published_at',
        'expires_at',
        'amount',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'hero_stats' => 'array',
            'about_highlights' => 'array',
            'about_stats' => 'array',
            'contact_info' => 'array',
            'social_links' => 'array',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'amount' => 'decimal:2',
        ];
    }

    /** Montant à payer pour ce portfolio (prix personnalisé > prix du template > défaut). */
    public function getPriceAmount(): float
    {
        if ($this->amount !== null && $this->amount > 0) {
            return (float) $this->amount;
        }
        return (float) PricingModel::getAmountForTemplate($this->template);
    }

    /** Devise pour ce portfolio. */
    public function getPriceCurrency(): string
    {
        if ($this->currency) {
            return $this->currency;
        }
        $model = PricingModel::getByTemplate($this->template) ?? PricingModel::getBySlug('portfolio_1y');
        return $model?->currency ?? 'FCFA';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)->orderBy('sort_order');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)->orderBy('sort_order');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /** Le portfolio est-il expiré (durée de vie 1 an dépassée) ? */
    public function isExpired(): bool
    {
        if ($this->expires_at === null) {
            return true; // Pas encore payé / pas d'abonnement
        }
        return $this->expires_at->isPast();
    }

    /** En ligne = publié et abonnement valide (non expiré). */
    public function isOnline(): bool
    {
        return $this->isPublished() && !$this->isExpired();
    }

    public function publish(): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function getSkillsByCategory(): array
    {
        return [
            'frontend' => $this->skills()->where('category', 'frontend')->get(),
            'backend' => $this->skills()->where('category', 'backend')->get(),
            'database_tools' => $this->skills()->where('category', 'database_tools')->get(),
        ];
    }
}
