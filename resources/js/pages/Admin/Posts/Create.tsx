import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Image,
    Video,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading,
    ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { MediaPicker } from '@/components/media-picker';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    gallery_images: string[] | null;
    video_url: string | null;
    is_featured: boolean;
    is_published: boolean;
    scheduled_at: string | null;
    category_id: number | null;
    tag_ids: number[];
    post_type?: string;
    video_thumbnail?: string | null;
    show_video_in_preview?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
}

export default function PostCreate({
    post,
    categories,
    tags,
    isEdit = false,
}: {
    post?: Post;
    categories: Category[];
    tags: Tag[];
    isEdit?: boolean;
}) {
    const { data, setData, processing, errors } = useForm({
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        featured_image: post?.featured_image || '',
        gallery_images: post?.gallery_images
            ? post.gallery_images.join('\n')
            : '',
        video_url: post?.video_url || '',
        is_featured: post?.is_featured || false,
        is_published: post?.is_published || false,
        scheduled_at: post?.scheduled_at || '',
        category_id: post?.category_id || '',
        tag_ids: post?.tag_ids || [],
        post_type: post?.post_type || 'standard',
        video_thumbnail: post?.video_thumbnail || '',
        show_video_in_preview: post?.show_video_in_preview || false,
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
    });

    const [activeTab, setActiveTab] = useState<
        'content' | 'media' | 'schedule'
    >('content');

    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerField, setMediaPickerField] = useState<
        'featured_image' | 'gallery_images' | 'video_thumbnail' | null
    >(null);

    const handleSubmit = (publish: boolean = false) => {
        const formData = {
            ...data,
            is_published: publish,
            gallery_images: data.gallery_images
                ? data.gallery_images.split('\n').filter(Boolean)
                : [],
            category_id: data.category_id
                ? parseInt(data.category_id as string)
                : null,
            tag_ids: data.tag_ids as number[],
        };

        if (isEdit && post?.id) {
            router.put(`/admin/posts/${post.id}`, formData, {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        } else {
            router.post('/admin/posts', formData);
        }
    };

    const openMediaPicker = (
        field: 'featured_image' | 'gallery_images' | 'video_thumbnail',
    ) => {
        setMediaPickerField(field);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url: string) => {
        if (mediaPickerField === 'featured_image') {
            setData('featured_image', url);
        } else if (mediaPickerField === 'video_thumbnail') {
            setData('video_thumbnail', url);
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Post' : 'New Post'}>
            <Head title={isEdit ? 'Edit Post' : 'New Post'} />

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/posts"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEdit ? 'Edit Post' : 'New Post'}
                            </h1>
                            <p className="text-gray-500">
                                {isEdit
                                    ? 'Update your post'
                                    : 'Create a new blog post'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={processing}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Save Draft
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit(true)}
                            disabled={processing}
                            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isEdit ? 'Update' : 'Publish'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title & Slug */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="Post title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData('slug', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                    placeholder="post-slug"
                                />
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <div className="mb-4 flex border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('content')}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        activeTab === 'content'
                                            ? 'border-b-2 border-primary text-primary'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Content
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('media')}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        activeTab === 'media'
                                            ? 'border-b-2 border-primary text-primary'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Media
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('schedule')}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        activeTab === 'schedule'
                                            ? 'border-b-2 border-primary text-primary'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Schedule
                                </button>
                            </div>

                            {activeTab === 'content' && (
                                <div>
                                    {/* Simple WYSIWYG Toolbar */}
                                    <div className="mb-2 flex gap-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 p-2">
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Bold"
                                        >
                                            <Bold className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Italic"
                                        >
                                            <Italic className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Heading"
                                        >
                                            <Heading className="h-4 w-4" />
                                        </button>
                                        <div className="mx-1 w-px bg-gray-300" />
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Bullet List"
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Numbered List"
                                        >
                                            <ListOrdered className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded p-2 hover:bg-gray-200"
                                            title="Quote"
                                        >
                                            <Quote className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={data.content}
                                        onChange={(e) =>
                                            setData('content', e.target.value)
                                        }
                                        className="h-96 w-full rounded-b-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="Write your content here... (HTML supported)"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        HTML supported: &lt;h2&gt;, &lt;p&gt;,
                                        &lt;ul&gt;, &lt;li&gt;,
                                        &lt;blockquote&gt;, etc.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-1 flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Featured Image
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openMediaPicker(
                                                        'featured_image',
                                                    )
                                                }
                                                className="text-xs text-primary hover:text-primary hover:underline"
                                            >
                                                Select from Media Library
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={data.featured_image}
                                                onChange={(e) =>
                                                    setData(
                                                        'featured_image',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openMediaPicker(
                                                        'featured_image',
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                            >
                                                <ImageIcon className="h-5 w-5 text-gray-500" />
                                            </button>
                                            {data.featured_image && (
                                                <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                                    <img
                                                        src={
                                                            data.featured_image
                                                        }
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Gallery Images (one URL per line)
                                        </label>
                                        <textarea
                                            value={data.gallery_images}
                                            onChange={(e) =>
                                                setData(
                                                    'gallery_images',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-32 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Video URL (YouTube or Vimeo)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.video_url}
                                            onChange={(e) =>
                                                setData(
                                                    'video_url',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Video Thumbnail
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={data.video_thumbnail}
                                                onChange={(e) =>
                                                    setData(
                                                        'video_thumbnail',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                                placeholder="https://example.com/thumbnail.jpg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openMediaPicker(
                                                        'video_thumbnail',
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                                            >
                                                <ImageIcon className="h-5 w-5 text-gray-500" />
                                            </button>
                                            {data.video_thumbnail && (
                                                <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                                    <img
                                                        src={
                                                            data.video_thumbnail
                                                        }
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'schedule' && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Schedule Publication
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) =>
                                            setData(
                                                'scheduled_at',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Leave empty to publish immediately or
                                        save as draft
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Excerpt
                            </label>
                            <textarea
                                value={data.excerpt}
                                onChange={(e) =>
                                    setData('excerpt', e.target.value)
                                }
                                className="h-24 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                placeholder="Brief summary of the post..."
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Category & Tags */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Organization
                            </h3>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <div className="max-h-48 space-y-2 overflow-y-auto">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.id}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(
                                                    data.tag_ids as number[]
                                                ).includes(tag.id)}
                                                onChange={(e) => {
                                                    const current =
                                                        data.tag_ids as number[];

                                                    if (e.target.checked) {
                                                        setData('tag_ids', [
                                                            ...current,
                                                            tag.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            'tag_ids',
                                                            current.filter(
                                                                (id) =>
                                                                    id !==
                                                                    tag.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                {tag.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Options
                            </h3>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Post Type
                                </label>
                                <select
                                    value={data.post_type}
                                    onChange={(e) =>
                                        setData('post_type', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                >
                                    <option value="standard">
                                        Standard Article
                                    </option>
                                    <option value="video">Video Post</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                'is_featured',
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Featured post
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.show_video_in_preview}
                                        onChange={(e) =>
                                            setData(
                                                'show_video_in_preview',
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Show Video in Preview
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* SEO Options */}
                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Search Engine Optimization
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) =>
                                            setData(
                                                'meta_title',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="Optional custom title for SEO"
                                        maxLength={255}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Overrides the default post title in
                                        search engines.
                                    </p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Meta Description
                                    </label>
                                    <textarea
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                'meta_description',
                                                e.target.value,
                                            )
                                        }
                                        className="h-24 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                                        placeholder="Optional concise summary for SEO..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Overrides the default excerpt in search
                                        results.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <MediaPicker
                open={mediaPickerOpen}
                onClose={() => {
                    setMediaPickerOpen(false);
                    setMediaPickerField(null);
                }}
                onSelect={handleMediaSelect}
                value={
                    mediaPickerField === 'featured_image'
                        ? data.featured_image
                        : mediaPickerField === 'video_thumbnail'
                          ? data.video_thumbnail
                          : ''
                }
                onChange={handleMediaSelect}
            />
        </AdminLayout>
    );
}
