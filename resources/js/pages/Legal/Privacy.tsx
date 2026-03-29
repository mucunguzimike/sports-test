import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import NewsletterFooter from '@/Components/NewsletterFooter';
import { index as blogIndex } from '@/routes/blog';

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy - Score 254" />
            <div className="flex min-h-screen flex-col bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 sm:p-12 dark:bg-gray-900 dark:ring-gray-800 dark:prose-invert">
                        <h1>Privacy Policy</h1>
                        <p className="lead">Last updated: January 1, 2024</p>

                        <h2>Information We Collect</h2>
                        <p>
                            At Score 254, we take your privacy seriously. We
                            collect information you provide directly to us when
                            you create an account, subscribe to our newsletter,
                            leave comments, or communicate with us.
                        </p>
                        <p>
                            This information may include: Name, Email address,
                            IP address, and browser metadata.
                        </p>

                        <h2>How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>
                                Provide, maintain, and improve our services.
                            </li>
                            <li>
                                Send newsletters and promotional materials (only
                                if you opted in).
                            </li>
                            <li>
                                Monitor and analyze trends, usage, and
                                activities.
                            </li>
                            <li>
                                Filter spam comments and safeguard our
                                community.
                            </li>
                        </ul>

                        <h2>Cookies</h2>
                        <p>
                            We use cookies and similar tracking technologies to
                            track activity on our Site and hold certain
                            information. You can instruct your browser to refuse
                            all cookies or to indicate when a cookie is being
                            sent.
                        </p>

                        <h2>Data Retention</h2>
                        <p>
                            We will retain your Personal Data only for as long
                            as is necessary for the purposes set out in this
                            Privacy Policy.
                        </p>
                    </div>
                </main>

                <NewsletterFooter />
            </div>
        </>
    );
}
