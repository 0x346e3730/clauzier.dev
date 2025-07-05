const CACHE_NAME = 'clauzier-dev-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  // Add critical CSS and JS files here when known
];

// Assets to cache on first request
const CACHE_ON_DEMAND = [
  '/blog/',
  '/resume/',
];

// Network-first strategies for these patterns
const NETWORK_FIRST_PATTERNS = [
  /\/rss\.xml$/,
  /\/sitemap.*\.xml$/,
  /\/api\//,
];

// Cache-first strategies for these patterns
const CACHE_FIRST_PATTERNS = [
  /\/_astro\//,
  /\/images\//,
  /\.(?:css|js|woff2|woff|ttf|eot|svg|png|jpg|jpeg|webp|avif|ico)$/,
];

self.addEventListener('install', event => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Install failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Network-first strategy for dynamic content
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first strategy for static assets
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Stale-while-revalidate for HTML pages
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Default to network
  event.respondWith(fetch(event.request));
});

// Cache-first strategy: Check cache first, fallback to network
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first failed:', error);
    
    // Try to return cached version as fallback
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Network-first strategy: Try network first, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network-first failed, trying cache:', error);
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale-while-revalidate: Return cached version immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Get cached version
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('[SW] Background fetch failed:', error);
    });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    // If all fails and it's a navigation request, return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await cache.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Handle background sync for analytics
self.addEventListener('sync', event => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Implement analytics sync logic here if needed
  console.log('[SW] Syncing analytics data');
}

// Handle push notifications (if implemented later)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data.data,
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Cleanup old entries periodically
setInterval(() => {
  caches.open(CACHE_NAME).then(cache => {
    cache.keys().then(requests => {
      // Remove entries older than 30 days
      const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
      requests.forEach(request => {
        cache.match(request).then(response => {
          if (response) {
            const date = new Date(response.headers.get('date'));
            if (date.getTime() < cutoff) {
              cache.delete(request);
            }
          }
        });
      });
    });
  });
}, 24 * 60 * 60 * 1000); // Run daily