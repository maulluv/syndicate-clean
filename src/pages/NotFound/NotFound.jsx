import Container from '@/components/Container'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { NAV_LINKS } from '@/config/site'
import { ArrowRightIcon } from '@/components/icons'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

/**
 * Сторінка 404 — будь-яка адреса, якої на сайті немає.
 * Раніше такий шлях давав порожнечу: хедер і футер від layout, а між ними
 * нічого. Тепер людина бачить пояснення й куди йти далі.
 */
export default function NotFound() {
  const openOrder = useOrderModal()

  return (
    <section className={styles.page}>
      <Container className={styles.inner}>
        <p className={`eyebrow ${styles.eyebrow}`}>Помилка 404</p>
        <p className={styles.code} aria-hidden="true">
          404
        </p>

        <h1 className={styles.title}>Такої сторінки немає</h1>
        <p className={styles.lead}>
          Можливо, адресу введено з помилкою або сторінку прибрали.
          Ось куди можна перейти:
        </p>

        <nav className={styles.links} aria-label="Розділи сайту">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.link}>
              {link.label}
              <ArrowRightIcon size={16} />
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
            Замовити чистку
          </Button>
          <Button to="/" size="lg" variant="outline">
            На головну
          </Button>
        </div>
      </Container>
    </section>
  )
}
