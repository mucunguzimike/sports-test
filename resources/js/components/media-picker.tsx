import { useState, useEffect, useRef } from 'react';
import {
    X,
    Upload,
    Search,
    Image,
    Video,
    FileText,
    Check,
    Copy,
} from 'lucide-react';

interface Media {
    id: number;
    filename: string;
    original_filename: string;
    path: string;
    url: string;
    type: string;
    mime_type: string;
    size: number;
    alt_text: string | null;
}

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    value: string;
    onChange: (url: string) => void;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

export function MediaPicker({
    open,
    onClose,
    onSelect,
    value,
    onChange,
}: MediaPickerProps) {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open, search]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            params.set('per_page', '24');

            const response = await fetch(
                `/admin/media/list?${params.toString()}`,
            );
            const data = await response.json();
            setMedia(data.media.data);
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setLoading(false);
        }
    };

    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadError(null);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
        }

        try {
            const response = await fetch('/admin/media', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
            });

            const data = await response.json();

            if (response.ok) {
                if (data.media && data.media.length > 0) {
                    const newUrl = `/storage/${data.media[0].path}`;
                    onChange(newUrl);
                    onSelect(newUrl);
                }
                fetchMedia();
            } else {
                setUploadError(data.error || data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSelect = (item: Media) => {
        const url = item.url;
        setSelectedId(item.id);
        onChange(url);
        onSelect(url);
    };

    if (!open) return null;

    const typeIcons: Record<string, React.ElementType> = {
        image: Image,
        video: Video,
        document: FileText,
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="h-[80vh] w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-gray-900">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Select Media
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search and Upload */}
                    <div className="flex gap-4 border-b px-6 py-3 dark:border-gray-700">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search media..."
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary disabled:opacity-50"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />
                    </div>

                    {uploadError && (
                        <div className="mx-6 mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            {uploadError}
                        </div>
                    )}

                    {/* Media Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : media.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-500">
                                <Image className="mb-3 h-12 w-12" />
                                <p>No media found</p>
                                <p className="text-sm">
                                    Upload some files to get started
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
                                {media.map((item) => {
                                    const Icon =
                                        typeIcons[item.type] || FileText;
                                    const url = item.path.startsWith('http')
                                        ? item.path
                                        : `/storage/${item.path}`;
                                    const isSelected = value === url;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:shadow-lg ${
                                                isSelected
                                                    ? 'border-primary ring-2 ring-primary'
                                                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="aspect-square">
                                                {item.type === 'image' ? (
                                                    <img
                                                        src={url}
                                                        alt={
                                                            item.original_filename
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                        <Icon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                                    <div className="rounded-full bg-primary p-1">
                                                        <Check className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute right-0 bottom-0 left-0 bg-black/60 p-1">
                                                <p className="truncate text-xs text-white">
                                                    {formatBytes(item.size)}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t px-6 py-4 dark:border-gray-700">
                        <div className="text-sm text-gray-500">
                            {value ? (
                                <div className="flex items-center gap-2">
                                    <span>Selected:</span>
                                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                                        {value}
                                    </code>
                                </div>
                            ) : (
                                'No media selected'
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                disabled={!value}
                                className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary disabled:opacity-50"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
