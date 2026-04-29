<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator', 'description' => 'Full access to application settings and user management.']
        );

        Role::firstOrCreate(
            ['slug' => 'manager'],
            ['name' => 'Manager', 'description' => 'Can manage day-to-day operations and reports.']
        );

        Role::firstOrCreate(
            ['slug' => 'member'],
            ['name' => 'Member', 'description' => 'Standard authenticated user access.']
        );

        User::query()->where('email', 'admin@themesbrand.com')->update(['role_id' => $admin->id]);
    }
}
