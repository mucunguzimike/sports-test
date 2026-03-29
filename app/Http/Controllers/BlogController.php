<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $tagSlug = $request->tag;
        $page = $request->get('page', 1);

        $cacheKey = "blog_posts_index_{$search}_{$tagSlug}_{$page}";

        $query = Post::published()
            ->with(['category', 'tags'])
            ->latest('published_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($tagSlug) {
            $tag = Tag::where('slug', $tagSlug)->first();
            if ($tag) {
                $query->whereHas('tags', function ($q) use ($tag) {
                    $q->where('tags.id', $tag->id);
                });
            }
        }

        $posts = $query->paginate(12);

        $featuredPosts = Post::published()
            ->featured()
            ->with(['category', 'tags'])
            ->latest('published_at')
            ->take(3)
            ->get();

        $tags = Tag::withCount('posts')->orderByDesc('posts_count')->get();

        return Inertia::render('Blog/index', [
            'posts' => $posts,
            'featuredPosts' => $featuredPosts,
            'tags' => $tags,
            'filters' => [
                'search' => $search,
                'tag' => $tagSlug,
            ],
        ]);
    }

    public function show(Post $post)
    {
        $post->load(['category', 'tags', 'user']);
        $post->increment('views');

        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->with(['category', 'tags'])
            ->latest('published_at')
            ->take(3)
            ->get();

        if ($related->count() < 3) {
            $additional = Post::published()
                ->where('id', '!=', $post->id)
                ->whereNotIn('id', $related->pluck('id'))
                ->whereHas('tags', function ($q) use ($post) {
                    $q->whereIn('tags.id', $post->tags->pluck('id'));
                })
                ->with(['category', 'tags'])
                ->latest('published_at')
                ->take(3 - $related->count())
                ->get();

            $related = $related->merge($additional);
        }
        $relatedPosts = $related->values();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function category(Category $category)
    {
        $page = request()->get('page', 1);

        $posts = Post::published()
            ->where('category_id', $category->id)
            ->with(['category', 'tags'])
            ->latest('published_at')
            ->paginate(12);

        $tags = Tag::withCount('posts')->orderByDesc('posts_count')->get();

        return Inertia::render('Blog/Category', [
            'category' => $category,
            'posts' => $posts,
            'tags' => $tags,
        ]);
    }

    public function tag(Tag $tag)
    {
        $page = request()->get('page', 1);

        $posts = Post::published()
            ->whereHas('tags', function ($q) use ($tag) {
                $q->where('tags.id', $tag->id);
            })
            ->with(['category', 'tags'])
            ->latest('published_at')
            ->paginate(12);

        $tags = Tag::withCount('posts')->orderByDesc('posts_count')->get();

        return Inertia::render('Blog/Tag', [
            'tag' => $tag,
            'posts' => $posts,
            'tags' => $tags,
        ]);
    }
}
