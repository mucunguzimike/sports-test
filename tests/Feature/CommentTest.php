<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows authenticated users to comment on posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this->actingAs($user)->post(route('blog.comments.store', $post->slug), [
        'content' => 'This is a great test comment!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Comment posted successfully!');

    $this->assertDatabaseHas('comments', [
        'user_id' => $user->id,
        'post_id' => $post->id,
        'content' => 'This is a great test comment!',
        'is_approved' => true,
    ]);
});

it('prevents guests from commenting', function () {
    $post = Post::factory()->create();

    $response = $this->post(route('blog.comments.store', $post->slug), [
        'content' => 'This is a great test comment!',
    ]);

    $response->assertRedirect('/login');
    $this->assertDatabaseCount('comments', 0);
});

it('validates comment content', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $response = $this->actingAs($user)->post(route('blog.comments.store', $post->slug), [
        'content' => '',
    ]);

    $response->assertSessionHasErrors('content');
});
