<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSiteSettings();

        $user = User::factory()->create([
            'name' => 'Pitch Perfect Editor',
            'email' => 'editor@pitchperfect.com',
            'role' => 'admin',
        ]);

        $categoryData = [
            ['name' => 'Premier League', 'description' => 'English Premier League news and analysis'],
            ['name' => 'Champions League', 'description' => 'UEFA Champions League updates'],
            ['name' => 'La Liga', 'description' => 'Spanish La Liga coverage'],
            ['name' => 'International', 'description' => 'World Cup and International fixtures'],
            ['name' => 'Transfers', 'description' => 'Latest transfer rumors and confirmed deals'],
            ['name' => 'Tactics', 'description' => 'Tactical analysis and formation breakdowns'],
            ['name' => 'Player Profiles', 'description' => 'Deep dives into player careers and stats'],
            ['name' => 'Youth Academies', 'description' => 'Tracking the next generation of wonderkids'],
        ];

        $categories = collect();
        foreach ($categoryData as $cat) {
            $categories->push(Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'description' => $cat['description'],
                'image' => 'https://images.unsplash.com/photo-'.rand(1500000000000, 1507000000000).'?w=800&h=400&fit=crop',
            ]));
        }

        $tagData = ['Match Report', 'Transfer News', 'Tactics', 'EPL', 'UCL', 'Highlights', 'Interviews', 'Opinion', 'Fantasy Football', 'History'];
        $tags = collect();
        foreach ($tagData as $name) {
            $tags->push(Tag::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]));
        }

        $titles = [
            'The Evolution of the False Nine in Modern Soccer',
            'Top 10 Premier League Transfers of the Decade',
            'How High Pressing is Dominating the Champions League',
            'A Tribute to the Greatest Playmakers in History',
            'Analyzing the Title Race: Who Will Come Out on Top?',
            'The Impact of VAR on Key Match Decisions',
            'Rising Stars: 5 Wonderkids to Watch This Season',
            'Tactical Masterclass: Breaking Down the 4-3-3',
            'Exclusive Interview with a Legendary Striker',
            'The Business of Soccer: How Clubs Make Money',
            'Best Stadium Atmospheres Around the World',
            'How to Build a Winning Fantasy Football Squad',
            'The Art of Goalkeeping: More Than Just Saves',
            'Derby Days: The Most Intense Rivalries in Football',
            'Understanding the Offside Rule Updates',
            'Preparing for the Upcoming International Break',
            'The Role of Fullbacks in Today\'s Game',
            'Building a Successful Youth Academy',
            'Iconic World Cup Moments We Will Never Forget',
            'What Makes a Great Football Manager?',
        ];

        $images = [
            'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1200&h=800&fit=crop',
            'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&h=800&fit=crop',
        ];

        $content = '<h2>Introduction</h2>
<p>The modern game of football is constantly evolving, with tactical innovations and athletic demands reaching new heights every season. From the intense pressing systems of the Champions League to the fiercely competitive nature of domestic leagues, understanding the beautiful game requires a keen eye for detail.</p>

<h2>Tactical Analysis</h2>
<p>One of the most significant shifts in recent years has been the changing role of traditional positions. Managers are increasingly demanding versatility from their players, blurring the lines between defense and attack. High-intensity possession and rapid transitions have become the hallmarks of successful teams.</p>

<blockquote>
"Football is a simple game. Twenty-two men chase a ball for 90 minutes and at the end, the Germans always win." - Gary Lineker
</blockquote>

<h2>Key Talking Points</h2>
<ul>
<li>The impact of advanced analytics on recruitment and game preparation</li>
<li>Debates surrounding the implementation and consistency of VAR</li>
<li>The relentless schedule and its effect on player fitness and rotation</li>
<li>Emerging talents from top youth academies making their mark</li>
<li>The tactical flexibility required to break down low blocks</li>
</ul>

<h2>Conclusion</h2>
<p>As the sport continues to grow globally, the passion and drama that make football the world\'s most popular sport remain unchanged. Whether it\'s a dramatic stoppage-time winner or a masterclass in defensive resilience, the beautiful game never fails to captivate its audience.</p>';

        foreach ($titles as $i => $title) {
            $post = Post::create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
                'title' => $title,
                'slug' => Str::slug($title).'-'.($i + 1),
                'excerpt' => 'Discover the nuances of '.strtolower($title).' in this comprehensive analysis for football fans.',
                'content' => $content,
                'featured_image' => $images[$i % count($images)],
                'gallery_images' => array_slice($images, 0, 4),
                'video_url' => $i % 3 === 0 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
                'is_featured' => $i < 3,
                'is_published' => true,
                'published_at' => now()->subDays(rand(1, 180)),
                'views' => rand(50, 5000),
            ]);

            $postTags = $tags->random(rand(2, 5));
            $post->tags()->attach($postTags->pluck('id')->toArray());
        }

        $this->seedSiteSettings();
    }

    private function seedSiteSettings(): void
    {
        $settings = [
            'site_name' => 'Pitch Perfect',
            'site_description' => 'The Beautiful Game - Your source for football news, analysis, and highlights.',
            'featured_video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'show_featured_posts' => '1',
            'show_latest_posts' => '1',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
