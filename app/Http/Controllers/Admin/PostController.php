<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'tags', 'user']);

        if ($request->filled('status')) {
            match ($request->status) {
                'published' => $query->published(),
                'draft' => $query->where('is_published', false),
                'scheduled' => $query->scheduled(),
                default => null,
            };
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query->latest()->paginate(20);

        return inertia('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return inertia('Admin/Posts/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'featured_image' => 'nullable|string',
            'gallery_images' => 'nullable|array',
            'video_url' => 'nullable|string',
            'video_thumbnail' => 'nullable|string',
            'post_type' => 'nullable|string|in:standard,video,gallery',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_video_in_preview' => 'boolean',
            'scheduled_at' => 'nullable|date|after:now',
            'tag_ids' => 'array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['user_id'] = $request->user()->id;

        if (! empty($validated['scheduled_at'])) {
            $validated['is_published'] = false;
        } elseif (isset($validated['is_published'])) {
            $validated['published_at'] = $validated['is_published'] ? now() : null;
        }

        $post = Post::create($validated);

        if (! empty($validated['tag_ids'])) {
            $post->tags()->attach($validated['tag_ids']);
        }

        return to_route('admin.posts.index')->with('success', 'Post created successfully.');
    }

    public function edit(Post $post)
    {
        $post->load(['tags']);
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return inertia('Admin/Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        \Log::info('Update request data:', $request->all());

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug,'.$post->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'featured_image' => 'nullable|string',
            'gallery_images' => 'nullable|array',
            'video_url' => 'nullable|string',
            'video_thumbnail' => 'nullable|string',
            'post_type' => 'nullable|string|in:standard,video,gallery',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'show_video_in_preview' => 'boolean',
            'scheduled_at' => 'nullable|date',
            'tag_ids' => 'array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        if (! empty($validated['scheduled_at'])) {
            $validated['is_published'] = false;
            $validated['published_at'] = null;
        } elseif (isset($validated['is_published'])) {
            if ($validated['is_published'] && ! $post->is_published) {
                $validated['published_at'] = now();
            } elseif (! $validated['is_published']) {
                $validated['scheduled_at'] = null;
                $validated['published_at'] = null;
            }
        }

        $post->update($validated);

        $post->tags()->sync($validated['tag_ids'] ?? []);

        \Log::info('Post updated successfully. featured_image:', ['featured_image' => $post->fresh()->featured_image]);

        return to_route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return to_route('admin.posts.index')->with('success', 'Post deleted successfully.');
    }

    public function publish(Post $post)
    {
        $post->publish();

        return back()->with('success', 'Post published successfully.');
    }

    public function draft(Post $post)
    {
        $post->draft();

        return back()->with('success', 'Post moved to draft.');
    }
}
