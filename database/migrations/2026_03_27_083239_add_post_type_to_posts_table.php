<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->enum('post_type', ['standard', 'video', 'gallery'])->default('standard')->after('views');
            $table->string('video_thumbnail')->nullable()->after('video_url');
            $table->boolean('show_video_in_preview')->default(false)->after('video_thumbnail');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['post_type', 'video_thumbnail', 'show_video_in_preview']);
        });
    }
};
