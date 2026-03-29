import { Head, useForm } from '@inertiajs/react';
import { Save, Palette, Layout, Link as LinkIcon, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';

const ColorPickerSection = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => {
    return (
        <div className="grid grid-cols-1 gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-gray-300 p-1"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-mono uppercase focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
};

interface Post {
    id: number;
    title: string;
    is_featured: boolean;
}

interface Settings {
    site_name?: string;
    site_tagline?: string;
    site_logo?: string | File;
    primary_color?: string;
    accent_color?: string;
    show_featured_posts?: string;
    show_latest_posts?: string;
    show_categories?: string;
    footer_content?: string;
    footer_copyright?: string;
    social_facebook?: string;
    social_twitter?: string;
    social_instagram?: string;
    social_youtube?: string;
    featured_video_url?: string;
    featured_post_ids?: string;
}

export default function SettingsIndex({
    settings,
    featuredPosts,
    allPosts,
}: {
    settings: Settings;
    featuredPosts: Post[];
    allPosts: Post[];
}) {
    const getFeaturedIds = () => {
        try {
            return settings.featured_post_ids
                ? JSON.parse(settings.featured_post_ids)
                : [];
        } catch {
            return [];
        }
    };

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        site_logo: settings.site_logo || '',
        primary_color: settings.primary_color || '#059669',
        accent_color: settings.accent_color || '#10b981',
        show_featured_posts: settings.show_featured_posts === '1',
        show_latest_posts: settings.show_latest_posts === '1',
        show_categories: settings.show_categories === '1',
        footer_content: settings.footer_content || '',
        footer_copyright: settings.footer_copyright || '',
        social_facebook: settings.social_facebook || '',
        social_twitter: settings.social_twitter || '',
        social_instagram: settings.social_instagram || '',
        social_youtube: settings.social_youtube || '',
        featured_video_url: settings.featured_video_url || '',
        featured_post_ids: getFeaturedIds(),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const toggleFeaturedPost = (postId: number) => {
        const current = data.featured_post_ids;

        if (current.includes(postId)) {
            setData('featured_post_ids', current.filter((id: number) => id !== postId));
        } else {
            setData('featured_post_ids', [...current, postId]);
        }
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Settings - Admin" />

            <form onSubmit={submit}>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 text-primary">
                            Settings
                        </h1>
                        <p className="text-gray-500">
                            Configure your blog settings
                        </p>
                    </div>
                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600 animate-in fade-in slide-in-from-top-2">
                            <Check className="h-4 w-4" />
                            Settings saved!
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-center gap-3">
                            <Layout className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                General
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={e => setData('site_name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    value={data.site_tagline}
                                    onChange={e => setData('site_tagline', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Logo Image
                                </label>
                                <div className="flex items-start gap-6">
                                    {data.site_logo && (
                                        <div className="flex-shrink-0">
                                            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                {typeof data.site_logo === 'string' ? (
                                                    <img 
                                                        src={data.site_logo} 
                                                        alt="Site Logo" 
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 italic text-xs text-gray-400">
                                                        New Logo Selected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('site_logo', e.target.files?.[0] || '')}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            PNG, JPG, or SVG up to 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-center gap-3">
                            <Palette className="h-5 w-5 text-gray-400 text-primary" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Colors
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <ColorPickerSection 
                                label="Primary Color" 
                                value={data.primary_color}
                                onChange={val => setData('primary_color', val)}
                            />
                            <ColorPickerSection 
                                label="Accent Color" 
                                value={data.accent_color}
                                onChange={val => setData('accent_color', val)}
                            />
                        </div>
                    </div>

                    {/* Homepage Layout */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-center gap-3">
                            <Layout className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Homepage Sections
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.show_featured_posts}
                                    onChange={e => setData('show_featured_posts', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Show Featured Posts
                                </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.show_latest_posts}
                                    onChange={e => setData('show_latest_posts', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Show Latest Posts
                                </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.show_categories}
                                    onChange={e => setData('show_categories', e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Show Categories
                                </span>
                            </label>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Featured YouTube Video URL
                            </label>
                            <input
                                type="url"
                                value={data.featured_video_url}
                                onChange={e => setData('featured_video_url', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The video you want to feature on the homepage. Must be a valid YouTube URL.
                            </p>
                        </div>
                    </div>

                    {/* Featured Posts */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">
                            Featured Posts
                        </h2>
                        <p className="mb-4 text-sm text-gray-500">
                            Select posts to feature on the homepage
                        </p>
                        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-gray-100 p-2">
                            {allPosts.map((post) => (
                                <label
                                    key={post.id}
                                    className="flex items-center rounded p-2 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.featured_post_ids.includes(post.id)}
                                        onChange={() => toggleFeaturedPost(post.id)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {post.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">
                            Footer
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Footer Content
                                </label>
                                <textarea
                                    value={data.footer_content}
                                    onChange={e => setData('footer_content', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                    rows={3}
                                    placeholder="Additional footer information..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Copyright Text
                                </label>
                                <input
                                    type="text"
                                    value={data.footer_copyright}
                                    onChange={e => setData('footer_copyright', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex items-center gap-3">
                            <LinkIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Social Media Links
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={data.social_facebook}
                                    onChange={e => setData('social_facebook', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Twitter/X
                                </label>
                                <input
                                    type="url"
                                    value={data.social_twitter}
                                    onChange={e => setData('social_twitter', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={data.social_instagram}
                                    onChange={e => setData('social_instagram', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    YouTube
                                </label>
                                <input
                                    type="url"
                                    value={data.social_youtube}
                                    onChange={e => setData('social_youtube', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {processing ? (
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
