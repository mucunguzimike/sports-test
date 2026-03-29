<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscription::firstOrCreate(['email' => $validated['email']]);

        return back()->with('success', 'Thank you for subscribing to our newsletter!');
    }
}
