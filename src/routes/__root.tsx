/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import css from '@src/styles/app.css?url';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Ranklig - Gain bragging rights',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: css,
            },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <RootDocument>
                <Outlet />
            </RootDocument>
            <TanStackRouterDevtools />
        </>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                <div className='mx-auto w-full px-5 md:max-w-3/4'>{children}</div>
                <Scripts />
            </body>
        </html>
    );
}
