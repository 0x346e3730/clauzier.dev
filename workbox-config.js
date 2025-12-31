module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,woff,woff2,png,jpg,jpeg,webp,avif,svg,json}'
  ],
  swDest: 'dist/sw.js',
  swSrc: 'src/sw.ts',
  mode: 'production',

  // Ignore patterns
  globIgnores: [
    '**/node_modules/**/*',
    'sw.js',
    'workbox-*.js',
    '**/stats.html'
  ],

  // Maximum file size to precache (2MB)
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,

  // Don't include these in precache
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.filter(entry => {
        // Don't precache HTML pages (we'll use NetworkFirst for those)
        return !entry.url.endsWith('.html');
      });
      return { manifest };
    }
  ]
};
