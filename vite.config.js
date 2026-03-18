import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { beasties } from 'vite-plugin-beasties';
import { resolve } from 'path';
import sharp from 'sharp';
import { mkdir, readdir, unlink } from 'fs/promises';
import { extname, basename, dirname, join } from 'path';
import { existsSync } from 'fs';

const SUPPORTED = ['.jpg', '.jpeg', '.png'];

const PRESETS = {
    thumbnail: { widths: [160, 320, 480] },
    card:      { widths: [320, 640, 960], ratio: [16, 9] },
    blog:      { widths: [400, 800], ratio: [16, 9] },
    hero:      { widths: [400, 800, 1200], ratio: [16, 9] },
};

const FOLDER_PRESET = {
    category: 'thumbnail',
    blog:     'blog',
	 hero:     'hero',
};

async function processImage(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    const ext = extname(normalized).toLowerCase();
    const name = basename(normalized, ext);
    const outDir = dirname(normalized);

    await mkdir(outDir, { recursive: true });

    const folder = normalized.match(/src\/assets\/images\/([^/]+)\//)?.[1];
    const preset = folder ? PRESETS[FOLDER_PRESET[folder] || 'card'] : null;

    if (preset) {
        const { widths, ratio } = preset;
        if (!existsSync(`${outDir}/${name}-${widths[0]}w.webp`)) {
            for (const w of widths) {
                const resizeOpts = ratio
                    ? { width: w, height: Math.round(w * (ratio[1] / ratio[0])), fit: 'cover' }
                    : { width: w };
                await Promise.all([
                    sharp(normalized).resize(resizeOpts).webp({ quality: 82 }).toFile(`${outDir}/${name}-${w}w.webp`),
                    sharp(normalized).resize(resizeOpts).jpeg({ quality: 85, mozjpeg: true }).toFile(`${outDir}/${name}-${w}w.jpg`),
                ]);
            }
            console.log(`[images] нарезано: ${name} (${widths.map(w => w + 'w').join(' / ')})`);
        }
        await unlink(normalized).catch(() => {});
    } else {
        if (existsSync(`${outDir}/${name}.webp`)) return;
        await sharp(normalized).webp({ quality: 82 }).toFile(`${outDir}/${name}.webp`);
        console.log(`[images] конвертировано: ${name}.webp`);
    }
}

function imageProcessorPlugin() {
    async function scan(dir) {
        if (!existsSync(dir)) return;
        for (const entry of await readdir(dir, { withFileTypes: true })) {
            const fullPath = join(dir, entry.name).replace(/\\/g, '/');
            if (entry.isDirectory()) {
                await scan(fullPath);
            } else if (SUPPORTED.includes(extname(entry.name).toLowerCase()) && !/-\d+w\.(jpg|jpeg|png)$/.test(entry.name)) {
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
                if (/-\d+w\.(jpg|jpeg|png)$/.test(normalized)) return;
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
                main: resolve(__dirname, 'src/index.html'),
                contacts: resolve(__dirname, 'src/pages/contacts.html'),
                blog: resolve(__dirname, 'src/pages/blog.html'),
					 post: resolve(__dirname, 'src/pages/post.html'),
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
