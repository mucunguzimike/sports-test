import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

export default function TagsIndex({ tags }: { tags: { data: Tag[] } }) {
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setFormData({ name: tag.name, slug: tag.slug });
        setShowModal(true);
    };

    return (
        <AdminLayout title="Tags">
            <Head title="Tags - Admin" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
                    <p className="text-gray-500">Manage tags for your posts</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTag(null);
                        setFormData({ name: '', slug: '' });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Tag
                </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Posts
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {tags.data.map((tag) => (
                            <tr key={tag.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <TagIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {tag.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {tag.slug}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {tag.posts_count}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(tag)}
                                            className="p-2 text-gray-400 hover:text-primary"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <form
                                            method="POST"
                                            action={`/admin/tags/${tag.id}`}
                                            onSubmit={(e) => {
                                                if (
                                                    !confirm('Delete this tag?')
                                                ) {
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

            {showModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-lg font-bold text-gray-900">
                            {editingTag ? 'Edit Tag' : 'New Tag'}
                        </h2>
                        <form
                            method="POST"
                            action={
                                editingTag
                                    ? `/admin/tags/${editingTag.id}`
                                    : '/admin/tags'
                            }
                        >
                            {editingTag && (
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="PUT"
                                />
                            )}
                            <input
                                type="hidden"
                                name="_token"
                                value="csrf-token"
                            />
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                slug: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                                >
                                    {editingTag ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
