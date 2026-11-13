import { TOOLS } from '@/lib/tools';

// Service worker (PWA offline), gerado no build a partir de lib/tools.ts.
// - Páginas: rede primeiro; sem rede, a última cópia salva (ou /ferramentas).
// - /_next/static: cache primeiro (arquivos com hash, nunca mudam).
// - Ferramentas pré-carregadas na instalação: abrem offline desde a primeira visita.
export const dynamic = 'force-static';

const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now())).slice(0, 12);

const PRECACHE = ['/', '/ferramentas', ...TOOLS.map((t) => `/ferramentas/${t.slug}`), '/manifest.webmanifest'];

const SCRIPT = `
const VERSION = ${JSON.stringify(VERSION)};
const PAGES = 'cp-pages-' + VERSION;
const ASSETS = 'cp-assets-' + VERSION;
const PRECACHE = ${JSON.stringify(PRECACHE)};
const MAX_PAGES = 60;
const MAX_ASSETS = 150;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGES)
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('cp-') && k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(name, max) {
  const c = await caches.open(name);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icone/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(ASSETS).then((c) => c.put(req, copy)).then(() => trim(ASSETS, MAX_ASSETS));
        }
        return res;
      }))
    );
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(url.pathname, copy)).then(() => trim(PAGES, MAX_PAGES));
        }
        return res;
      }).catch(async () => {
        const c = await caches.open(PAGES);
        return (await c.match(url.pathname)) || (await c.match('/ferramentas')) || Response.error();
      })
    );
  }
});
`;

export function GET() {
  return new Response(SCRIPT.trimStart(), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
