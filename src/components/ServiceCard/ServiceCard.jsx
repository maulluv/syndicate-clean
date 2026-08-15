import ServicePhoto from '@/components/ServicePhoto'
import { useInView } from '@/hooks/useInView'
import styles from './ServiceCard.module.css'

/**
 * ServiceCard — картка послуги.
 * Фото плавно наближається при наведенні; клік по картці відкриває модалку (onOpen).
 *
 * @param {{title, desc, price, photo?, tone?}} service
 * @param {() => void} onOpen
 */
export default function ServiceCard({ service, onOpen }) {
  const [cardRef, inView] = useInView()

  return (
    <button
      ref={cardRef}
      className={`${styles.card} ${inView ? styles.inView : ''}`}
      onClick={onOpen}
      aria-label={`Детальніше про «${service.title}»`}
    >
      <div className={styles.media}>
        <ServicePhoto service={service} className={styles.photo} />
        <span className={styles.shade} aria-hidden="true" />
        <span className={styles.price}>{service.price}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.desc}>{service.desc}</p>
        <span className={styles.more}>Детальніше →</span>
      </div>
    </button>
  )
}
