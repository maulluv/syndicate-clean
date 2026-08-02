import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import SofaShot from '@/components/SofaShot'
import { useOrderModal } from '@/context/OrderModalContext'
import { ArrowRightIcon } from '@/components/icons'
import styles from './ReviewModal.module.css'

/**
 * ReviewModal — слайдер «До → Після» з підписами + заклик і кнопка замовлення.
 *
 * @param {object|null} review
 * @param {() => void} onClose
 */
export default function ReviewModal({ review, onClose }) {
  const [slide, setSlide] = useState(0) // 0 = До, 1 = Після
  const openOrder = useOrderModal()

  // Завжди починаємо з «До»
  useEffect(() => {
    if (review) setSlide(0)
  }, [review])

  const slides = [
    { state: 'before', label: 'До', note: 'Забруднення, плями та потертості' },
    { state: 'after', label: 'Після', note: 'Свіжий колір і бездоганна чистота' },
  ]
  const current = slides[slide]

  return (
    <Modal isOpen={!!review} onClose={onClose} size="lg">
      {review && (
        <div className={styles.wrap}>
          {/* Слайдер */}
          <div className={styles.slider}>
            <div className={styles.stage} data-state={current.state}>
              <SofaShot state={current.state} tone={review.tone} />
              <span className={`${styles.badge} ${slide === 1 ? styles.badgeAfter : ''}`}>
                {current.label}
              </span>
            </div>

            <button
              className={`${styles.nav} ${styles.prev}`}
              onClick={() => setSlide((s) => (s === 0 ? 1 : 0))}
              aria-label="Попередній"
            >
              ‹
            </button>
            <button
              className={`${styles.nav} ${styles.next}`}
              onClick={() => setSlide((s) => (s === 1 ? 0 : 1))}
              aria-label="Наступний"
            >
              ›
            </button>

            <div className={styles.dots}>
              {slides.map((s, i) => (
                <button
                  key={s.state}
                  className={`${styles.dot} ${slide === i ? styles.dotActive : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={s.label}
                />
              ))}
            </div>
          </div>

          <p className={styles.note}>{current.note}</p>

          {/* Відгук */}
          <p className={styles.text}>«{review.text}»</p>
          <div className={styles.author}>
            <span className={styles.name}>{review.author}</span>
            {review.role && <span className={styles.role}>{review.role}</span>}
          </div>

          {/* Заклик */}
          <div className={styles.cta}>
            <p className={styles.ctaText}>Хочеш так само? Замовляй 👇</p>
            <Button iconRight={<ArrowRightIcon />} onClick={openOrder}>
              Замовити
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
