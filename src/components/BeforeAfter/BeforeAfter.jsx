import { useState } from 'react'
import styles from './BeforeAfter.module.css'

/**
 * Порівняння «до / після»: два знімки один поверх одного, межу між ними
 * людина тягне сама.
 *
 * Керується прихованим повзунком (input type=range), а не власною обробкою
 * перетягування. Це не хитрість заради економії коду: так безкоштовно
 * працюють і палець, і миша, і клавіатура зі стрілками, і читалки екрана.
 * Власна реалізація на подіях миші зазвичай губить усе, крім миші.
 *
 * @param {string} before - знімок до чистки
 * @param {string} after - знімок після
 * @param {string} alt - опис для тих, хто не бачить зображення
 */
export default function BeforeAfter({ before, after, alt = '' }) {
  const [position, setPosition] = useState(50)

  return (
    <div className={styles.wrap} style={{ '--pos': `${position}%` }}>
      {/* Нижній шар — «після»: саме він лишається, коли межу відводять убік */}
      <img className={styles.image} src={after} alt={alt ? `${alt} — після чистки` : ''} loading="lazy" />

      {/* Верхній шар — «до», обрізаний по межі */}
      <div className={styles.beforeLayer}>
        <img className={styles.image} src={before} alt={alt ? `${alt} — до чистки` : ''} loading="lazy" />
      </div>

      <span className={`${styles.badge} ${styles.badgeBefore}`}>До</span>
      <span className={`${styles.badge} ${styles.badgeAfter}`}>Після</span>

      <div className={styles.divider} aria-hidden="true">
        <span className={styles.handle} />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className={styles.range}
        aria-label={`Порівняння до і після${alt ? `: ${alt}` : ''}`}
      />
    </div>
  )
}
