import { Head, Link, usePage } from '@inertiajs/react';
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
    featured_image: string;
    published_at: string;
    views: number;
    category?: { id: number; name: string; slug: string };
    tags?: Array<{ id: number; name: string; slug: string }>;
    post_type?: string;
    video_thumbnail?: string | null;
    show_video_in_preview?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
}

export default function BlogTag({
    tag,
    posts,
    categories,
    tags,
}: {
    tag: Tag;
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    tags: Tag[];
}) {
    const { url } = usePage();

    return (
        <>
            <Head title={`${tag.name} - Score 254`} />
            <div className="min-h-screen bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                <section className="bg-primary py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="mb-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-medium">
                            Tag
                        </div>
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                            {tag.name}
                        </h1>
                        <p className="text-white/90">{posts.total} articles</p>
                    </div>
                </section>

                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <div className="flex-1">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {posts.data.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={blogShow(post.slug)}
                                        className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-900"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={addCacheBust(
                                                    post.post_type ===
                                                        'video' &&
                                                        post.show_video_in_preview &&
                                                        post.video_thumbnail
                                                        ? post.video_thumbnail
                                                        : post.featured_image,
                                                )}
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
                                                <time
                                                    dateTime={post.published_at}
                                                >
                                                    {new Date(
                                                        post.published_at,
                                                    ).toLocaleDateString(
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
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {posts.last_page > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {Array.from(
                                        { length: posts.last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/tag/${tag.slug}?page=${page}`}
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

                        <aside className="space-y-8 lg:w-80">
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

                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((t) => (
                                        <Link
                                            key={t.id}
                                            href={blogTag(t.slug)}
                                            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                                                t.slug === tag.slug
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-primary/20 hover:text-primary dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary/30 dark:hover:text-primary/20'
                                            }`}
                                        >
                                            {t.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>

                <NewsletterFooter />
            </div>
        </>
    );
}
