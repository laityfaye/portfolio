<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'proof_image' => Storage::disk('public')->url($this->proof_image),
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
        ];
    }
}
