<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'proof_image' => $this->proof_image ? Storage::disk('public')->url($this->proof_image) : null,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
            'type' => $this->type ?? 'manual',
            'ref_command' => $this->ref_command,
            'payment_method' => $this->payment_method,
        ];

        if ($this->relationLoaded('user')) {
            $data['user'] = [
                'id' => $this->user->id,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
                'email' => $this->user->email,
            ];
        }

        return $data;
    }
}
