import { Link } from 'react-router-dom'
import ServicePhoto from '@/components/ServicePhoto'
import { useInView } from '@/hooks/useInView'
import { servicePath } from '@/config/site'
import styles from './ServiceCard.module.css'

/**
 * ServiceCard — картка послуги. Веде на власну сторінку послуги.
 *
 * Раніше картка відкривала модалку з тим самим описом. Модалку прибрано:
 * тепер у кожної послуги є сторінка, де є все те саме плюс ціни, склад
 * роботи й кнопка замовлення. Тримати обидва варіанти означало б робити
 * ту саму роботу двічі, а пошуковик про модалку взагалі не знає — вміст
 * у ній зʼявляється лише після натискання.
 *
 * Це ще й посилання, а не кнопка: працює середній клік, «відкрити в новій
 * вкладці» й обхід пошуковиком.
 *
 * @param {{id, title, desc, price, slug, photo?, tone?}} service
 */
export default function ServiceCard({ service }) {
  const [cardRef, inView] = useInView()

  return (
    <Link
      ref={cardRef}
      to={servicePath(service.slug)}
      className={`${styles.card} ${inView ? styles.inView : ''}`}
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
    </Link>
  )
}
