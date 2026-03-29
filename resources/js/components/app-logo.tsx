import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { props } = usePage();
    const settings = (props.settings as any) || {};

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {settings.site_logo ? (
                    <img
                        src={settings.site_logo}
                        alt={settings.site_name || 'Logo'}
                        className="size-6 object-contain"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {settings.site_name
                        ? settings.site_name.substring(0, 2).toUpperCase()
                        : 'PE'}
                </span>
                <span className="truncate text-xs font-normal text-sidebar-foreground/70">
                    {settings.site_name || 'Score 254'}
                </span>
            </div>
        </>
    );
}
