<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory
{
    public function definition(): array
    {
        $tags = [
            'Match Report',
            'Transfer News',
            'Tactics',
            'EPL',
            'UCL',
            'Highlights',
            'Interviews',
            'Opinion',
            'Fantasy Football',
            'History',
        ];

        $name = $this->faker->unique()->randomElement($tags);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->uuid(),
        ];
    }
}
