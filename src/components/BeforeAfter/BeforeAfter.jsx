import { useRef, useState } from 'react'
import styles from './BeforeAfter.module.css'

/**
 * Порівняння «до / після»: два знімки один поверх одного, межу між ними
 * людина тягне сама.
 *
 * Керується двома незалежними способами, і це навмисно:
 *
 *   1. Перетягування — на pointer-подіях. Вони однакові для пальця, миші
 *      й стилуса, тож код один на всі пристрої.
 *   2. Клавіатура й читалки екрана — на прихованому <input type="range">.
 *      Він лишився, бо дає стрілки, Home/End і озвучення «повзунок, 50%»
 *      безкоштовно; але вказівник до нього більше не доходить
 *      (pointer-events: none у CSS), щоб два обробники не сперечались.
 *
 * Раніше перетягування теж висіло на цьому <input>, і в Safari на iPhone
 * повзунок не працював зовсім. Причина в різниці реалізацій: Chrome
 * переставляє бігунок туди, куди ти клікнув по доріжці, а WebKit — ні,
 * там треба вхопитися саме за бігунок. А бігунок був заданий як
 * height: 100%, і відсоткову висоту в ::-webkit-slider-thumb WebKit не
 * рахує — виходила нульова висота, хапати не було за що. Тобто на
 * половині телефонів країни доказ роботи просто не рухався.
 *
 * @param {string} before - знімок до чистки
 * @param {string} after - знімок після
 * @param {string} alt - опис для тих, хто не бачить зображення
 */
export default function BeforeAfter({ before, after, alt = '' }) {
  const [position, setPosition] = useState(50)
  const wrapRef = useRef(null)

  /** Переводить координату пальця чи курсора у відсоток ширини кадру. */
  const moveTo = (clientX) => {
    const box = wrapRef.current?.getBoundingClientRect()
    if (!box || !box.width) return
    const pct = ((clientX - box.left) / box.width) * 100
    setPosition(Math.round(Math.min(100, Math.max(0, pct))))
  }

  const dragging = useRef(false)

  const onPointerDown = (event) => {
    dragging.current = true
    moveTo(event.clientX)

    /* Захоплення вказівника — покращення, а не умова: з ним рухи приходять
       сюди, навіть коли палець виїхав за межі знімка, і межа не
       «відчіплюється» на краю. Але воно вміє кидати виняток (наприклад,
       якщо вказівник уже не активний), а виняток тут обірвав би все
       тягнення. Тому в try, і порядок такий: спершу рухаємо межу, потім
       намагаємось захопити. Навіть якщо захоплення не вдалось, тягнення
       в межах кадру працює. */
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* Тягнення працюватиме й без захоплення — просто до краю кадру. */
    }
  }

  const onPointerMove = (event) => {
    if (dragging.current) moveTo(event.clientX)
  }

  const onPointerEnd = (event) => {
    dragging.current = false
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      /* Нема чого відпускати — то й нема проблеми. */
    }
  }

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      style={{ '--pos': `${position}%` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      /* Палець пішов на вертикальний скрол — браузер забирає жест собі й
         шле pointercancel. Відпускаємо захоплення, інакше сторінка
         перестала б гортатися після першого дотику до знімка. */
      onPointerCancel={onPointerEnd}
    >
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
