import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import NewsletterFooter from '@/Components/NewsletterFooter';
import { index as blogIndex } from '@/routes/blog';

export default function Terms() {
    return (
        <>
            <Head title="Terms of Service - Score 254" />
            <div className="flex min-h-screen flex-col bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 sm:p-12 dark:bg-gray-900 dark:ring-gray-800 dark:prose-invert">
                        <h1>Terms of Service</h1>
                        <p className="lead">Last updated: January 1, 2024</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Score 254, you accept and
                            agree to be bound by the terms and provision of this
                            agreement. In addition, when using these particular
                            services, you shall be subject to any posted
                            guidelines or rules applicable to such services.
                        </p>

                        <h2>2. Description of Service</h2>
                        <p>
                            Score 254 provides users with access to
                            football/soccer news, analysis, tactial deep-dives,
                            and community discussion boards (the "Service").
                        </p>

                        <h2>3. User Conduct</h2>
                        <p>
                            When posting comments on Score 254, you agree to not
                            use the Service to:
                        </p>
                        <ul>
                            <li>
                                Upload, post, email or otherwise transmit any
                                Content that is unlawful, harmful, threatening,
                                abusive, harassing, defaming, vulgar, obscene,
                                or libelous.
                            </li>
                            <li>Impersonate any person or entity.</li>
                            <li>
                                Forge headers or otherwise manipulate
                                identifiers in order to disguise the origin of
                                any Content.
                            </li>
                        </ul>

                        <h2>4. Intellectual Property</h2>
                        <p>
                            All content on Score 254, including but not limited
                            to articles, images, logos, and digital downloads,
                            is the property of Score 254 or its content
                            suppliers and protected by international copyright
                            laws.
                        </p>
                    </div>
                </main>

                <NewsletterFooter />
            </div>
        </>
    );
}
