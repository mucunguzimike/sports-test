import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import NewsletterFooter from '@/Components/NewsletterFooter';
import {
    index as blogIndex,
    show as blogShow,
    category as blogCategory,
    tag as blogTag,
} from '@/routes/blog';

const addCacheBust = (url: string): string => {
    if (!url) return url;
    // Only add cache bust for local storage URLs, not external ones
    if (url.startsWith('http') && !url.includes(window.location.hostname)) {
        return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
};

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    published_at: string;
    views: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    post_type?: string;
    video_thumbnail?: string | null;
    show_video_in_preview?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    posts_count?: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
}

interface PostCardProps {
    post: Post;
}

function PostCard({ post }: PostCardProps) {
    const imageSrc =
        post.post_type === 'video' &&
        post.show_video_in_preview &&
        post.video_thumbnail
            ? post.video_thumbnail
            : post.featured_image;

    if (!imageSrc) {
        return null;
    }

    return (
        <Link
            href={blogShow(post.slug)}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-900"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={addCacheBust(imageSrc)}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {post.post_type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                            <svg
                                className="ml-1 h-6 w-6 text-primary"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}
                {post.category && (
                    <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                        {post.category.name}
                    </span>
                )}
            </div>
            <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString(
                            'en-US',
                            {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            },
                        )}
                    </time>
                    <span>•</span>
                    <span>{post.views} views</span>
                </div>
                <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                    {post.title}
                </h3>
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

function HeroSlider({ posts }: { posts: Post[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (posts.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posts.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [posts.length]);

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-900 md:aspect-[21/9]">
            {/* Slides container */}
            <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {posts.map((post) => {
                    const heroImageSrc =
                        post.post_type === 'video' &&
                        post.show_video_in_preview &&
                        post.video_thumbnail
                            ? post.video_thumbnail
                            : post.featured_image;

                    if (!heroImageSrc) return null;

                    return (
                        <div
                            key={post.id}
                            className="relative h-full w-full flex-none"
                        >
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <img
                                src={addCacheBust(heroImageSrc)}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute right-0 bottom-0 left-0 z-20 p-6 md:p-12">
                                {post.category && (
                                    <Link
                                        href={blogCategory(post.category.slug)}
                                        className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary"
                                    >
                                        {post.category.name}
                                    </Link>
                                )}
                                <Link
                                    href={blogShow(post.slug)}
                                    className="group/link block"
                                >
                                    <h2 className="mb-3 text-2xl font-bold text-white transition-colors group-hover/link:text-primary md:text-5xl">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="mb-4 line-clamp-2 max-w-3xl text-sm text-gray-300 md:text-lg">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-400 md:text-sm">
                                    <time dateTime={post.published_at}>
                                        {new Date(
                                            post.published_at,
                                        ).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </time>
                                    {post.tags && post.tags.length > 0 && (
                                        <>
                                            <span>•</span>
                                            <span className="line-clamp-1">
                                                {post.tags
                                                    .map((t) => t.name)
                                                    .join(', ')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Dots */}
            {posts.length > 1 && (
                <div className="absolute right-8 bottom-6 z-30 flex gap-2">
                    {posts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                currentIndex === idx
                                    ? 'w-8 bg-primary'
                                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {posts.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev === 0 ? posts.length - 1 : prev - 1,
                            )
                        }
                        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-primary"
                        aria-label="Previous slide"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() =>
                            setCurrentIndex((prev) => (prev + 1) % posts.length)
                        }
                        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-primary"
                        aria-label="Next slide"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}

export default function BlogIndex({
    posts,
    featuredPosts,
    categories,
    tags,
    filters,
}: {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        total: number;
    };
    featuredPosts: Post[];
    categories: Category[];
    tags: Tag[];
    filters: { search?: string; tag?: string };
}) {
    const { url, props } = usePage();
    const settings = (props.settings as Record<string, any>) || {};

    const getYouTubeEmbedUrl = (
        videoUrl: string | null | undefined,
    ): string | null => {
        if (!videoUrl) {
            return null;
        }

        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = videoUrl.match(regExp);

        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}`
            : videoUrl;
    };

    // If no custom video is set, we can hide the section or show a fallback. We'll require it to be set to show.
    // However, for testing, we use the fallback if empty, then if users want to remove they can leave empty. Wait no...
    // Let's only render the section if a video is provided or if we want a fallback. Let's use a fallback for now.
    const embedUrl =
        getYouTubeEmbedUrl(settings.featured_video_url) ||
        'https://www.youtube.com/embed/dQw4w9WgXcQ';

    return (
        <>
            <Head title="Score 254 - The Beautiful Game" />
            <div className="min-h-screen bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                {/* Hero Section - Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section className="py-8">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <HeroSlider posts={featuredPosts} />
                        </div>
                    </section>
                )}

                {/* Featured Video Section */}
                {settings.featured_video_url && (
                    <section className="pb-8">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                                <div className="p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                                            <svg
                                                className="h-6 w-6 text-red-600"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                            Featured Video
                                        </h3>
                                    </div>
                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                        <iframe
                                            className="h-full w-full border-0"
                                            src={embedUrl}
                                            title="Featured Video"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Posts Grid */}
                        <div className="flex-1">
                            {/* Search and Filter Bar */}
                            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                                <form
                                    method="get"
                                    action="/blog"
                                    className="flex-1"
                                >
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="search"
                                            defaultValue={filters.search}
                                            placeholder="Search articles..."
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-12 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                        />
                                        <svg
                                            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    {filters.tag && (
                                        <input
                                            type="hidden"
                                            name="tag"
                                            value={filters.tag}
                                        />
                                    )}
                                </form>
                            </div>

                            {/* Active Filters */}
                            {(filters.search || filters.tag) && (
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        Filters:
                                    </span>
                                    {filters.search && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm text-primary dark:bg-primary/30 dark:text-primary/20">
                                            Search: {filters.search}
                                            <Link
                                                href={
                                                    filters.tag
                                                        ? `/blog?tag=${filters.tag}`
                                                        : '/blog'
                                                }
                                                className="ml-1 hover:text-primary"
                                            >
                                                ×
                                            </Link>
                                        </span>
                                    )}
                                    {filters.tag && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm text-primary dark:bg-primary/30 dark:text-primary/20">
                                            Tag: {filters.tag}
                                            <Link
                                                href={
                                                    filters.search
                                                        ? `/blog?search=${filters.search}`
                                                        : '/blog'
                                                }
                                                className="ml-1 hover:text-primary"
                                            >
                                                ×
                                            </Link>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Posts Grid - First 2 Rows */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {posts.data.slice(0, 6).map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Posts Grid - Remaining Rows */}
                            {posts.data.length > 6 && (
                                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {posts.data.slice(6).map((post) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {Array.from(
                                        { length: posts.last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/blog?page=${page}${
                                                filters.search
                                                    ? `&search=${filters.search}`
                                                    : ''
                                            }${filters.tag ? `&tag=${filters.tag}` : ''}`}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                posts.current_page === page
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white text-gray-600 hover:bg-primary/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary/30'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8 lg:w-80">
                            {/* Categories */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={blogCategory(cat.slug)}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {cat.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {cat.posts_count}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={blogTag(tag.slug)}
                                            className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-primary/20 hover:text-primary dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary/30 dark:hover:text-primary/20"
                                        >
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>

                {/* Footer */}
                <NewsletterFooter />
            </div>
        </>
    );
}
