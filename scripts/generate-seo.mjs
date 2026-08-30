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
  PROCESS,
  HAS_WORKS,
  WORKS_PATH,
  OG_IMAGE,
  ANALYTICS,
  VERIFICATION,
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

/** Сторінка, на якій живе блок питань (див. src/pages/Home). */
const FAQ_PAGE = '/'

/**
 * Повний набір тегів <head> для однієї сторінки.
 * indexable: false — для 404. Такій сторінці не можна давати canonical
 * (він вказував би на адресу, якої не існує) і не можна пускати її в
 * пошук: інакше Google почне показувати «Сторінку не знайдено» у видачі.
 */
function headFor(path, meta, { indexable = true } = {}) {
  // Сторінка може бути позначена noindex у самому записі SEO — так
  // тимчасові сторінки з заглушками можна показати людині, але не пустити
  // в пошук. Прибираєте noindex у config/site.js — сторінка йде в індекс.
  if (meta.noindex) indexable = false

  const url = pageUrl(path)
  const image = `${SITE_URL}${OG_IMAGE}`

  // Підтвердження прав у Search Console. Ставимо на всіх сторінках, а не
  // лише на головній: Google перевіряє тег періодично, і зайвим він не буде.
  //
  // Тегів може бути кілька — коли сайт підтверджують з різних акаунтів.
  // Приймаємо і рядок, і масив, щоб не переписувати конфіг заради одного.
  const tokens = [VERIFICATION.google ?? []]
    .flat()
    .map((token) => String(token).trim())
    .filter(Boolean)

  const verification = tokens
    .map((token) => `<meta name="google-site-verification" content="${attr(token)}" />\n    `)
    .join('')

  return `${verification}<title>${attr(meta.title)}</title>
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

/**
 * Лічильники відвідувань. Порожній рядок у налаштуваннях = скрипт не
 * потрапляє на сайт узагалі, а не просто мовчить.
 */
function analyticsFor() {
  const parts = []

  const cf = ANALYTICS.cloudflare?.trim()
  if (cf) {
    // defer, щоб лічильник не затримував показ сторінки: він потрібен для
    // статистики, а не для роботи сайту.
    parts.push(
      `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" ` +
        `data-cf-beacon='{"token": "${cf}"}'></script>`
    )
  }

  const ga = ANALYTICS.ga4?.trim()
  if (ga) {
    // send_page_view вимкнений навмисно: перехід між сторінками в SPA не
    // перезавантажує вкладку, тож перегляди рахує сам сайт — див.
    // src/hooks/usePageMeta.js. Інакше головна рахувалась би двічі.
    parts.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${ga}"></script>
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() { dataLayer.push(arguments) }
      gtag('js', new Date())
      gtag('config', '${ga}', { send_page_view: false })
    </script>`)
  }

  return parts.join('\n    ')
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

/* Чернетки у відповідях FAQ. Їх писав розробник як заглушку, поки власник
   не дав справжні. Опублікувати таке — це пообіцяти клієнту те, чого ніхто
   не підтверджував, тож попереджаємо голосно при кожній збірці. */
function warnAboutDraftFaq() {
  const drafts = FAQ.filter((item) => item.draft && item.answer?.trim())
  if (!drafts.length) return

  console.warn(
    `\n⚠️  У блоці «Часті питання» ${drafts.length} відповідей — ЧЕРНЕТКИ:\n` +
      drafts.map((item) => `      ${item.q}`).join('\n') +
      `\n   Це заглушки, а не слова власника. Замініть текст у src/config/site.js\n` +
      `   і приберіть у позиції прапорець draft.\n`
  )
}

warnAboutDraftFaq()

/* Те саме для кроків процесу: це опис реальної роботи, і вгадати його
   неможливо. Попереджаємо, поки текст не підтвердив власник. */
function warnAboutDraftProcess() {
  const drafts = PROCESS.filter((step) => step.draft)
  if (!drafts.length) return

  console.warn(
    `\n⚠️  У блоці «Як ми працюємо» ${drafts.length} кроків — ЧЕРНЕТКИ:\n` +
      drafts.map((step) => `      ${step.title}`).join('\n') +
      `\n   Це опис процесу, написаний навмання. Замініть на реальний у\n` +
      `   src/config/site.js і приберіть прапорець draft.\n`
  )
}

warnAboutDraftProcess()

/* Питання без відповіді. Це не помилка — вони навмисно не показуються,
   поки власник не відповів. Але легко забути, що вони взагалі є, тож
   нагадуємо при кожній збірці. */
function noteUnansweredFaq() {
  const waiting = FAQ.filter((item) => !item.answer?.trim())
  if (!waiting.length) return

  console.log(
    `\nℹ️  ${waiting.length} питань чекають на відповідь власника (на сайті не показуються):\n` +
      waiting.map((item) => `      ${item.q}`).join('\n') +
      '\n'
  )
}

noteUnansweredFaq()

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

/* У sitemap подаємо лише те, що справді має бути в пошуку. Закриту
   сторінку туди класти не можна: це прямо суперечливий сигнал —
   «проіндексуй» у карті сайту й «не індексуй» на самій сторінці. */
const indexableRoutes = routes.filter(([, meta]) => !meta.noindex)

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
${indexableRoutes
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

/* ===== _redirects =====
   Редіректи на рівні сервера. Генеруються, а не лежать файлом у public,
   бо залежать від стану сайту: поки сторінки «Наші роботи» немає, стара
   адреса веде на головну, а щойно зʼявиться — на неї.

   Це має бути саме тут. Cloudflare застосовує ці правила ДО того, як
   завантажиться сайт, тож редірект усередині React у цьому випадку ніколи
   б не спрацював — сервер відповів би раніше. */
await writeFile(
  join(dist, '_redirects'),
  `# Цей файл генерується збіркою — правити треба scripts/generate-seo.mjs.
#
# Навіщо редірект на рівні сервера, а не в React: браузер отримує відповідь
# одразу, ще до завантаження сайту, а Google бачить чесний 301 «сторінка
# переїхала» і переносить її вагу на нову адресу. Редірект усередині React
# для пошуковика виглядав би як 404.

# Стара сторінка «Відгуки» замінена на «Наші роботи».
/vidguky  ${HAS_WORKS ? WORKS_PATH : '/'}  301
`
)

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
    (analytics
      ? `, аналітика: ${[ANALYTICS.cloudflare && 'Cloudflare', ANALYTICS.ga4 && 'GA4'].filter(Boolean).join(' + ')}`
      : ', аналітика вимкнена') +
    ([VERIFICATION.google ?? []].flat().filter(Boolean).length
      ? `, Search Console: ${[VERIFICATION.google].flat().filter(Boolean).length} підтвердження`
      : '') +
    (HAS_WORKS ? ', сторінка робіт увімкнена' : '')
)
