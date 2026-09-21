/**
 * Стискає фото перед відправкою.
 *
 * Навіщо: знімок із сучасного телефона важить 4–8 МБ. Надіслати три такі
 * з мобільного інтернету — це десятки секунд очікування, за які людина
 * встигне закрити вкладку. Після стиснення один знімок важить 200–400 КБ,
 * і для оцінки стану меблів цієї якості більш ніж достатньо.
 *
 * Працює повністю в браузері: зображення малюється на canvas у меншому
 * розмірі й перезберігається в JPEG. На сервер іде вже легкий файл.
 *
 * Якщо щось піде не так (екзотичний формат, брак памʼяті) — повертаємо
 * оригінал. Краще повільна відправка, ніж втрачена заявка.
 *
 * @param {File} file
 * @param {{ maxSide?: number, quality?: number }} [options]
 * @returns {Promise<File>}
 */
export async function compressImage(file, { maxSide = 1600, quality = 0.82 } = {}) {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))

    // Знімок і так невеликий — чіпати не варто, перезбереження лише
    // погіршило б якість без виграшу в розмірі.
    if (scale === 1 && file.size < 700 * 1024) {
      bitmap.close?.()
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    )
    if (!blob || blob.size >= file.size) return file

    const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${name}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
