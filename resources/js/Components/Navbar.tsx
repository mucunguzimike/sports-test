import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { index as blogIndex, category as blogCategory } from '@/routes/blog';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Navbar() {
    const { url, props } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const categories = (props.categories as Category[]) || [];
    const settings = (props.settings as any) || {};

    return (
        <header
            className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
                isOpen
                    ? 'border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900'
                    : 'border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href={blogIndex()}
                        className="flex items-center gap-2"
                    >
                        {settings.site_logo ? (
                            <img
                                src={settings.site_logo}
                                alt={settings.site_name || 'Score 254'}
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <>
                                <span className="text-2xl">⚽</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    {settings.site_name || 'Score 254'}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {categories.slice(0, 4).map((cat) => (
                            <Link
                                key={cat.id}
                                href={blogCategory(cat.slug)}
                                className={`text-sm font-medium transition-colors ${
                                    url === `/category/${cat.slug}`
                                        ? 'text-primary'
                                        : 'text-gray-600 hover:text-primary dark:text-gray-300'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className={`text-sm font-medium transition-colors ${
                                url === '/contact'
                                    ? 'text-primary'
                                    : 'text-gray-600 hover:text-primary dark:text-gray-300'
                            }`}
                        >
                            Contact
                        </Link>

                        <div className="ml-4 border-l pl-4 dark:border-gray-800">
                            <AppearanceToggleTab />
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <div className="fixed inset-0 top-16 z-40 animate-in border-t border-gray-100 bg-white shadow-2xl duration-200 fade-in slide-in-from-top-4 md:hidden dark:border-gray-800 dark:bg-gray-900">
                    <nav className="flex flex-col space-y-4 p-6">
                        <div className="mb-4 border-b pb-4 dark:border-gray-800">
                            <AppearanceToggleTab className="w-full justify-between" />
                        </div>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={blogCategory(cat.slug)}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-medium transition-colors ${
                                    url === `/category/${cat.slug}`
                                        ? 'border-l-4 border-primary pl-4 text-primary'
                                        : 'pl-4 text-gray-600 hover:text-primary dark:text-gray-300'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className={`text-lg font-medium transition-colors ${
                                url === '/contact'
                                    ? 'border-l-4 border-primary pl-4 text-primary'
                                    : 'pl-4 text-gray-600 hover:text-primary dark:text-gray-300'
                            }`}
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
