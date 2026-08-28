import Modal from '@/components/Modal'
import { CONTACTS } from '@/config/site'
import { CONTACT_CHANNELS, channelHint } from '@/config/channels'
import { PhoneIcon, ArrowRightIcon } from '@/components/icons'
import styles from './OrderModal.module.css'

/** Модалка вибору способу зв'язку.
    За замовчуванням — «Замовити чистку» (кнопки CTA по сайту).
    Через eyebrow/title/subtitle той самий список каналів
    перевикористовується під інший контекст — напр. іконка телефону в хедері. */
export default function OrderModal({
  isOpen,
  onClose,
  eyebrow = 'Замовити чистку',
  title = 'Як вам зручно звʼязатися?',
  subtitle = `${CONTACTS.note}. Оберіть месенджер — підберемо час і порахуємо вартість.`,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.head}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.channels}>
        {CONTACT_CHANNELS.map((channel) => {
          const { key, label, href, accent, Icon } = channel

          const content = (
            <>
              <span className={styles.channelIcon}>
                <Icon />
              </span>
              <span className={styles.channelText}>
                <span className={styles.channelLabel}>{label}</span>
                <span className={styles.channelHint}>{channelHint(channel)}</span>
              </span>
              <span className={styles.channelArrow}>
                <ArrowRightIcon />
              </span>
            </>
          )

          // Канал без посилання лишається на місці, але не клікається:
          // місце під нього вже видно, а натиснути ще нема куди.
          if (!href) {
            return (
              <span
                key={key}
                className={`${styles.channel} ${styles.channelSoon}`}
                style={{ '--accent': accent }}
                aria-disabled="true"
              >
                {content}
              </span>
            )
          }

          // viber:// — не сайт, а команда відкрити застосунок. У новій вкладці
          // вона лишила б по собі порожню сторінку, тому нове вікно тільки
          // для звичайних http-посилань.
          const opensSite = href.startsWith('http')

          return (
            <a
              key={key}
              href={href}
              {...(opensSite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={styles.channel}
              style={{ '--accent': accent }}
            >
              {content}
            </a>
          )
        })}
      </div>

      <div className={styles.divider}>
        <span>або</span>
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
