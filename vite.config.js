import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { beasties } from 'vite-plugin-beasties';
import { resolve } from 'path';
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { extname, basename, dirname, join } from 'path';
import { existsSync } from 'fs';

const SUPPORTED = ['.jpg', '.jpeg', '.png'];

async function processImage(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    const ext = extname(normalized).toLowerCase();
    const name = basename(normalized, ext);
    const outDir = dirname(normalized);
    const outPath = `${outDir}/${name}.webp`;

    if (existsSync(outPath)) return;
    await sharp(normalized).webp({ quality: 82 }).toFile(outPath);
    console.log(`[images] конвертовано: ${name}.webp`);
}

function imageProcessorPlugin() {
    async function scan(dir) {
        if (!existsSync(dir)) return;
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const fullPath = join(dir, entry.name).replace(/\\/g, '/');
            if (entry.isDirectory()) {
                await scan(fullPath);
            } else if (SUPPORTED.includes(extname(entry.name).toLowerCase())) {
                await processImage(fullPath);
            }
        }
    }

    return {
        name: 'image-processor',
        apply: 'serve',
        async configureServer(server) {
            await scan(resolve(__dirname, 'src/assets/images'));

            server.watcher.on('add', async (filePath) => {
                const normalized = filePath.replace(/\\/g, '/');
                if (!SUPPORTED.includes(extname(normalized).toLowerCase())) return;
                if (!normalized.includes('src/assets/images')) return;
                await processImage(filePath);
            });
        },
    };
}

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main:      resolve(__dirname, 'src/index.html'),
                contacts:  resolve(__dirname, 'src/pages/contacts.html'),
                blog:      resolve(__dirname, 'src/pages/blog.html'),
                post:      resolve(__dirname, 'src/pages/post.html'),
                favourite: resolve(__dirname, 'src/pages/favourite.html'),
                lk1:       resolve(__dirname, 'src/pages/lk-1.html'),
                lk2:       resolve(__dirname, 'src/pages/lk-2.html'),
                lk3:       resolve(__dirname, 'src/pages/lk-3.html'),
                login1:    resolve(__dirname, 'src/pages/login-1.html'),
                login2:    resolve(__dirname, 'src/pages/login-2.html'),
                login3:    resolve(__dirname, 'src/pages/login-3.html'),
                thanks:    resolve(__dirname, 'src/pages/thanks.html'),
            },
        },
    },
    plugins: [
        imageProcessorPlugin(),
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
        }),
        beasties({
            options: {
                preload: 'swap',
                noscriptFallback: true,
                pruneSource: false,
            },
        }),
    ],
});
