import { SITE_URL } from '../src/config/site.js'

/**
 * Тонкий шар перед статичними файлами сайту.
 *
 * Сам сайт — це готові файли з теки dist, і Cloudflare віддає їх сам.
 * Цей код потрібен для двох речей, які файлами не вирішуються:
 *
 *   1. www.syndicateclean.com → syndicateclean.com (301).
 *      Файл _redirects такого не вміє: він працює зі шляхами, але не з
 *      доменами (перевірено в документації Cloudflare). Без цього та сама
 *      сторінка живе за двома адресами, і посилання на сайт розповзаються
 *      у двох варіантах.
 *
 *   2. Заборона індексації на всіх адресах, крім основної. Сайт доступний
 *      ще й на технічних адресах Cloudflare — у пошуку їм робити нічого.
 *
 * Адреса береться з SITE_URL у config/site.js, тобто з того самого місця,
 * що й canonical. Зміниться домен — цей код підхопить його сам.
 */

const CANONICAL_HOST = new URL(SITE_URL).hostname

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)

      // www → основний домен, зі збереженням шляху й параметрів.
      // Протокол проставляємо явно: редірект не має права відправити
      // людину на http, навіть якщо запит чомусь прийшов без шифрування.
      if (url.hostname === `www.${CANONICAL_HOST}`) {
        url.hostname = CANONICAL_HOST
        url.protocol = 'https:'
        return Response.redirect(url.toString(), 301)
      }

      const response = await env.ASSETS.fetch(request)

      // Будь-яка адреса, крім основної (технічні домени Cloudflare,
      // прев'ю-версії) — закрита від пошукових систем.
      if (url.hostname !== CANONICAL_HOST) {
        const copy = new Response(response.body, response)
        copy.headers.set('X-Robots-Tag', 'noindex')
        return copy
      }

      return response
    } catch {
      // Що б тут не зламалось, сайт має лишитись доступним:
      // віддаємо файли напряму, без жодної обробки.
      return env.ASSETS.fetch(request)
    }
  },
}
