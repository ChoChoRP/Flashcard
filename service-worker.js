const CACHE_NAME = "cho-flashcard-cache-v1";
// Daftar file inti yang harus di-cache
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/sesi/sesi.html",
  "/js/app.js",
  "/img/left.svg",
  "/img/right.svg",
  "/img/acak.svg",
  "/img/silang.svg",
  "/img/ceklis.svg",
  "/img/icons/icon-192.png",
  "/img/icons/icon-512.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
  // Font files (if any)
];

// Menambahkan semua 24 file data Anda ke cache secara dinamis
for (let i = 1; i <= 24; i++) {
  urlsToCache.push(`/js/data_${i}.js`);
}

// 1. Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error("Failed to cache URLs during install:", err);
      })
  );
});

// 2. Fetch/Intercept Network Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Not in cache - fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((err) => {
          console.error(
            "Fetch failed; returning offline page or similar:",
            err
          );
          // Anda bisa return halaman offline kustom di sini jika mau
        });
    })
  );
});

// 3. Activate - Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
