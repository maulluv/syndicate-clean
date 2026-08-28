import Modal from '@/components/Modal'
import OrderForm from '@/components/OrderForm'
import { CONTACTS } from '@/config/site'
import { CONTACT_CHANNELS } from '@/config/channels'
import { PhoneIcon, ArrowRightIcon } from '@/components/icons'
import styles from './OrderModal.module.css'

/**
 * Модалка замовлення.
 *
 * Головний шлях — форма: людині досить лишити імʼя й телефон, не відкриваючи
 * месенджер і не починаючи розмову. Раніше це був єдиний варіант, і частина
 * відвідувачів на цьому кроці просто йшла.
 *
 * Месенджери лишились нижче, але компактним рядком: пʼять розгорнутих карток
 * разом із формою робили вікно нескінченним.
 *
 * Через eyebrow/title/subtitle та сама модалка працює і як «Замовити чистку»,
 * і як «Звʼязок» для іконки телефону в хедері.
 */
export default function OrderModal({
  isOpen,
  onClose,
  eyebrow = 'Замовити чистку',
  title = 'Залиште заявку',
  subtitle = `${CONTACTS.note}. Передзвонимо, підберемо час і порахуємо вартість.`,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.head}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <OrderForm onDone={onClose} />

      <div className={styles.divider}>
        <span>або напишіть у месенджер</span>
      </div>

      <div className={styles.channels}>
        {CONTACT_CHANNELS.map(({ key, label, href, accent, Icon }) => {
          const inner = (
            <>
              <span className={styles.channelIcon}>
                <Icon size={20} />
              </span>
              <span className={styles.channelLabel}>{label}</span>
            </>
          )

          // Канал без посилання лишається на місці, але не клікається —
          // місце під нього видно, а натиснути ще нема куди.
          if (!href) {
            return (
              <span
                key={key}
                className={`${styles.channel} ${styles.channelSoon}`}
                style={{ '--accent': accent }}
                title="Скоро зʼявиться"
                aria-disabled="true"
              >
                {inner}
              </span>
            )
          }

          // viber:// відкриває застосунок, а не сайт — нове вікно лишило б
          // по собі порожню вкладку.
          const opensSite = href.startsWith('http')

          return (
            <a
              key={key}
              href={href}
              {...(opensSite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={styles.channel}
              style={{ '--accent': accent }}
            >
              {inner}
            </a>
          )
        })}
      </div>

      <a href={`tel:${CONTACTS.phone}`} className={styles.phone}>
        <span className={styles.phoneIcon}>
          <PhoneIcon size={20} />
        </span>
        <span className={styles.phoneText}>
          <span className={styles.phoneLabel}>Зателефонувати</span>
          <span className={styles.phoneNumber}>{CONTACTS.phoneDisplay}</span>
        </span>
        <span className={styles.channelArrow}>
          <ArrowRightIcon />
        </span>
      </a>
    </Modal>
  )
}
