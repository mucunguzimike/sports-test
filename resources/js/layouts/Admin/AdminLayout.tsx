import { Head, Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    Folder,
    Tag,
    Settings,
    LogOut,
    Menu,
    X,
    Image,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
    title?: string;
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Categories', href: '/admin/categories', icon: Folder },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    title = 'Admin',
    children,
}: AdminLayoutProps) {
    return (
        <div className="min-h-screen">
            <Head title={title} />
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

// SidebarContent and side-effects removed as it's no longer used within this layout.
// AdminLayout now relies on the global AppLayout (via app.tsx) for unified navigation.
