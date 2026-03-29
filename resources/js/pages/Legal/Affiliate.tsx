import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import NewsletterFooter from '@/Components/NewsletterFooter';
import { index as blogIndex } from '@/routes/blog';

export default function Affiliate() {
    return (
        <>
            <Head title="Affiliate Disclosure - Score 254" />
            <div className="flex min-h-screen flex-col bg-[#F8F7F4] dark:bg-gray-950">
                <Navbar />

                <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 sm:p-12 dark:bg-gray-900 dark:ring-gray-800 dark:prose-invert">
                        <h1>Affiliate Disclosure</h1>
                        <p className="lead">
                            Transparency is key to the beautiful game.
                        </p>

                        <p>
                            In compliance with the FTC guidelines, please assume
                            the following about links and posts on Pitch
                            Perfect: Any/all of the links on pitchperfect.com
                            may be affiliate links of which we receive a small
                            compensation from sales of certain items.
                        </p>

                        <h2>What are affiliate links?</h2>
                        <p>
                            Purchases are made on external affiliate company
                            websites: When a reader clicks on an affiliate link
                            located on pitchperfect.com to purchase an item, the
                            reader buys the item from the seller directly (not
                            from Score 254).
                        </p>
                        <p>
                            Amazon and/or other companies pay Score 254 a small
                            commission or other compensation for promoting their
                            website or products through their affiliate program.
                        </p>

                        <h2>Prices are exactly the same for you</h2>
                        <p>
                            Your price is exactly the same whether you purchase
                            through an affiliate link or a non-affiliate link.
                            You will not pay more by clicking through the link.
                        </p>

                        <h2>Sponsored Content</h2>
                        <p>
                            If a detailed post is sponsored by a particular
                            sports apparel company or football boot
                            manufacturer, we will disclose this clearly at the
                            beginning of the post.
                        </p>
                    </div>
                </main>

                <NewsletterFooter />
            </div>
        </>
    );
}
