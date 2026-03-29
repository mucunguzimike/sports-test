<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $names = [
            'Premier League',
            'Champions League',
            'La Liga',
            'International',
            'Transfers',
            'Tactics',
            'Player Profiles',
            'Youth Academies',
        ];

        $name = $this->faker->unique()->randomElement($names);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->uuid(),
            'description' => $this->faker->sentence(),
            'image' => 'https://images.unsplash.com/photo-'.$this->faker->numberBetween(1500000000000, 1507000000000).'?w=800&h=400&fit=crop',
        ];
    }
}
