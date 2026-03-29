import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    gallery_images?: string[];
    video_url?: string | null;
    published_at: string;
    views: number;
    user?: {
        name: string;
    };
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
    meta_title?: string | null;
    meta_description?: string | null;
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

function SocialShare({ post }: { post: Post }) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const encodedTitle = encodeURIComponent(post.title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(shareUrl)}`,
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Share:</span>
            <div className="flex gap-2">
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                    aria-label="Share on Facebook"
                >
                    <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
                    aria-label="Share on X"
                >
                    <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-white transition-colors hover:bg-blue-800"
                    aria-label="Share on LinkedIn"
                >
                    <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
                <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white transition-colors hover:bg-green-600"
                    aria-label="Share on WhatsApp"
                >
                    <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

function ImageGallery({ images }: { images: string[] }) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="my-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Gallery
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg"
                    >
                        <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            loading="lazy"
                            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function VideoEmbed({
    url,
    isHero = false,
}: {
    url: string;
    isHero?: boolean;
}) {
    if (!url) {
        return null;
    }

    let embedUrl = url;

    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    return (
        <div className={isHero ? 'mb-8' : 'my-8'}>
            {!isHero && (
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Video
                </h3>
            )}
            <div
                className={`${isHero ? 'aspect-video w-full' : 'aspect-video'} overflow-hidden rounded-xl bg-gray-900`}
            >
                <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}

function RelatedPosts({ posts }: { posts: Post[] }) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 border-t border-gray-200 pt-12 dark:border-gray-800">
            <h3 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
                Related Articles
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={blogShow(post.slug)}
                        className="group block"
                    >
                        <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                            <img
                                src={addCacheBust(post.featured_image)}
                                alt={post.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <h4 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary dark:text-white">
                            {post.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                            {new Date(post.published_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function BlogShow({
    post,
    relatedPosts,
}: {
    post: Post;
    relatedPosts: Post[];
}) {
    const articleContent = post?.content || '';
    const hasGallery =
        post?.gallery_images &&
        Array.isArray(post.gallery_images) &&
        post.gallery_images.length > 0;
    const hasVideo = post?.video_url;

    return (
        <>
            <Head>
                <title>{`${post?.meta_title || post?.title || 'Article'} - Score 254`}</title>
                <meta
                    head-key="description"
                    name="description"
                    content={`${post?.meta_description || post?.excerpt || ''}`}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={`${post?.meta_title || post?.title || ''}`}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={`${post?.meta_description || post?.excerpt || ''}`}
                />
                <meta head-key="og:type" property="og:type" content="article" />
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={addCacheBust(
                        `${post?.video_thumbnail || post?.featured_image || ''}`,
                    )}
                />
                <meta
                    head-key="twitter:card"
                    name="twitter:card"
                    content="summary_large_image"
                />
            </Head>
            <div className="min-h-screen bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Hero Media */}
                    {post.post_type === 'video' && hasVideo ? (
                        <VideoEmbed url={post.video_url!} isHero={true} />
                    ) : (
                        post.featured_image && (
                            <div className="mb-8 aspect-[21/9] overflow-hidden rounded-2xl">
                                <img
                                    src={addCacheBust(post.featured_image)}
                                    alt={post.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )
                    )}

                    {/* Meta */}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        {post.category && (
                            <Link
                                href={blogCategory(post.category.slug)}
                                className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-primary"
                            >
                                {post.category.name}
                            </Link>
                        )}
                        <time
                            className="text-gray-500"
                            dateTime={post.published_at}
                        >
                            {new Date(post.published_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </time>
                        <span className="text-gray-500">
                            {post.views} views
                        </span>
                        {post.user && (
                            <span className="text-gray-500">
                                by {post.user.name}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={blogTag(tag.slug)}
                                    className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-primary/20 hover:text-primary dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary/30 dark:hover:text-primary/20"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Social Share */}
                    <div className="mb-8 flex items-center justify-between border-y border-gray-200 py-6 dark:border-gray-800">
                        <SocialShare post={post} />
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: articleContent }}
                    />

                    {/* Video (if not hero) */}
                    {hasVideo && post.post_type !== 'video' && (
                        <VideoEmbed url={post.video_url!} />
                    )}

                    {/* Gallery */}
                    {hasGallery && (
                        <ImageGallery images={post.gallery_images!} />
                    )}

                    {/* Social Share Bottom */}
                    <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
                        <SocialShare post={post} />
                    </div>

                    {/* Related Posts */}
                    <RelatedPosts posts={relatedPosts} />
                </article>

                {/* Footer */}
                <NewsletterFooter />
            </div>
        </>
    );
}
