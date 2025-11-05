import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        port: 3000,
        strictPort: true,
    },
    plugins: [
        tsConfigPaths(),
        tailwindcss(),
        tanstackStart({
            router: {
                semicolons: true,
                quoteStyle: 'single',
            },
        }),
        viteReact(),
    ],
});
