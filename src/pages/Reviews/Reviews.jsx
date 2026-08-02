import { useState } from 'react'
import Container from '@/components/Container'
import ReviewCard from '@/components/ReviewCard'
import ReviewModal from '@/components/ReviewModal'
import { REVIEWS } from '@/config/site'
import styles from './Reviews.module.css'

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
