const CACHE = 'pet-bonbazaar-v2.2.0'
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.svg', './icon-512.svg']

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll(CORE).catch(() => {})
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith((async () => {
    const cached = await caches.match(event.request)
    try {
      const response = await fetch(event.request)
      if (response && (response.ok || response.type === 'opaque')) {
        const cache = await caches.open(CACHE)
        event.waitUntil(cache.put(event.request, response.clone()).catch(() => {}))
      }
      return response
    } catch {
      if (cached) return cached
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('./index.html')
        if (fallback) return fallback
      }
      return new Response('Pet BonBazaar is offline en dit onderdeel staat nog niet in de cache.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
    }
  })())
})
