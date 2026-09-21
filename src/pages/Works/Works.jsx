import { useState } from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import BeforeAfter from '@/components/BeforeAfter'
import { useOrderModal } from '@/context/OrderModalContext'
import { WORKS, REVIEW_SHOTS } from '@/config/site'
import { ArrowRightIcon } from '@/components/icons'
import styles from './Works.module.css'

/**
 * «Наші роботи» — фото до/після з реальних виїздів і скріншоти подяк.
 *
 * Сторінка існує лише коли є що показувати: маршрут реєструється в App.jsx
 * за тією ж умовою, що вмикає пункт меню. Тому тут не треба перевіряти
 * порожні дані — просто не буває випадку, коли обидва списки порожні.
 *
 * Кожен блок усередині показуємо окремо: може бути лише «до/після» без
 * скріншотів, або навпаки.
 */
export default function Works() {
  const [shot, setShot] = useState(null)
  const openOrder = useOrderModal()

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Результат, який видно</p>
          <h1 className={styles.title}>Наші роботи</h1>
          <p className={styles.lead}>
            Знімки з реальних виїздів — до і після чистки. Потягніть межу,
            щоб порівняти.
          </p>
        </header>

        {WORKS.length > 0 && (
          <div className={styles.grid}>
            {WORKS.map((work) => (
              <figure key={work.id} className={styles.work}>
                <BeforeAfter before={work.before} after={work.after} alt={work.title} />
                <figcaption className={styles.caption}>
                  <h2 className={styles.workTitle}>{work.title}</h2>
                  {work.note && <p className={styles.workNote}>{work.note}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {REVIEW_SHOTS.length > 0 && (
          <div className={styles.shots}>
            <header className={styles.shotsHead}>
              <p className="eyebrow">Що пишуть клієнти</p>
              <h2 className={styles.shotsTitle}>Подяки з переписок</h2>
            </header>

            <div className={styles.shotsGrid}>
              {REVIEW_SHOTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.shot}
                  onClick={() => setShot(item)}
                  aria-label="Відкрити більше"
                >
                  <img src={item.src} alt={item.alt ?? ''} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.cta}>
          <p className={styles.ctaText}>Хочете такий самий результат?</p>
          <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
            Замовити чистку
          </Button>
        </div>
      </Container>

      {/* Скріншот на весь екран: у сітці текст переписки нечитабельний */}
      <Modal isOpen={!!shot} onClose={() => setShot(null)} size="lg">
        {shot && <img className={styles.shotFull} src={shot.src} alt={shot.alt ?? ''} />}
      </Modal>
    </section>
  )
}
