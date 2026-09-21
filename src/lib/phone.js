/**
 * Форматування українського номера телефону під час набору.
 *
 * Мета — не «маска», яка бореться з людиною, а підказка. Людина може почати
 * з 0, з 380, з +380 або одразу з коду оператора — усі варіанти зводяться
 * до одного вигляду:
 *
 *   067…      → +380 (67) …
 *   067…      → +380 (67) …
 *   380671…   → +380 (67) 1…
 *   +380671…  → +380 (67) 1…
 *
 * Стирання працює як завжди: віддаляється цифра, а не символ розмітки —
 * інакше після Backspace курсор упирався б у дужку й нічого не відбувалось.
 */

const PREFIX = '380'

/** Лишає з рядка тільки національний номер: 9 цифр після 380. */
export function phoneDigits(value) {
  let digits = String(value ?? '').replace(/\D/g, '')

  if (digits.startsWith(PREFIX)) {
    digits = digits.slice(PREFIX.length)
  } else if (digits.startsWith('0')) {
    // 067… — звичний спосіб запису всередині країни
    digits = digits.slice(1)
  }

  return digits.slice(0, 9)
}

/**
 * Збирає номер у вигляд +380 (67) 123-45-67, показуючи лише ту частину
 * розмітки, до якої людина вже дійшла. Дужка не зʼявляється, поки немає
 * коду оператора, — інакше поле виглядало б заповненим ще до введення.
 */
export function formatPhone(value) {
  const digits = phoneDigits(value)
  if (!digits) return ''

  const code = digits.slice(0, 2)
  const a = digits.slice(2, 5)
  const b = digits.slice(5, 7)
  const c = digits.slice(7, 9)

  let result = `+${PREFIX} (${code}`
  if (digits.length > 2) result += `) ${a}`
  if (digits.length > 5) result += `-${b}`
  if (digits.length > 7) result += `-${c}`

  return result
}

/** Номер заповнений повністю (9 цифр після коду країни). */
export const isPhoneComplete = (value) => phoneDigits(value).length === 9

/** Те, що йде на сервер і в Telegram: +380671234567 */
export const phoneForSending = (value) => {
  const digits = phoneDigits(value)
  return digits ? `+${PREFIX}${digits}` : ''
}

/**
 * Наступне значення поля з урахуванням того, вводить людина чи стирає.
 *
 * Навіщо окрема функція. Українці зазвичай починають набирати з нуля: «067…».
 * Але нуль — це внутрішньокраїнний префікс, який ми відкидаємо, тож після
 * першої цифри показувати ще нічого. Порожнє поле у відповідь на натиснуту
 * клавішу виглядає як поламане, тому показуємо початок «+380 (».
 *
 * І тут виникає пастка: якщо на це саме значення відповідати завжди, номер
 * стає неможливо стерти — Backspace прибирає дужку, а функція повертає її
 * назад. Тому дивимось, у який бік іде зміна: коротшає рядок — даємо стерти
 * до кінця, довшає — підставляємо префікс.
 *
 * @param {string} raw - те, що зараз у полі
 * @param {string} previous - те, що було до цієї зміни
 */
export function nextPhoneValue(raw, previous) {
  const digits = phoneDigits(raw)
  if (digits) return formatPhone(raw)

  const deleting = String(raw).length < String(previous ?? '').length
  if (deleting) return ''

  // Людина щось набрала, але національного номера ще немає — це або «0»,
  // або початок коду країни. Показуємо, звідки продовжувати.
  return /\d/.test(raw) ? `+${PREFIX} (` : ''
}
