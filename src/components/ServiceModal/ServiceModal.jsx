import { useRef, useEffect } from 'react'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { ArrowRightIcon } from '@/components/icons'
import styles from './ServiceModal.module.css'

/**
 * ServiceModal — детальна модалка послуги.
 * Відео запускається одразу при відкритті (muted, щоб браузер дозволив autoplay).
 *
 * @param {object|null} service - активна послуга або null
 * @param {() => void} onClose
 */
export default function ServiceModal({ service, onClose }) {
  const videoRef = useRef(null)
  const openOrder = useOrderModal()

  // Автозапуск відео при відкритті
  useEffect(() => {
    if (!service) return
    const v = videoRef.current
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }, [service])

  return (
    <Modal isOpen={!!service} onClose={onClose} size="lg">
      {service && (
        <div className={styles.wrap}>
          <div className={styles.media}>
            <video
              ref={videoRef}
              className={styles.video}
              src={service.video}
              muted
              loop
              playsInline
              controls
            />
            <span className={styles.price}>{service.price}</span>
          </div>

          <div className={styles.info}>
            <h2 className={styles.title}>{service.title}</h2>
            <p className={styles.desc}>{service.desc}</p>
            <Button iconRight={<ArrowRightIcon />} onClick={openOrder}>
              Замовити
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
