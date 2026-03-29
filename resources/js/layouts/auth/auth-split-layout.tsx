import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { props } = usePage();
    const settings = (props.settings as any) || {};
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-lg font-medium"
                >
                    {settings.site_logo ? (
                        <img
                            src={settings.site_logo}
                            alt={settings.site_name || 'Logo'}
                            className="h-10 w-auto object-contain brightness-0 invert"
                        />
                    ) : (
                        <>
                            <span className="text-3xl">⚽</span>
                            <span className="text-2xl font-bold text-white">
                                {settings.site_name || 'Score 254'}
                            </span>
                        </>
                    )}
                </Link>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <div className="flex items-center gap-2">
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
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
