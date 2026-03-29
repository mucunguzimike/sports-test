import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, X } from 'lucide-react';
import AdminLayout from '@/layouts/Admin/AdminLayout';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    is_published: boolean;
    is_featured: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    views: number;
    category?: { id: number; name: string };
    tags: Array<{ id: number; name: string }>;
    user?: { name: string };
}

export default function PostsIndex({
    posts,
    filters,
}: {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: { status?: string; search?: string };
}) {
    const { url } = usePage();

    const getStatusBadge = (post: Post) => {
        if (post.scheduled_at) {
            return (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    <Calendar className="mr-1 h-3 w-3" />
                    Scheduled
                </span>
            );
        }

        if (post.is_published) {
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <Eye className="mr-1 h-3 w-3" />
                    Published
                </span>
            );
        }

        return (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                Draft
            </span>
        );
    };

    return (
        <AdminLayout title="Posts">
            <Head title="Posts - Admin" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
                    <p className="text-gray-500">{posts.total} total posts</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                </Link>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow">
                <form method="get" className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search posts..."
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-primary"
                            />
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <select
                        name="status"
                        defaultValue={filters.status}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                    >
                        Filter
                    </button>
                </form>
            </div>

            {/* Posts Table */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {posts.data.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {post.featured_image && (
                                            <img
                                                src={post.featured_image}
                                                alt=""
                                                className="mr-4 h-10 w-10 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="text-sm font-medium text-gray-900 hover:text-primary"
                                            >
                                                {post.title}
                                            </Link>
                                            <p className="line-clamp-1 text-xs text-gray-500">
                                                {post.slug}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {post.category ? (
                                        <span className="text-sm text-gray-600">
                                            {post.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(post)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {post.views}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {post.published_at
                                        ? new Date(
                                              post.published_at,
                                          ).toLocaleDateString()
                                        : post.scheduled_at
                                          ? new Date(
                                                post.scheduled_at,
                                            ).toLocaleDateString()
                                          : '—'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-primary"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-blue-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <form
                                            method="POST"
                                            action={`/admin/posts/${post.id}`}
                                            className="inline"
                                            onSubmit={(e) => {
                                                if (!confirm('Are you sure?')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="_method"
                                                value="DELETE"
                                            />
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value="csrf-token"
                                            />
                                            <button
                                                type="submit"
                                                className="p-2 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {posts.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex gap-2">
                        {Array.from(
                            { length: posts.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/posts?page=${page}${filters.status ? `&status=${filters.status}` : ''}${filters.search ? `&search=${filters.search}` : ''}`}
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                    posts.current_page === page
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </AdminLayout>
    );
}
