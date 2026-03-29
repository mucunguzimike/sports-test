<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows guests to subscribe to the newsletter', function () {
    $response = $this->post(route('newsletter.subscribe'), [
        'email' => 'test@example.com',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Thanks for subscribing!');

    $this->assertDatabaseHas('newsletter_subscriptions', [
        'email' => 'test@example.com',
    ]);
});

it('prevents duplicate subscriptions', function () {
    \App\Models\NewsletterSubscription::create(['email' => 'test@example.com']);

    $response = $this->post(route('newsletter.subscribe'), [
        'email' => 'test@example.com',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertDatabaseCount('newsletter_subscriptions', 1);
});
