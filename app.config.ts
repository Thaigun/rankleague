import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    server: {
        preset: 'bun',
    },
    tsr: {
        semicolons: true,
        quoteStyle: 'single',
    },
    vite: {
        plugins: [
            tsConfigPaths({
                projects: ['./tsconfig.json'],
            }),
        ],
    },
});
