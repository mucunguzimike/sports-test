import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { props } = usePage();
    const settings = (props.settings as any) || {};

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="mb-2 flex items-center justify-center gap-2">
                            {settings.site_logo ? (
                                <img
                                    src={settings.site_logo}
                                    alt={settings.site_name || 'Logo'}
                                    className="h-10 w-auto object-contain"
                                />
                            ) : (
                                <>
                                    <span className="text-4xl">⚽</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {settings.site_name || 'Score 254'}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
