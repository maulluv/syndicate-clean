import Container from '@/components/Container'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { ArrowRightIcon } from '@/components/icons'
import styles from './Home.module.css'

export default function Home() {
  const openOrder = useOrderModal()

  return (
    <section className={styles.hero}>
      {/* ===== Фон ===== */}
      {/* Місце під відео. Коли буде готовий файл — розкоментуй <video> нижче
          і поклади ролик у /public (напр. public/hero.mp4). */}
      <div className={styles.bg} aria-hidden="true">
        {/*
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        */}
        <div className={styles.overlay} />
      </div>

      {/* ===== Контент ===== */}
      <Container className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>Меблевий клінінг преміум-класу</p>

        <h1 className={styles.title}>
          <span className={styles.titleScript}>Досконала</span>
          <span className={styles.titleBlock}>ЧИСТОТА</span>
        </h1>

        <p className={styles.subtitle}>
          Професійне чищення диванів, крісел, матраців та стільців. Повертаємо
          меблям свіжість, колір і затишок — делікатно й глибоко.
        </p>

        <div className={styles.actions}>
          <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
            Замовити чистку
          </Button>
          <Button to="/poslugy" size="lg" variant="outline">
            Наші послуги
          </Button>
        </div>
      </Container>

      {/* Індикатор скролу */}
      <div className={styles.scroll} aria-hidden="true">
        <span>гортайте</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}
