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
            {/* Передаємо саме цю послугу — у формі вона вже буде обрана,
                і людині не доведеться вдруге шукати те, що вона щойно відкрила. */}
            <Button
              iconRight={<ArrowRightIcon />}
              onClick={() => {
                onClose()
                openOrder({ service: service.id })
              }}
            >
              Замовити
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
