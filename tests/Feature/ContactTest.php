<?php

test('contact page is accessible', function () {
    $response = $this->get('/contact');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Contact'));
});

test('contact form submission validates input', function () {
    $response = $this->post('/contact', []);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
});

test('contact form can be submitted successfully', function () {
    $response = $this->post('/contact', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'message' => 'This is a test message regarding soccer tactics.',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $this->followRedirects($response)->assertSessionHas('success');
});

test('legal pages are accessible', function () {
    $this->get('/terms')->assertStatus(200)->assertInertia(fn ($page) => $page->component('Legal/Terms'));
    $this->get('/privacy')->assertStatus(200)->assertInertia(fn ($page) => $page->component('Legal/Privacy'));
    $this->get('/affiliate')->assertStatus(200)->assertInertia(fn ($page) => $page->component('Legal/Affiliate'));
});

