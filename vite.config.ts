import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
    server: {
        port: 3000,
        strictPort: true,
    },
    plugins: [
        tsConfigPaths(),
        tailwindcss(),
        tanstackStart({
            tsr: {
                semicolons: true,
                quoteStyle: 'single',
            },
            target: 'bun',
        }),
    ],
});
