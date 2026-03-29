<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        return Inertia::render('Contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // In a real application, you would log this to DB or Mail here
        // Mail::to('admin@pitchperfect.com')->send(new ContactMessage($validated));

        return back()->with('success', 'Thanks for reaching out! We will get back to you soon.');
    }
}
