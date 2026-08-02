import Modal from '@/components/Modal'
import { SOCIAL, CONTACTS } from '@/config/site'
import {
  InstagramIcon,
  TelegramIcon,
  FacebookIcon,
  PhoneIcon,
  ArrowRightIcon,
} from '@/components/icons'
import styles from './OrderModal.module.css'

/** Варіанти зв'язку — беруться з config/site.js */
const CHANNELS = [
  {
    key: 'telegram',
    label: 'Telegram',
    hint: 'Швидка відповідь у чаті',
    icon: <TelegramIcon />,
    href: SOCIAL.telegram,
    accent: '#2aabee',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    hint: 'Напишіть у Direct',
    icon: <InstagramIcon />,
    href: SOCIAL.instagram,
    accent: '#d6249f',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    hint: 'Messenger або сторінка',
    icon: <FacebookIcon />,
    href: SOCIAL.facebook,
    accent: '#1877f2',
  },
]

/** Модалка вибору способу замовлення (замість форми). */
export default function OrderModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.head}>
        <p className="eyebrow">Замовити чистку</p>
        <h2 className={styles.title}>Як вам зручно звʼязатися?</h2>
        <p className={styles.subtitle}>
          Оберіть месенджер — напишемо, підберемо час і порахуємо вартість.
        </p>
      </div>

      <div className={styles.channels}>
        {CHANNELS.map((c) => (
          <a
            key={c.key}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.channel}
            style={{ '--accent': c.accent }}
          >
            <span className={styles.channelIcon}>{c.icon}</span>
            <span className={styles.channelText}>
              <span className={styles.channelLabel}>{c.label}</span>
              <span className={styles.channelHint}>{c.hint}</span>
            </span>
            <span className={styles.channelArrow}>
              <ArrowRightIcon />
            </span>
          </a>
        ))}
      </div>

      <div className={styles.divider}>
        <span>або</span>
      </div>

      <a href={`tel:${CONTACTS.phone}`} className={styles.phone}>
        <PhoneIcon size={18} />
        Зателефонувати: {CONTACTS.phoneDisplay}
      </a>
    </Modal>
  )
}
