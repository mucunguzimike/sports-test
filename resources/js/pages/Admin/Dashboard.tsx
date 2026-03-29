import { Head, Link } from '@inertiajs/react';
import { FileText, Folder, Tag, Users, Eye, Calendar } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';

interface Post {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    published_at: string | null;
    category?: { name: string };
}

interface Stats {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    scheduled_posts: number;
    total_categories: number;
    total_tags: number;
}

export default function Dashboard({
    stats,
    recentPosts,
    scheduledPosts,
}: {
    stats: Stats;
    recentPosts: Post[];
    scheduledPosts: Post[];
}) {
    const statCards = [
        {
            name: 'Total Posts',
            value: stats.total_posts,
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            name: 'Published',
            value: stats.published_posts,
            icon: Eye,
            color: 'bg-green-500',
        },
        {
            name: 'Drafts',
            value: stats.draft_posts,
            icon: FileText,
            color: 'bg-yellow-500',
        },
        {
            name: 'Scheduled',
            value: stats.scheduled_posts,
            icon: Calendar,
            color: 'bg-purple-500',
        },
        {
            name: 'Categories',
            value: stats.total_categories,
            icon: Folder,
            color: 'bg-primary',
        },
        {
            name: 'Tags',
            value: stats.total_tags,
            icon: Tag,
            color: 'bg-orange-500',
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your blog</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="overflow-hidden rounded-lg bg-white shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div
                                    className={`flex-shrink-0 rounded-md ${stat.color} p-3`}
                                >
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5 flex-1">
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        {stat.name}
                                    </dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        {stat.value}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Posts */}
                <div className="rounded-lg bg-white shadow">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            Recent Posts
                        </h2>
                        <Link
                            href="/admin/posts"
                            className="text-sm text-primary hover:text-primary"
                        >
                            View all
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {recentPosts.map((post) => (
                            <li key={post.id}>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="block px-5 py-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {post.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {post.category?.name ||
                                                    'Uncategorized'}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    post.is_published
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {post.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Scheduled Posts */}
                <div className="rounded-lg bg-white shadow">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            Scheduled Posts
                        </h2>
                    </div>
                    {scheduledPosts.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {scheduledPosts.map((post) => (
                                <li key={post.id}>
                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="block px-5 py-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {post.title}
                                                </p>
                                            </div>
                                            <div className="ml-4 text-sm text-gray-500">
                                                {post.published_at &&
                                                    new Date(
                                                        post.published_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-5 py-8 text-center text-gray-500">
                            No scheduled posts
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
