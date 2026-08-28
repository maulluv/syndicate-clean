/**
 * Сторінка «Відгуки» — ТИМЧАСОВО ПРИХОВАНА на прохання власника (2026-08-17).
 * Плануємо повернути й перероблити на реальних фото «до / після».
 *
 * Компонент зараз НІДЕ не підключений: у App.jsx адреса /vidguky веде
 * редіректом на головну. Раніше вона віддавала порожню сторінку — хедер
 * і футер від layout, а між ними нічого; для відвідувача це виглядало як
 * поламаний сайт, а Google рахував це «тонкою» сторінкою.
 *
 * ЩОБ ПОВЕРНУТИ:
 *   1. Розкоментувати імпорти й тіло компонента нижче, прибрати порожній <section>.
 *   2. У config/site.js розкоментувати рядок «Відгуки» у NAV_LINKS.
 *   3. У App.jsx замінити редірект назад на <Route path="/vidguky" element={<Reviews />} />.
 *   4. У config/site.js додати в SEO запис для '/vidguky' — інакше сторінка
 *      піде в індекс із заголовком від 404.
 * Дані (REVIEWS), ReviewCard і ReviewModal лишились на місці й не чіпались.
 */

// import { useState } from 'react'
// import Container from '@/components/Container'
// import ReviewCard from '@/components/ReviewCard'
// import ReviewModal from '@/components/ReviewModal'
// import { REVIEWS } from '@/config/site'
import styles from './Reviews.module.css'

export default function Reviews() {
  return <section className={styles.page} />
}

/* ===== Робоча версія сторінки — увімкнути, коли повертатимемо =====

export default function Reviews() {
  const [active, setActive] = useState(null)

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Нам довіряють</p>
          <h1 className={styles.title}>Відгуки</h1>
          <p className={styles.lead}>
            Реальні результати нашої роботи. Натисніть на картку, щоб побачити
            повне порівняння «до / після».
          </p>
        </header>

        <div className={styles.grid}>
          {REVIEWS.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onOpen={() => setActive(review)}
            />
          ))}
        </div>
      </Container>

      <ReviewModal review={active} onClose={() => setActive(null)} />
    </section>
  )
}

===== кінець робочої версії ===== */
