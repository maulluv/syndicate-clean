/**
 * Постобробка збірки: SEO, яке видно пошуковикам і месенджерам.
 *
 * Навіщо це взагалі потрібно.
 * Сайт — SPA: сервер віддає один index.html, а сторінки малює React у браузері.
 * Але робот Google і краулери Telegram/Facebook JavaScript не виконують — вони
 * читають лише той HTML, що прийшов з сервера. Тому мета-тегів, проставлених
 * React-ом, вони НЕ бачать: без цього скрипта всі сторінки виглядали б для них
 * однаково, з одним заголовком.
 *
 * Що робить скрипт (запускається сам після `npm run build`):
 *   1. Для кожного маршруту з SEO кладе окремий dist/<шлях>/index.html
 *      зі своїм <title>, описом, canonical і картинкою прев'ю.
 *      Cloudflare віддає такий файл напряму, замість SPA-фолбека.
 *   2. Додає розмітку LocalBusiness — з неї Google бере телефон,
 *      графік роботи й місто, щоб показати їх прямо у видачі.
 *   3. Генерує sitemap.xml і robots.txt.
 *   4. Вставляє лічильник Google Analytics, якщо він заданий у site.js.
 *
 * Нічого правити тут не треба: усі тексти й адреси живуть у src/config/site.js.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  SITE_URL,
  pageUrl,
  SEO,
  FAQ,
  OG_IMAGE,
  ANALYTICS,
  BRAND,
  CONTACTS,
  SOCIAL,
} from '../src/config/site.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

/** Екранує текст, який іде всередину HTML-атрибута. */
const attr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')


/* ===== Розмітка LocalBusiness =====
   Однакова на всіх сторінках. sameAs — профілі в соцмережах: так Google
   розуміє, що сайт і сторінка в Facebook належать одному бізнесу. */
function businessSchema() {
  const profiles = [SOCIAL.instagram, SOCIAL.telegram, SOCIAL.facebook].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BRAND.name,
    description: BRAND.tagline,
    url: SITE_URL,
    telephone: CONTACTS.phone,
    image: `${SITE_URL}${OG_IMAGE}`,
    priceRange: CONTACTS.priceRange,
    openingHours: CONTACTS.hoursSchema,
    // Адреси-офісу немає: майстер виїжджає до клієнта, тож вказуємо місто
    // й зону обслуговування, а не вулицю.
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACTS.city,
      addressCountry: 'UA',
    },
    areaServed: { '@type': 'City', name: CONTACTS.city },
    ...(profiles.length ? { sameAs: profiles } : {}),
  }
}

/* ===== Розмітка «Часті питання» =====
   Розширеного блоку у видачі з неї вже не буде: Google прибрав FAQ rich
   results у травні 2026-го. Але розмітку далі використовують, щоб зрозуміти
   зміст сторінки, і її читають AI-пошуковики. Коштує це нічого, тож лишаємо.

   Питання без відповіді пропускаємо — так само, як їх пропускає сам блок
   на сайті. Немає жодної відповіді — немає й розмітки. */
function faqSchema() {
  const answered = FAQ.filter((item) => item.answer?.trim())
  if (!answered.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.trim() },
    })),
  }
}

/** Сторінка, на якій живе блок питань (див. src/pages/Services). */
const FAQ_PAGE = '/poslugy'

/**
 * Повний набір тегів <head> для однієї сторінки.
 * indexable: false — для 404. Такій сторінці не можна давати canonical
 * (він вказував би на адресу, якої не існує) і не можна пускати її в
 * пошук: інакше Google почне показувати «Сторінку не знайдено» у видачі.
 */
function headFor(path, meta, { indexable = true } = {}) {
  const url = pageUrl(path)
  const image = `${SITE_URL}${OG_IMAGE}`

  return `<title>${attr(meta.title)}</title>
    <meta name="description" content="${attr(meta.description)}" />
    ${indexable ? `<link rel="canonical" href="${attr(url)}" />` : '<meta name="robots" content="noindex" />'}

    <!-- Прев'ю посилання в Telegram, Facebook, Viber -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${attr(BRAND.name)}" />
    <meta property="og:locale" content="uk_UA" />
    <meta property="og:url" content="${attr(url)}" />
    <meta property="og:title" content="${attr(meta.title)}" />
    <meta property="og:description" content="${attr(meta.description)}" />
    <meta property="og:image" content="${attr(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${attr(BRAND.name)} — ${attr(BRAND.tagline)}" />

    <!-- Прев'ю в X / Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(meta.title)}" />
    <meta name="twitter:description" content="${attr(meta.description)}" />
    <meta name="twitter:image" content="${attr(image)}" />

    <script type="application/ld+json">${JSON.stringify(businessSchema())}</script>${
      path === FAQ_PAGE && faqSchema()
        ? `\n    <script type="application/ld+json">${JSON.stringify(faqSchema())}</script>`
        : ''
    }`
}

/** Сніпет Google Analytics. Порожній рядок, якщо лічильник не налаштований. */
function analyticsFor() {
  const id = ANALYTICS.ga4?.trim()
  if (!id) return ''

  // send_page_view вимкнений навмисно: перехід між сторінками в SPA не
  // перезавантажує вкладку, тож перегляди рахує сам сайт — див.
  // src/hooks/usePageMeta.js. Інакше головна рахувалась би двічі.
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() { dataLayer.push(arguments) }
      gtag('js', new Date())
      gtag('config', '${id}', { send_page_view: false })
    </script>`
}

/* ===== Запобіжник =====
   Кожен маршрут з App.jsx мусить мати запис у SEO. Якщо додати сторінку
   й забути про це, вона піде в продакшн без власного HTML-файлу — і на
   Cloudflare, налаштованому на 404-page, віддаватиме «сторінку не знайдено»
   при прямому переході. Тому звіряємо тут і голосно попереджаємо.

   Роути-редіректи (element={<Navigate ...) і catch-all "*" пропускаємо —
   їм власна сторінка не потрібна. */
async function warnAboutMissingRoutes() {
  const app = await readFile(join(root, 'src/App.jsx'), 'utf8')

  const declared = [...app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<(\w+)/g)]
    .filter(([, path, element]) => path !== '*' && element !== 'Navigate')
    .map(([, path]) => path)

  const missing = declared.filter((path) => !SEO[path])
  if (!missing.length) return

  console.warn(
    `\n⚠️  Ці сторінки є в App.jsx, але їх немає в SEO (src/config/site.js):\n` +
      missing.map((path) => `      ${path}`).join('\n') +
      `\n   Без запису вони не отримають ні заголовка, ні окремого файлу,\n` +
      `   і при прямому переході віддадуть 404. Додай їх у SEO.\n`
  )
}

await warnAboutMissingRoutes()

/* ===== Запис сторінок ===== */

const template = await readFile(join(dist, 'index.html'), 'utf8')

const SEO_BLOCK = /<!--SEO-->[\s\S]*?<!--\/SEO-->/
const ANALYTICS_BLOCK = /<!--ANALYTICS-->/

if (!SEO_BLOCK.test(template)) {
  throw new Error(
    'У dist/index.html немає маркерів <!--SEO--> … <!--/SEO-->. ' +
      'Схоже, їх прибрали з index.html — поверни, інакше сторінки лишаться без мета-тегів.'
  )
}

const analytics = analyticsFor()
const routes = Object.entries(SEO).filter(([key]) => key.startsWith('/'))

for (const [path, meta] of routes) {
  const html = template
    .replace(SEO_BLOCK, headFor(path, meta))
    .replace(ANALYTICS_BLOCK, analytics)

  // Головна лишається в корені, решта — у власній теці: /poslugy/index.html.
  const target = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}

/* Сторінка 404. Cloudflare віддає SPA-фолбек із кодом 200, тож цей файл —
   на випадок, якщо хостинг колись почне шукати саме 404.html. Сам текст
   помилки в будь-якому разі малює React (src/pages/NotFound). */
await writeFile(
  join(dist, '404.html'),
  template
    .replace(SEO_BLOCK, headFor('/404', SEO.notFound, { indexable: false }))
    .replace(ANALYTICS_BLOCK, analytics)
)

/* ===== sitemap.xml ===== */

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ([path]) => `  <url>
    <loc>${pageUrl(path)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

/* ===== robots.txt ===== */

await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
)

console.log(
  `SEO: ${routes.length} сторінок + 404, sitemap.xml, robots.txt` +
    (analytics ? `, аналітика ${ANALYTICS.ga4}` : ', аналітика вимкнена')
)
