import { useEffect, useRef, useState } from 'react'
import styles from './ProcessVideo.module.css'

/**
 * Короткий ролик процесу: без звуку, зациклений, сам вмикається, коли
 * потрапляє на екран.
 *
 * Чому без звуку. По-перше, браузери взагалі не дозволяють автовідтворення
 * зі звуком — ролик просто не запустився б. По-друге, музика з TikTok
 * ліцензована для TikTok, і переносити її на комерційний сайт не можна.
 * Тож це радше «жива картинка», ніж відео, яке треба дивитись.
 *
 * Чому не вантажимо одразу. Пʼять роликів по кілька мегабайтів — це
 * десятки мегабайтів мобільного трафіку на людину, яка, можливо, лише
 * гортає сторінку. Тому спершу показуємо перший кадр, а сам файл
 * підвантажуємо, коли ролик доходить до екрана.
 *
 * @param {string} src - шлях до mp4
 * @param {string} [poster] - перший кадр
 * @param {string} [alt] - опис для тих, хто не бачить зображення
 */
export default function ProcessVideo({ src, poster, alt = '' }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Якщо людина попросила менше руху — не запускаємо самі. Лишається
    // перший кадр і звичайні елементи керування.
    const stillness = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (stillness?.matches) return

    // На випадок середовищ без IntersectionObserver — вмикаємо одразу.
    // Краще зайвий трафік, ніж сторінка з нерухомих картинок.
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          node.play?.().catch(() => {})
        } else {
          node.pause?.()
        }
      },
      // Беремо з запасом: ролик встигає підвантажитись до появи на екрані
      { rootMargin: '200px', threshold: 0.25 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={styles.video}
      poster={poster}
      // Обовʼязкові для автовідтворення на телефоні: без muted браузер
      // заблокує, без playsInline iOS відкриє на весь екран.
      muted
      loop
      playsInline
      preload={active ? 'auto' : 'none'}
      src={active ? src : undefined}
      aria-label={alt}
    />
  )
}
