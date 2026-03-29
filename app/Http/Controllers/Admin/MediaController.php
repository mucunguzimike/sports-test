<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('original_filename', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        $media = $query->latest()->paginate(24);

        $stats = [
            'total' => Media::count(),
            'images' => Media::where('type', 'image')->count(),
            'videos' => Media::where('type', 'video')->count(),
            'documents' => Media::where('type', 'document')->count(),
            'total_size' => Media::sum('size'),
        ];

        return inertia('Admin/Media/Index', [
            'media' => $media,
            'stats' => $stats,
            'filters' => $request->only(['type', 'search']),
        ]);
    }

    public function list(Request $request)
    {
        $query = Media::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('original_filename', 'like', "%{$search}%")
                    ->orWhere('alt_text', 'like', "%{$search}%")
                    ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 24);
        $media = $query->latest()->paginate($perPage);

        return response()->json([
            'media' => $media,
        ]);
    }

    public function store(Request $request)
    {
        $files = $request->file('files');

        if (! $files || ! is_array($files)) {
            return response()->json(['error' => 'No files uploaded'], 422);
        }

        $request->validate([
            'files.*' => 'file|max:102400|mimes:jpg,jpeg,png,gif,webp,svg,mp4,mov,avi,webm,pdf,doc,docx',
        ]);

        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $filename = Str::uuid()->toString();
            $extension = strtolower($file->getClientOriginalExtension());
            $originalFilename = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();

            $type = $this->determineType($mimeType, $extension);

            // Skip image optimization for now to avoid memory issues
            // Store original file directly
            $path = $file->storeAs('media', $filename.'.'.$extension, 'public');
            $size = $file->getSize();

            $data = [
                'user_id' => $request->user()->id,
                'filename' => $filename,
                'original_filename' => $originalFilename,
                'mime_type' => $mimeType,
                'extension' => $extension,
                'size' => $size,
                'disk' => 'public',
                'path' => $path,
                'type' => $type,
            ];

            $media = Media::create($data);
            $uploaded[] = $media;
        }

        return response()->json([
            'message' => count($uploaded).' file(s) uploaded successfully',
            'media' => $uploaded,
        ]);
    }

    public function update(Request $request, Media $media)
    {
        $validated = $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:500',
        ]);

        $media->update($validated);

        return response()->json(['message' => 'Media updated successfully', 'media' => $media]);
    }

    public function destroy(Media $media)
    {
        Storage::disk('public')->delete($media->path);
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }

    private function determineType(string $mimeType, string $extension): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }
        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        return 'document';
    }
}
