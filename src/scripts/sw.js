import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

const BASE_URL = 'https://story-api.dicoding.dev'; // base API Anda

precacheAndRoute(self.__WB_MANIFEST);

// Cache Google Fonts dengan CacheFirst
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }), // 1 tahun
    ],
  })
);

// Cache Font Awesome dengan CacheFirst
registerRoute(
  ({ url }) =>
    url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }), // 1 tahun
    ],
  })
);

// Cache UI Avatars dengan CacheFirst + CacheableResponsePlugin
registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 }), // 30 hari
    ],
  })
);

// Cache API JSON dengan NetworkFirst
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }), // 5 menit
    ],
  })
);

// Cache gambar API dengan StaleWhileRevalidate
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'api-images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 hari
    ],
  })
);

// Cache Geocoding API (maptiler) dengan CacheFirst
registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({
    cacheName: 'maptiler-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 hari
    ],
  })
);

// Push notification handler tetap sama
self.addEventListener('push', event => {
  event.waitUntil(
    (async () => {
      const data = event.data ? event.data.json() : {};
      await self.registration.showNotification(data.title || 'Notifikasi', {
        body: data.options?.body || '',
      });
    })()
  );
});
