import SofaShot from '@/components/SofaShot'
import styles from './ReviewCard.module.css'

/**
 * ReviewCard — картка відгуку.
 * Верх поділений навпіл: зліва «до», справа «після» (чорна риска посередині).
 * Клік відкриває модалку зі слайдером (onOpen).
 *
 * @param {{author, role, text, tone}} review
 * @param {() => void} onOpen
 */
export default function ReviewCard({ review, onOpen }) {
  return (
    <button className={styles.card} onClick={onOpen} aria-label={`Відгук: ${review.author}`}>
      <div className={styles.media}>
        <div className={styles.half}>
          <SofaShot state="before" tone={review.tone} />
          <span className={styles.tag}>До</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.half}>
          <SofaShot state="after" tone={review.tone} />
          <span className={`${styles.tag} ${styles.tagAfter}`}>Після</span>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.text}>«{review.text}»</p>
        <div className={styles.author}>
          <span className={styles.name}>{review.author}</span>
          {review.role && <span className={styles.role}>{review.role}</span>}
        </div>
        <span className={styles.more}>Дивитися до / після →</span>
      </div>
    </button>
  )
}
