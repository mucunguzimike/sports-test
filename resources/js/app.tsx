import { createInertiaApp } from '@inertiajs/react';
import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

if (csrfToken) {
    const originalFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
        const [resource, config] = args;
        let url = '';
        if (typeof resource === 'string') {
            url = resource;
        } else if (resource instanceof URL) {
            url = resource.href;
        } else if (
            resource &&
            typeof resource === 'object' &&
            'url' in resource
        ) {
            url = (resource as Request).url;
        }

        if (url && (url.startsWith('/admin/') || url.startsWith('/api/'))) {
            const headers = new Headers(config?.headers);
            headers.set('X-CSRF-TOKEN', csrfToken);
            return originalFetch(resource, {
                ...config,
                headers,
            });
        }
        return originalFetch(...args);
    };
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

interface ErrorBoundaryProps {
    children: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: '2rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        fontFamily: 'monospace',
                        minHeight: '100vh',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                        }}
                    >
                        🔥 React Render Crash 🔥
                    </h1>
                    <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                        {this.state.error?.toString()}
                    </p>
                    <pre
                        style={{
                            overflow: 'auto',
                            backgroundColor: '#fef2f2',
                            padding: '1rem',
                            border: '1px solid #f87171',
                        }}
                    >
                        {this.state.error?.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'Contact':
            case name.startsWith('Legal/'):
            case name.startsWith('Blog/'):
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <ErrorBoundary>
                <TooltipProvider delayDuration={0}>{app}</TooltipProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
