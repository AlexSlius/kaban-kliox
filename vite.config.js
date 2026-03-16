import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import Critters from 'critters';
import sharp from 'sharp';
import { mkdir, readdir, unlink } from 'fs/promises';
import { extname, basename, dirname, join } from 'path';
import { existsSync } from 'fs';

const SUPPORTED = ['.jpg', '.jpeg', '.png'];

// Пресеты нарезки по типу контента
// ratio: [w, h] — принудительный кроп, без ratio — сохраняет пропорции оригинала
const PRESETS = {
    thumbnail: { widths: [160, 320, 480] },
    card:      { widths: [320, 640, 960], ratio: [16, 9] },
    hero:      { widths: [640, 960, 1280], ratio: [16, 9] },
};

// Маппинг папок → пресет. Неизвестная папка → card (дефолт)
const FOLDER_PRESET = {
    category: 'thumbnail',
    team:     'thumbnail',
    reviews:  'thumbnail',
    hero:     'hero',
    banners:  'hero',
};

// Определяет пресет по пути. null → корень images/ или icons/ → только WebP
function getPreset(normalized) {
    const match = normalized.match(/src\/assets\/images\/([^/]+)\//);
    if (!match) return null;
    const folder = match[1];
    const presetName = FOLDER_PRESET[folder] || 'card';
    return PRESETS[presetName];
}

function isOriginal(filePath) {
    return !/-\d+w\.(jpg|jpeg|png)$/.test(filePath);
}

async function processImage(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    const ext = extname(normalized).toLowerCase();
    const name = basename(normalized, ext);
    const outDir = dirname(normalized);

    await mkdir(outDir, { recursive: true });

    const preset = getPreset(normalized);

    if (preset) {
        const { widths, ratio } = preset;
        if (!existsSync(`${outDir}/${name}-${widths[0]}w.webp`)) {
            for (const w of widths) {
                const resizeOpts = ratio
                    ? { width: w, height: Math.round(w * (ratio[1] / ratio[0])), fit: 'cover' }
                    : { width: w };
                await sharp(normalized).resize(resizeOpts).webp({ quality: 82 }).toFile(`${outDir}/${name}-${w}w.webp`);
                await sharp(normalized).resize(resizeOpts).jpeg({ quality: 85, mozjpeg: true }).toFile(`${outDir}/${name}-${w}w.jpg`);
            }
            console.log(`[images] нарезано: ${name} (${widths.map(w => w + 'w').join(' / ')})`);
        }
        // Удалять оригинал — он не нужен после нарезки
        await unlink(normalized).catch(() => {});
    } else {
        // Корень images/ или icons/ — только конвертация в WebP
        if (existsSync(`${outDir}/${name}.webp`)) return;

        await sharp(normalized).webp({ quality: 82 }).toFile(`${outDir}/${name}.webp`);
        console.log(`[images] конвертировано: ${name}.webp`);
    }
}

async function scanAndProcess(dir) {
    if (!existsSync(dir)) return;
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name).replace(/\\/g, '/');
        if (entry.isDirectory()) {
            await scanAndProcess(fullPath);
        } else if (SUPPORTED.includes(extname(entry.name).toLowerCase()) && isOriginal(entry.name)) {
            await processImage(fullPath);
        }
    }
}

function imageProcessorPlugin() {
    return {
        name: 'image-processor',
        apply: 'serve',
        async configureServer(server) {
            // Обработать существующие файлы при старте
            await scanAndProcess(resolve(__dirname, 'src/assets/images'));
            await scanAndProcess(resolve(__dirname, 'src/assets/icons'));

            // Следить за новыми файлами
            server.watcher.on('add', async (filePath) => {
                const normalized = filePath.replace(/\\/g, '/');
                const ext = extname(normalized).toLowerCase();
                if (!SUPPORTED.includes(ext)) return;
                if (!normalized.includes('src/assets/')) return;
                if (!isOriginal(normalized)) return;
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
            },
        },
    },
    plugins: [
        imageProcessorPlugin(),
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
        }),
        {
            name: 'critters',
            apply: 'build',
            async closeBundle() {
                const c = new Critters({ path: resolve(__dirname, 'dist'), publicPath: '/' });
                for (const file of ['dist/index.html', 'dist/pages/contacts.html']) {
                    const p = resolve(__dirname, file);
                    writeFileSync(p, await c.process(readFileSync(p, 'utf-8')));
                }
            },
        },
    ],
});
