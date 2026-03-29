<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::published()->count(),
            'draft_posts' => Post::where('is_published', false)->count(),
            'scheduled_posts' => Post::scheduled()->count(),
            'total_categories' => Category::count(),
            'total_tags' => Tag::count(),
        ];

        $recentPosts = Post::with(['category', 'user'])
            ->latest()
            ->take(10)
            ->get();

        $scheduledPosts = Post::scheduled()
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'scheduledPosts' => $scheduledPosts,
        ]);
    }
}
