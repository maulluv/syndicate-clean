import Container from '@/components/Container'
import { SOCIAL, CONTACTS } from '@/config/site'
import {
  InstagramIcon,
  TelegramIcon,
  FacebookIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightIcon,
} from '@/components/icons'
import styles from './Contacts.module.css'

const CHANNELS = [
  { key: 'telegram', label: 'Telegram', hint: 'Написати в чат', icon: <TelegramIcon />, href: SOCIAL.telegram, accent: '#2aabee' },
  { key: 'instagram', label: 'Instagram', hint: 'Написати в Direct', icon: <InstagramIcon />, href: SOCIAL.instagram, accent: '#d6249f' },
  { key: 'facebook', label: 'Facebook', hint: 'Messenger', icon: <FacebookIcon />, href: SOCIAL.facebook, accent: '#1877f2' },
]

export default function Contacts() {
  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Звʼязатися з нами</p>
          <h1 className={styles.title}>Контакти</h1>
          <p className={styles.lead}>
            Немає форм і зайвих кроків — напишіть у зручному месенджері або
            зателефонуйте. Підберемо час і порахуємо вартість.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Контактні дані */}
          <div className={styles.info}>
            <ContactItem icon={<PhoneIcon size={18} />} label="Телефон">
              <a href={`tel:${CONTACTS.phone}`} className={styles.value}>
                {CONTACTS.phoneDisplay}
              </a>
            </ContactItem>
            <ContactItem icon={<MailIcon size={18} />} label="Пошта">
              <a href={`mailto:${CONTACTS.email}`} className={styles.value}>
                {CONTACTS.email}
              </a>
            </ContactItem>
            <ContactItem label="Місто">
              <span className={styles.value}>{CONTACTS.city}</span>
            </ContactItem>
            <ContactItem label="Графік">
              <span className={styles.value}>{CONTACTS.hours}</span>
            </ContactItem>
          </div>

          {/* Вибір месенджера */}
          <div className={styles.channels}>
            <h2 className={styles.channelsTitle}>Оберіть месенджер</h2>
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
        </div>
      </Container>
    </section>
  )
}

function ContactItem({ label, icon, children }) {
  return (
    <div className={styles.item}>
      <span className={styles.itemLabel}>
        {icon}
        {label}
      </span>
      {children}
    </div>
  )
}
