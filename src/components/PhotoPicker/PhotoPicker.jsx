import { useEffect, useRef, useState } from 'react'
import { compressImage } from '@/lib/compressImage'
import { CameraIcon, TrashIcon } from '@/components/icons'
import styles from './PhotoPicker.module.css'

const MAX = 5

/**
 * Вибір фото для оцінки вартості.
 *
 * Кожен знімок стискається прямо в браузері перед відправкою: фото з телефона
 * важить 4–8 МБ, і три таких з мобільного інтернету вантажились би десятки
 * секунд. Після стиснення — 200–400 КБ, а для оцінки стану меблів цього
 * більш ніж досить.
 *
 * @param {File[]} photos
 * @param {(photos: File[]) => void} onChange
 */
export default function PhotoPicker({ photos, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [previews, setPreviews] = useState([])

  // Мініатюри — це посилання на памʼять браузера. Якщо їх не звільняти,
  // при кожній заміні фото витікатиме памʼять.
  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [photos])

  async function add(event) {
    const picked = Array.from(event.target.files ?? [])
    // Той самий файл можна обрати двічі поспіль — без скидання значення
    // браузер не повідомить про повторний вибір.
    event.target.value = ''
    if (!picked.length) return

    const room = MAX - photos.length
    if (room <= 0) return

    setBusy(true)
    const prepared = await Promise.all(picked.slice(0, room).map((file) => compressImage(file)))
    setBusy(false)

    onChange([...photos, ...prepared])
  }

  const remove = (index) => onChange(photos.filter((_, i) => i !== index))

  const full = photos.length >= MAX

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {previews.map((url, index) => (
          <div key={url} className={styles.thumb}>
            <img src={url} alt="" />
            <button
              type="button"
              className={styles.remove}
              onClick={() => remove(index)}
              aria-label={`Прибрати фото ${index + 1}`}
            >
              <TrashIcon size={15} />
            </button>
          </div>
        ))}

        {!full && (
          <button
            type="button"
            className={`${styles.add} ${busy ? styles.addBusy : ''}`}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <CameraIcon size={22} />
            <span>{busy ? 'Готуємо…' : 'Додати'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.input}
        onChange={add}
        tabIndex={-1}
      />

      <p className={styles.hint}>
        {photos.length > 0
          ? `${photos.length} з ${MAX}. Фото стискаються — надсилаються швидко навіть з мобільного.`
          : `До ${MAX} знімків. Зніміть меблі здалеку і зблизька — плями, плетіння тканини.`}
      </p>
    </div>
  )
}
