<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'filename',
    'original_filename',
    'mime_type',
    'extension',
    'size',
    'disk',
    'path',
    'width',
    'height',
    'thumbnail_path',
    'alt_text',
    'caption',
    'type',
    'is_optimized',
    'optimized_size',
])]
class Media extends Model
{
    use HasFactory;

    protected $appends = ['url', 'thumbnail_url'];

    protected function casts(): array
    {
        return [
            'is_optimized' => 'boolean',
            'width' => 'integer',
            'height' => 'integer',
            'size' => 'integer',
            'optimized_size' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/'.$this->path);
    }

    public function getThumbnailUrlAttribute(): string
    {
        return $this->thumbnail_path ? asset('storage/'.$this->thumbnail_path) : $this->url;
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        if ($bytes < 1024) {
            return $bytes.' B';
        }
        if ($bytes < 1048576) {
            return round($bytes / 1024, 1).' KB';
        }

        return round($bytes / 1048576, 1).' MB';
    }

    public function isImage(): bool
    {
        return $this->type === 'image';
    }

    public function isVideo(): bool
    {
        return $this->type === 'video';
    }
}
