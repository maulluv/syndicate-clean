import { SERVICES, CONTACTS } from '../src/config/site.js'

/**
 * Приймає заявку з сайту й пересилає її в Telegram.
 *
 * Чому це на сервері, а не в браузері: щоб надіслати повідомлення, потрібен
 * токен бота. Будь-що, покладене в код сайту, видно кожному відвідувачу через
 * «Переглянути код». З токеном на руках стороння людина писала б від імені
 * бота що завгодно. Тому токен лежить у сховищі Cloudflare, а звертається до
 * Telegram цей код — браузер клієнта токена не бачить ніколи.
 *
 * Приймає два формати:
 *   • JSON — звичайна заявка без фото
 *   • multipart/form-data — заявка з фото (оцінка по фото)
 *
 * Налаштування (npx wrangler secret put ІМʼЯ):
 *   TELEGRAM_BOT_TOKEN — токен від @BotFather
 *   TELEGRAM_CHAT_ID   — куди слати заявки. Для групи це відʼємне число.
 */

const LIMITS = {
  name: 80,
  phone: 32,
  comment: 1000,
  calc: 900,
  photos: 5,
  // Браузер стискає знімки перед відправкою (див. src/lib/compressImage.js),
  // тож реальні файли виходять ~200–400 КБ. Ліміт із великим запасом —
  // на випадок, якщо стиснення не спрацює на якомусь пристрої.
  photoBytes: 6 * 1024 * 1024,
}

/** Заголовок повідомлення залежно від того, звідки прийшла заявка. */
const TITLES = {
  order: 'Нова заявка з сайту',
  photo: 'Оцінка по фото',
  calc: 'Заявка з калькулятора',
}

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

/** Витягує поля із запиту незалежно від того, JSON це чи форма з файлами. */
async function readRequest(request) {
  const type = request.headers.get('Content-Type') ?? ''

  if (type.includes('multipart/form-data')) {
    const form = await request.formData()
    const photos = form
      .getAll('photo')
      .filter((item) => typeof item === 'object' && item.size > 0)

    return {
      fields: Object.fromEntries(
        ['name', 'phone', 'comment', 'service', 'page', 'kind', 'calc', 'website'].map(
          (key) => [key, form.get(key) ?? '']
        )
      ),
      photos,
    }
  }

  return { fields: await request.json(), photos: [] }
}

export async function handleOrder(request, env) {
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method' }, 405)
  }

  let fields
  let photos
  try {
    ;({ fields, photos } = await readRequest(request))
  } catch {
    return json({ ok: false, error: 'format' }, 400)
  }

  // Пастка для ботів: поле, приховане від людей стилями. Людина його не бачить
  // і не заповнить, а автоматичний заповнювач форм — заповнить. Якщо там щось
  // є, вдаємо успіх: спамер не має зрозуміти, що його відсіяли, інакше просто
  // підбере обхід.
  if (fields.website) {
    return json({ ok: true })
  }

  const name = String(fields.name ?? '').trim()
  const phone = String(fields.phone ?? '').trim()
  const comment = String(fields.comment ?? '').trim()
  const service = String(fields.service ?? '').trim()
  const calc = String(fields.calc ?? '').trim().slice(0, LIMITS.calc)
  const page = String(fields.page ?? '').trim().slice(0, 200)
  const kind = TITLES[fields.kind] ? fields.kind : 'order'

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

  if (photos.length > LIMITS.photos) {
    return json({ ok: false, error: 'photos_count' }, 400)
  }

  for (const photo of photos) {
    if (!String(photo.type ?? '').startsWith('image/')) {
      return json({ ok: false, error: 'photos_type' }, 400)
    }
    if (photo.size > LIMITS.photoBytes) {
      return json({ ok: false, error: 'photos_size' }, 400)
    }
  }

  // Послугу приймаємо тільки зі свого ж списку — щоб у повідомлення не можна
  // було підставити довільний текст.
  const known = SERVICES.find((item) => item.id === service)

  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    // Налаштування немає — заявка загубилась би мовчки. Краще чесно сказати
    // людині, що не вийшло, і показати їй телефон, ніж вдати успіх.
    console.error('Не задано TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID')
    return json({ ok: false, error: 'config' }, 500)
  }

  const lines = [`<b>${TITLES[kind]}</b>`, '', `<b>Імʼя:</b> ${escapeHtml(name)}`, `<b>Телефон:</b> ${escapeHtml(phone)}`]

  if (known) lines.push(`<b>Послуга:</b> ${escapeHtml(known.title)}`)
  if (calc) lines.push('', '<b>Розрахунок:</b>', escapeHtml(calc))
  if (comment) lines.push('', `<b>Коментар:</b> ${escapeHtml(comment)}`)
  if (photos.length) lines.push('', `<b>Фото:</b> ${photos.length} — надсилаю наступним повідомленням`)
  if (page) lines.push('', `<i>Сторінка: ${escapeHtml(page)}</i>`)

  const api = (method) => `https://api.telegram.org/bot${token}/${method}`

  try {
    // Спершу текст окремим повідомленням. Підпис під фото в Telegram обмежений
    // 1024 символами, і довгий розрахунок із коментарем туди міг би не влізти.
    // Окремий текст цього обмеження не має.
    const sent = await fetch(api('sendMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
    })

    if (!sent.ok) {
      console.error('Telegram відмовив на тексті:', sent.status, await sent.text())
      return json({ ok: false, error: 'telegram' }, 502)
    }

    // Фото — окремо. Якщо тут щось піде не так, заявка вже дійшла: у тексті
    // написано, скільки фото очікувалось, тож власник побачить нестачу і
    // зможе перепитати. Втратити контакт через невдале фото — гірше.
    if (photos.length) {
      const ok = await sendPhotos(api, chatId, photos)
      if (!ok) {
        return json({ ok: true, photosFailed: true })
      }
    }

    return json({ ok: true })
  } catch (error) {
    console.error('Не вдалось достукатись до Telegram:', error)
    return json({ ok: false, error: 'network' }, 502)
  }
}

/**
 * Надсилає знімки. Одне фото Telegram приймає лише через sendPhoto,
 * два й більше — через sendMediaGroup, і вони приходять одним альбомом.
 */
async function sendPhotos(api, chatId, photos) {
  try {
    if (photos.length === 1) {
      const form = new FormData()
      form.append('chat_id', chatId)
      form.append('photo', photos[0], photos[0].name || 'photo.jpg')

      const response = await fetch(api('sendPhoto'), { method: 'POST', body: form })
      if (!response.ok) console.error('sendPhoto:', response.status, await response.text())
      return response.ok
    }

    const form = new FormData()
    form.append('chat_id', chatId)
    // Файли додаються окремими полями, а в описі альбому на них посилаються
    // через attach:// — так вимагає Telegram.
    form.append(
      'media',
      JSON.stringify(photos.map((_, index) => ({ type: 'photo', media: `attach://photo${index}` })))
    )
    photos.forEach((photo, index) => {
      form.append(`photo${index}`, photo, photo.name || `photo${index}.jpg`)
    })

    const response = await fetch(api('sendMediaGroup'), { method: 'POST', body: form })
    if (!response.ok) console.error('sendMediaGroup:', response.status, await response.text())
    return response.ok
  } catch (error) {
    console.error('Не вдалось надіслати фото:', error)
    return false
  }
}

/** Телефон для повідомлення «не вдалось — зателефонуйте». */
export const FALLBACK_PHONE = CONTACTS.phoneDisplay
