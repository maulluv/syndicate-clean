import ChemBottle from '@/components/ChemBottle'
import { useInView } from '@/hooks/useInView'
import styles from './ChemistryCard.module.css'

/**
 * ChemistryCard — картка засобу.
 * Легка анімація при наведенні, відкриває модалку по кліку (onClick).
 *
 * @param {{id, title, short, color, desc}} item
 * @param {() => void} onClick
 */
export default function ChemistryCard({ item, onClick }) {
  const [ref, inView] = useInView()

  return (
    <button
      ref={ref}
      className={`${styles.card} ${inView ? styles.inView : ''}`}
      onClick={onClick}
      style={{ '--accent': item.color }}
      aria-label={`Детальніше про «${item.title}»`}
    >
      <div className={styles.media}>
        <div className={styles.glow} />
        <div className={styles.bottle}>
          {item.cardPhoto ? (
            <img
              className={styles.bottleImg}
              src={item.cardPhoto}
              alt={item.title}
              loading="lazy"
            />
          ) : (
            <ChemBottle color={item.color} uid={item.id} />
          )}
        </div>
      </div>

      <div className={styles.info}>
        <span className={styles.short}>{item.short}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.more}>Детальніше →</span>
      </div>
    </button>
  )
}
