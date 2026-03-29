<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        abort_if(! request()->user()->isAdmin(), 403, 'Unauthorized. Only admins can access settings.');

        $settings = SiteSetting::getAll();
        $featuredPosts = Post::published()
            ->where('is_featured', true)
            ->orderBy('published_at', 'desc')
            ->get();

        return inertia('Admin/Settings/Index', [
            'settings' => $settings,
            'featuredPosts' => $featuredPosts,
            'allPosts' => Post::published()->orderBy('title')->get(),
        ]);
    }

    public function update(Request $request)
    {
        abort_if(! $request->user()->isAdmin(), 403, 'Unauthorized. Only admins can modify settings.');

        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_tagline' => 'nullable|string|max:255',
            'site_logo' => 'nullable|image|max:2048',
            'primary_color' => 'nullable|string|max:20',
            'accent_color' => 'nullable|string|max:20',
            'show_featured_posts' => 'boolean',
            'show_latest_posts' => 'boolean',
            'show_categories' => 'boolean',
            'footer_content' => 'nullable|string',
            'footer_copyright' => 'nullable|string',
            'social_facebook' => 'nullable|string|url',
            'social_twitter' => 'nullable|string|url',
            'social_instagram' => 'nullable|string|url',
            'social_youtube' => 'nullable|string|url',
            'featured_video_url' => 'nullable|string|url',
            'featured_post_ids' => 'array',
            'featured_post_ids.*' => 'exists:posts,id',
        ]);

        if ($request->hasFile('site_logo')) {
            $path = $request->file('site_logo')->store('settings', 'public');
            $validated['site_logo'] = Storage::url($path);
        } else {
            // Keep existing logo if no new file is uploaded
            unset($validated['site_logo']);
        }

        foreach ($validated as $key => $value) {
            if (is_array($value)) {
                $value = json_encode($value);
            }
            SiteSetting::set($key, $value);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
