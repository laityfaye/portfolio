<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'proof_image',
        'amount',
        'currency',
        'status',
        'admin_notes',
        'verified_by',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'verified_by');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function approve(Admin $admin, ?string $notes = null): void
    {
        $this->update([
            'status' => 'approved',
            'verified_by' => $admin->id,
            'verified_at' => now(),
            'admin_notes' => $notes,
        ]);

        // Activate the user
        $this->user->update(['status' => 'active']);
    }

    public function reject(Admin $admin, ?string $notes = null): void
    {
        $this->update([
            'status' => 'rejected',
            'verified_by' => $admin->id,
            'verified_at' => now(),
            'admin_notes' => $notes,
        ]);
    }
}
