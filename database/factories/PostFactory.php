<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    private static int $titleIndex = 0;

    public function definition(): array
    {
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

        $title = $titles[self::$titleIndex % count($titles)];
        self::$titleIndex++;

        $content = <<<'HTML'
<h2>Introduction</h2>
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
<p>As the sport continues to grow globally, the passion and drama that make football the world's most popular sport remain unchanged. Whether it's a dramatic stoppage-time winner or a masterclass in defensive resilience, the beautiful game never fails to captivate its audience.</p>
HTML;

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

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->uuid(),
            'excerpt' => $this->faker->sentence(20),
            'content' => $content,
            'featured_image' => $this->faker->randomElement($images),
            'gallery_images' => $this->faker->randomElements($images, 4),
            'video_url' => null,
            'is_featured' => $this->faker->boolean(20),
            'is_published' => true,
            'published_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'views' => $this->faker->numberBetween(0, 5000),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
