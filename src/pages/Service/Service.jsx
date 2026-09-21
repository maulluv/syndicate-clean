import { Link, Navigate, useParams } from 'react-router-dom'
import Container from '@/components/Container'
import Button from '@/components/Button'
import ServicePhoto from '@/components/ServicePhoto'
import { useOrderModal } from '@/context/OrderModalContext'
import { SERVICES, CONTACTS, servicePath, servicePrices } from '@/config/site'
import { ArrowRightIcon, CheckIcon, PhoneIcon } from '@/components/icons'
import styles from './Service.module.css'

/**
 * Сторінка однієї послуги: /poslugy/chyshchennya-dyvaniv тощо.
 *
 * Навіщо окремо, а не картка в спільному списку: одна сторінка про всі
 * послуги змушена конкурувати сама з собою за різні запити. Тут заголовок,
 * текст і ціни стосуються рівно одного — і пошуковик це бачить.
 *
 * Кнопка замовлення одразу підставляє цю послугу у форму: людина щойно
 * читала про чистку матраців, вдруге обирати її в списку — зайвий крок.
 */
export default function Service() {
  const { slug } = useParams()
  const openOrder = useOrderModal()

  const service = SERVICES.find((item) => item.slug === slug)

  // Неіснуюча послуга — не показуємо порожнечу, ведемо до списку
  if (!service) return <Navigate to="/poslugy" replace />

  const prices = servicePrices(service)
  const others = SERVICES.filter((item) => item.slug && item.id !== service.id)

  return (
    <article className={styles.page}>
      <Container>
        <nav className={styles.crumbs} aria-label="Навігація">
          <Link to="/">Головна</Link>
          <span aria-hidden="true">/</span>
          <Link to="/poslugy">Послуги</Link>
          <span aria-hidden="true">/</span>
          <span className={styles.crumbCurrent}>{service.title}</span>
        </nav>

        <div className={styles.top}>
          <div className={styles.intro}>
            <h1 className={styles.title}>{service.h1}</h1>
            <p className={styles.lead}>{service.lead}</p>

            <div className={styles.actions}>
              <Button
                size="lg"
                iconRight={<ArrowRightIcon />}
                onClick={() => openOrder({ service: service.id })}
              >
                Замовити
              </Button>
              <Button href={`tel:${CONTACTS.phone}`} size="lg" variant="outline">
                {CONTACTS.phoneDisplay}
              </Button>
            </div>
          </div>

          <div className={styles.media}>
            <ServicePhoto service={service} className={styles.photo} loading="eager" />
          </div>
        </div>

        <div className={styles.body}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Що входить</h2>
            <ul className={styles.includes}>
              {service.includes.map((item) => (
                <li key={item} className={styles.include}>
                  <span className={styles.includeIcon}>
                    <CheckIcon size={17} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {prices.length > 0 && (
            <section className={styles.block}>
              <h2 className={styles.blockTitle}>Ціни</h2>
              <ul className={styles.prices}>
                {prices.map((row) => (
                  <li key={row.label} className={styles.priceRow}>
                    <span>{row.label}</span>
                    <span className={styles.priceDots} aria-hidden="true" />
                    <span className={styles.priceValue}>{row.price}</span>
                  </li>
                ))}
              </ul>
              <p className={styles.priceNote}>
                Ціна орієнтовна — точну називаємо після огляду, вона залежить від
                стану меблів і складності забруднень. Виїзд майстра безкоштовний.
              </p>
            </section>
          )}
        </div>

        {/* Перелінковка на інші послуги: і людині є куди піти, і пошуковик
            бачить звʼязок між сторінками замість семи ізольованих. */}
        <section className={styles.also}>
          <h2 className={styles.blockTitle}>Інші послуги</h2>
          <div className={styles.alsoGrid}>
            {others.map((item) => (
              <Link key={item.id} to={servicePath(item.slug)} className={styles.alsoLink}>
                <span>{item.title}</span>
                <span className={styles.alsoPrice}>{item.price}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.cta}>
          <p className={styles.ctaText}>{CONTACTS.note}</p>
          <div className={styles.actions}>
            <Button
              size="lg"
              iconRight={<ArrowRightIcon />}
              onClick={() => openOrder({ service: service.id })}
            >
              Замовити чистку
            </Button>
            <Button href={`tel:${CONTACTS.phone}`} size="lg" variant="outline" iconRight={<PhoneIcon size={17} />}>
              Зателефонувати
            </Button>
          </div>
        </div>
      </Container>
    </article>
  )
}
