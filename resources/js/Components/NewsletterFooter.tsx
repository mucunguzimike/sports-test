import { Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function NewsletterFooter() {
    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
        recentlySuccessful,
    } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => reset('email'),
        });
    };

    return (
        <footer className="mt-12 bg-gray-900 py-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col items-center justify-between gap-8 border-b border-gray-800 pb-8 md:flex-row">
                    <div className="max-w-md text-center md:text-left">
                        <h3 className="text-2xl font-bold">
                            Subscribe to our Newsletter
                        </h3>
                        <p className="mt-2 text-gray-400">
                            Get the latest articles and stories delivered
                            directly to your inbox.
                        </p>
                    </div>
                    <form onSubmit={submit} className="w-full max-w-md">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-primary focus:ring-primary"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-primary px-6 py-2 font-medium whitespace-nowrap text-white transition-colors hover:bg-primary disabled:opacity-50"
                            >
                                Subscribe
                            </button>
                        </div>
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
                        {recentlySuccessful && (
                            <p className="mt-2 text-sm text-primary">
                                Successfully subscribed!
                            </p>
                        )}
                    </form>
                </div>

                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/terms"
                            className="text-xs text-gray-400 transition-colors hover:text-primary"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-xs text-gray-400 transition-colors hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/affiliate"
                            className="text-xs text-gray-400 transition-colors hover:text-primary"
                        >
                            Affiliate Disclosure
                        </Link>
                    </div>
                    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                        <div className="flex items-center gap-2 brightness-200 grayscale">
                            <span className="text-xl">⚽</span>
                            <span className="text-lg font-bold">Score 254</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Score 254. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
