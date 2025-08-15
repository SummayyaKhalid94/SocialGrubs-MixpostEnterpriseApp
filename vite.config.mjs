import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';
import fs from 'fs';
import path from 'path';
import { homedir } from 'os';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    let serverConfig = {};

    // Optional SSL for dev
    if (mode === 'development') {
        const isSSLEnabled =
            env.ENABLE_SSL === 'true' ||
            (env.ENABLE_SSL !== 'false' && env.APP_URL?.startsWith('https://'));

        if (isSSLEnabled) {
            const host = new URL(env.APP_URL).host;
            const keyPath = path.resolve(homedir(), env.CERTIFICATES_KEY_PATH || '');
            const crtPath = path.resolve(homedir(), env.CERTIFICATES_CRT_PATH || '');

            if (fs.existsSync(keyPath) && fs.existsSync(crtPath)) {
                serverConfig = {
                    https: {
                        key: fs.readFileSync(keyPath),
                        cert: fs.readFileSync(crtPath),
                    },
                    hmr: { host },
                    host,
                };
            } else {
                console.error('[vite] SSL is enabled but cert files not found.');
            }
        }
    }

    return {
        plugins: [
            laravel({
                input: [
                    'resources/css/app.css',
                    'resources/js/app.js',

                    'resources/js/mixpost-pro-team/app.js',
                    'resources/css/mixpost-pro-team/app.css',

                    'resources/js/mixpost-enterprise/app.js',
                    'resources/css/mixpost-enterprise/app.css',
                ],
                refresh: true,
                buildDirectory: 'build',
            }),
            vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            }),
            tailwindcss(),
            DefineOptions(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/js'),
                '@css': path.resolve(__dirname, 'resources/css'),

                '@p': path.resolve(__dirname, 'resources/js/mixpost-pro-team'),
                '@pcss': path.resolve(__dirname, 'resources/css/mixpost-pro-team'),
                '@pimg': path.resolve(__dirname, 'resources/img/mixpost-pro-team'),

                '@e': path.resolve(__dirname, 'resources/js/mixpost-enterprise'),
                '@ecss': path.resolve(__dirname, 'resources/css/mixpost-enterprise'),
                '@eimg': path.resolve(__dirname, 'resources/img/mixpost-enterprise'),
            },
        },
        // build: {
        //     outDir: 'public/build',
        //     emptyOutDir: true,
        //     manifest: true,
        //     rollupOptions: {
        //         input: [
        //             'resources/css/app.css',
        //             'resources/js/app.js',
        //             'resources/js/mixpost-pro-team/app.js',
        //             'resources/css/mixpost-pro-team/app.css',
        //         ],
        //     },
        // },
        server: serverConfig,
    };
});
