import { Head, usePage } from '@inertiajs/react';
import {
    Upload,
    Image as ImageIcon,
    Video,
    FileText,
    Search,
    Trash2,
    Edit,
    X,
    PictureInPicture,
    Copy,
    Check,
} from 'lucide-react';
import { useState, useRef } from 'react';
import AdminLayout from '@/layouts/Admin/AdminLayout';

interface Media {
    id: number;
    filename: string;
    original_filename: string;
    path: string;
    type: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    caption: string | null;
    created_at: string;
    url?: string;
    thumbnail_url?: string;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return bytes + ' B';
    }

    if (bytes < 1048576) {
        return (bytes / 1024).toFixed(1) + ' KB';
    }

    return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function MediaIndex({
    media,
    stats,
    filters,
}: {
    media: {
        data: Media[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total: number;
        images: number;
        videos: number;
        documents: number;
        total_size: number;
    };
    filters: { type?: string; search?: string };
}) {
    const { url } = usePage();
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [editForm, setEditForm] = useState({ alt_text: '', caption: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }

        setUploading(true);
        setUploadError(null);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            console.log('CSRF Token:', csrfToken ? 'present' : 'missing');

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }

            const response = await fetch('/admin/media', {
                method: 'POST',
                body: formData,
                headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
            });

            console.log('Response status:', response.status);
            console.log('Response type:', response.headers.get('content-type'));

            if (response.ok) {
                window.location.reload();
            } else {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setUploadError(
                        data.message ||
                            data.error ||
                            'Upload failed. Please try again.',
                    );
                } else {
                    const text = await response.text();
                    console.log('Response text:', text.substring(0, 500));
                    setUploadError(
                        `Upload failed (HTTP ${response.status}). Please check console.`,
                    );
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(
                'Upload failed. Please check the console for details.',
            );
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleEdit = (item: Media) => {
        setSelectedMedia(item);
        setEditForm({
            alt_text: item.alt_text || '',
            caption: item.caption || '',
        });
        setEditModalOpen(true);
    };

    const handleUpdateMedia = async () => {
        if (!selectedMedia) {
            return;
        }

        try {
            const response = await fetch(`/admin/media/${selectedMedia.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleDelete = async (item: Media) => {
        if (!confirm('Delete this file?')) {
            return;
        }

        try {
            const response = await fetch(`/admin/media/${item.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const typeIcons = {
        image: Image,
        video: Video,
        document: FileText,
    };

    const [copiedId, setCopiedId] = useState<number | null>(null);

    const handleCopyUrl = (item: Media) => {
        const url =
            item.url ||
            (item.path.startsWith('http')
                ? item.path
                : `${window.location.origin}/storage/${item.path}`);
        navigator.clipboard.writeText(url);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AdminLayout title="Media Library">
            <Head title="Media Library - Admin" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Media Library
                    </h1>
                    <p className="text-gray-500">
                        {stats.total} files • {formatBytes(stats.total_size)}{' '}
                        total
                    </p>
                </div>
                <button
                    onClick={() => setUploadModalOpen(true)}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                </button>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <ImageIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Images</p>
                            <p className="text-xl font-bold text-gray-900">
                                {stats.images}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                            <Video className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Videos</p>
                            <p className="text-xl font-bold text-gray-900">
                                {stats.videos}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Documents</p>
                            <p className="text-xl font-bold text-gray-900">
                                {stats.documents}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                            <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Size</p>
                            <p className="text-xl font-bold text-gray-900">
                                {formatBytes(stats.total_size)}
                            </p>
                        </div>
                    </div>
                </div>
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
                                placeholder="Search files..."
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-primary"
                            />
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <select
                        name="type"
                        defaultValue={filters.type}
                        className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Types</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                        <option value="document">Documents</option>
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                    >
                        Filter
                    </button>
                </form>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {media.data.map((item) => {
                    const Icon =
                        typeIcons[item.type as keyof typeof typeIcons] ||
                        FileText;

                    return (
                        <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
                        >
                            <div className="relative aspect-square">
                                {item.type === 'image' ? (
                                    <>
                                        <img
                                            src={item.url}
                                            alt={
                                                item.alt_text ||
                                                item.original_filename
                                            }
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <div className="bg-opacity-0 group-hover:bg-opacity-30 absolute inset-0 bg-black transition-all" />
                                    </>
                                ) : item.type === 'video' ? (
                                    <>
                                        <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                            <Video className="h-12 w-12 text-white opacity-80" />
                                        </div>
                                        <div className="bg-opacity-0 group-hover:bg-opacity-40 absolute inset-0 bg-black transition-all" />
                                    </>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                        <FileText className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}

                                {/* Type badge */}
                                <div className="absolute top-2 left-2">
                                    <span
                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                            item.type === 'image'
                                                ? 'bg-blue-100 text-blue-700'
                                                : item.type === 'video'
                                                  ? 'bg-purple-100 text-purple-700'
                                                  : 'bg-orange-100 text-orange-700'
                                        }`}
                                    >
                                        {item.type}
                                    </span>
                                </div>

                                {/* Actions on hover */}
                                <div className="absolute top-2 right-2 hidden gap-1 group-hover:flex">
                                    <button
                                        onClick={() => handleCopyUrl(item)}
                                        className="rounded bg-white p-1.5 shadow hover:bg-emerald-50"
                                        title="Copy URL"
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="h-4 w-4 text-primary" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-gray-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="rounded bg-white p-1.5 shadow hover:bg-gray-100"
                                    >
                                        <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="rounded bg-white p-1.5 shadow hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="truncate text-xs text-gray-600">
                                    {item.original_filename}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatBytes(item.size)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {media.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex gap-2">
                        {Array.from(
                            { length: media.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <a
                                key={page}
                                href={`/admin/media?page=${page}${filters.type ? `&type=${filters.type}` : ''}${filters.search ? `&search=${filters.search}` : ''}`}
                                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                    media.current_page === page
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </a>
                        ))}
                    </nav>
                </div>
            )}

            {/* Upload Modal */}
            {uploadModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Upload Files
                            </h2>
                            <button
                                onClick={() => setUploadModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {uploadError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                {uploadError}
                            </div>
                        )}

                        <div
                            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                uploading
                                    ? 'cursor-not-allowed bg-gray-100'
                                    : 'border-gray-300 hover:border-primary'
                            }`}
                            onClick={() =>
                                !uploading && fileInputRef.current?.click()
                            }
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,video/*,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="text-gray-500">
                                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <p>Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                    <p className="font-medium text-gray-600">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Images, videos, PDFs (max 100MB each)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && selectedMedia && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                Edit Media
                            </h2>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {selectedMedia.type === 'image' && (
                            <img
                                src={
                                    selectedMedia.path.startsWith('http')
                                        ? selectedMedia.path
                                        : `/storage/${selectedMedia.path}`
                                }
                                alt={
                                    selectedMedia.alt_text ||
                                    selectedMedia.original_filename
                                }
                                className="mb-4 h-48 w-full rounded-lg object-cover"
                            />
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={editForm.alt_text}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            alt_text: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    placeholder="Describe the image..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Caption
                                </label>
                                <textarea
                                    value={editForm.caption}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            caption: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    rows={2}
                                    placeholder="Add a caption..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateMedia}
                                className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
