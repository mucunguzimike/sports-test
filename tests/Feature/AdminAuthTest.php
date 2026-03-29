<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows admins to access the dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertStatus(200);
});

it('allows editors to access the dashboard', function () {
    $editor = User::factory()->create(['role' => 'editor']);

    $response = $this->actingAs($editor)->get(route('admin.dashboard'));

    $response->assertStatus(200);
});

it('prevents standard users from accessing the dashboard', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertRedirect('/login');
    $response->assertSessionHas('error');
});

it('prevents editors from modifying settings', function () {
    $editor = User::factory()->create(['role' => 'editor']);

    $response = $this->actingAs($editor)->get(route('admin.settings.index'));
    $response->assertStatus(403);

    $response = $this->actingAs($editor)->put(route('admin.settings.update'), [
        'site_name' => 'New Name',
    ]);
    $response->assertStatus(403);
});

it('allows admins to modify settings', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.settings.index'));
    $response->assertStatus(200);

    $response = $this->actingAs($admin)->put(route('admin.settings.update'), [
        'site_name' => 'New Name',
    ]);
    $response->assertRedirect();
    $response->assertSessionHas('success');
});
