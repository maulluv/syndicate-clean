import Modal from '@/components/Modal'
import Button from '@/components/Button'
import ServicePhoto from '@/components/ServicePhoto'
import { useOrderModal } from '@/context/OrderModalContext'
import { ArrowRightIcon } from '@/components/icons'
import styles from './ServiceModal.module.css'

/**
 * ServiceModal — детальна модалка послуги.
 *
 * @param {object|null} service - активна послуга або null
 * @param {() => void} onClose
 */
export default function ServiceModal({ service, onClose }) {
  const openOrder = useOrderModal()

  return (
    <Modal isOpen={!!service} onClose={onClose} size="lg">
      {service && (
        <div className={styles.wrap}>
          <div className={styles.media}>
            <ServicePhoto service={service} className={styles.photo} loading="eager" />
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
