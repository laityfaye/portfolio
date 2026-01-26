<?php

namespace App\Policies;

use App\Models\Skill;
use App\Models\User;

class SkillPolicy
{
    public function view(User $user, Skill $skill): bool
    {
        return $user->portfolio->id === $skill->portfolio_id;
    }

    public function update(User $user, Skill $skill): bool
    {
        return $user->portfolio->id === $skill->portfolio_id;
    }

    public function delete(User $user, Skill $skill): bool
    {
        return $user->portfolio->id === $skill->portfolio_id;
    }
}
