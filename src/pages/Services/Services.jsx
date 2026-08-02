import { useState } from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import ServiceCard from '@/components/ServiceCard'
import ServiceModal from '@/components/ServiceModal'
import { useOrderModal } from '@/context/OrderModalContext'
import { ArrowRightIcon } from '@/components/icons'
import { SERVICES, PRICING, FEATURES } from '@/config/site'
import styles from './Services.module.css'

export default function Services() {
  const [active, setActive] = useState(null)
  const openOrder = useOrderModal()

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Що ми робимо</p>
          <h1 className={styles.title}>Наші послуги</h1>
          <p className={styles.lead}>
            Наведіть на картку, щоб побачити процес у дії, або натисніть — і
            відкриється детальна картка з відео.
          </p>
        </header>

        <div className={styles.grid}>
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpen={() => setActive(service)}
            />
          ))}
        </div>

        {/* ===== Прайс-лист ===== */}
        <div className={styles.pricing}>
          <header className={styles.priceHead}>
            <p className="eyebrow">Прозорі ціни</p>
            <h2 className={styles.priceTitle}>Прайс-лист</h2>
          </header>

          <div className={styles.priceGrid}>
            {PRICING.map((group) => (
              <div key={group.id} className={styles.priceCard}>
                <h3 className={styles.priceGroup}>{group.title}</h3>
                <ul className={styles.priceList}>
                  {group.items.map((item) => (
                    <li key={item.label} className={styles.priceRow}>
                      <span className={styles.priceLabel}>{item.label}</span>
                      <span className={styles.priceDots} aria-hidden="true" />
                      <span className={styles.priceValue}>{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.priceCta}>
            <p className={styles.priceNote}>
              Точна вартість залежить від розміру, матеріалу та ступеня
              забруднення. Порахуємо безкоштовно.
            </p>
            <Button iconRight={<ArrowRightIcon />} onClick={openOrder}>
              Дізнатися вартість
            </Button>
          </div>
        </div>

        {/* ===== Переваги ===== */}
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f.id} className={styles.feature}>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>

      <ServiceModal service={active} onClose={() => setActive(null)} />
    </section>
  )
}
