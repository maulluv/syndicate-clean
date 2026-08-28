import { SERVICES, CONTACTS } from '../src/config/site.js'

/**
 * Приймає заявку з форми на сайті й пересилає її в Telegram.
 *
 * Чому це на сервері, а не в браузері: щоб надіслати повідомлення, потрібен
 * токен бота. Будь-що, покладене в код сайту, видно кожному відвідувачу через
 * «Переглянути код». З токеном на руках стороння людина писала б від імені
 * бота що завгодно. Тому токен лежить у сховищі Cloudflare, а звертається до
 * Telegram цей код — браузер клієнта токена не бачить ніколи.
 *
 * Налаштування (npx wrangler secret put ІМʼЯ):
 *   TELEGRAM_BOT_TOKEN — токен від @BotFather
 *   TELEGRAM_CHAT_ID   — куди слати заявки. Для групи це відʼємне число.
 */

/* Межі полів. Головна мета — не пропустити в Telegram простирадло тексту
   від спам-бота. Довжини з запасом під реальні відповіді. */
const LIMITS = {
  name: 80,
  phone: 32,
  comment: 1000,
}

/** Екранує текст для розмітки HTML у повідомленні Telegram. */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })

export async function handleOrder(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method' }, 405)
  }

  let data
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'format' }, 400)
  }

  // Пастка для ботів: поле, приховане від людей стилями. Людина його не бачить
  // і не заповнить, а автоматичний заповнювач форм — заповнить. Якщо там щось
  // є, вдаємо успіх: спамер не має зрозуміти, що його відсіяли, інакше просто
  // підбере обхід.
  if (data.website) {
    return json({ ok: true })
  }

  const name = String(data.name ?? '').trim()
  const phone = String(data.phone ?? '').trim()
  const comment = String(data.comment ?? '').trim()
  const service = String(data.service ?? '').trim()
  const page = String(data.page ?? '').trim().slice(0, 200)

  if (name.length < 2 || name.length > LIMITS.name) {
    return json({ ok: false, error: 'name' }, 400)
  }

  // У номері має бути щонайменше 9 цифр — під український мобільний із кодом
  // або без нього. Формат навмисно не звіряємо посимвольно: людина може
  // написати з пробілами, дужками чи через +38, і всі варіанти правильні.
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 9 || phone.length > LIMITS.phone) {
    return json({ ok: false, error: 'phone' }, 400)
  }

  if (comment.length > LIMITS.comment) {
    return json({ ok: false, error: 'comment' }, 400)
  }

  // Послугу приймаємо тільки зі свого ж списку — щоб у повідомлення не можна
  // було підставити довільний текст.
  const known = SERVICES.find((item) => item.id === service)
  const serviceTitle = known ? known.title : 'Не вказано'

  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    // Налаштування немає — заявка загубилась би мовчки. Краще чесно сказати
    // людині, що не вийшло, і показати їй телефон, ніж вдати успіх.
    console.error('Не задано TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID')
    return json({ ok: false, error: 'config' }, 500)
  }

  const lines = [
    '<b>Нова заявка з сайту</b>',
    '',
    `<b>Імʼя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Послуга:</b> ${escapeHtml(serviceTitle)}`,
  ]

  if (comment) {
    lines.push(`<b>Коментар:</b> ${escapeHtml(comment)}`)
  }

  if (page) {
    lines.push('', `<i>Сторінка: ${escapeHtml(page)}</i>`)
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        // Прибирає прев'ю, якщо в коментарі раптом буде посилання
        link_preview_options: { is_disabled: true },
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('Telegram відмовив:', response.status, details)
      return json({ ok: false, error: 'telegram' }, 502)
    }

    return json({ ok: true })
  } catch (error) {
    console.error('Не вдалось достукатись до Telegram:', error)
    return json({ ok: false, error: 'network' }, 502)
  }
}

/** Телефон для повідомлення «не вдалось — зателефонуйте». */
export const FALLBACK_PHONE = CONTACTS.phoneDisplay
