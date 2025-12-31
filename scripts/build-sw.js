import { injectManifest } from 'workbox-build';
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function buildServiceWorker() {
  // First, bundle the TypeScript service worker with esbuild
  await build({
    entryPoints: [join(rootDir, 'src/sw.ts')],
    bundle: true,
    outfile: join(rootDir, 'dist/sw-temp.js'),
    format: 'iife',
    target: 'es2020',
    minify: true,
    sourcemap: false,
  });

  // Then inject the Workbox manifest
  await injectManifest({
    swSrc: join(rootDir, 'dist/sw-temp.js'),
    swDest: join(rootDir, 'dist/sw.js'),
    globDirectory: join(rootDir, 'dist'),
    globPatterns: [
      '**/*.{html,js,css,woff,woff2,png,jpg,jpeg,webp,avif,svg,json}',
    ],
    globIgnores: [
      '**/node_modules/**/*',
      'sw.js',
      'sw-temp.js',
      'workbox-*.js',
      '**/stats.html',
    ],
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
  });

  // Clean up temp file
  await import('fs/promises').then(fs => fs.unlink(join(rootDir, 'dist/sw-temp.js')).catch(() => {}));
}

buildServiceWorker().catch(error => {
  process.exit(1);
});
