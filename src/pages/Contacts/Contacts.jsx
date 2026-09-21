import Container from '@/components/Container'
import { CONTACTS } from '@/config/site'
import { CONTACT_CHANNELS, channelHint } from '@/config/channels'
import { PhoneIcon, ArrowRightIcon } from '@/components/icons'
import styles from './Contacts.module.css'

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
            <ContactItem label="Місто">
              <span className={styles.value}>{CONTACTS.city}</span>
            </ContactItem>
            <ContactItem label="Графік">
              <span className={styles.value}>{CONTACTS.hours}</span>
            </ContactItem>
            <ContactItem label="Оцінка вартості">
              <span className={styles.value}>{CONTACTS.note}</span>
            </ContactItem>
          </div>

          {/* Вибір месенджера */}
          <div className={styles.channels}>
            <h2 className={styles.channelsTitle}>Оберіть месенджер</h2>
            {CONTACT_CHANNELS.map((channel) => (
              <ChannelRow key={channel.key} channel={channel} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/**
 * Один рядок месенджера.
 * Канал без посилання показуємо теж, але неактивним: місце під нього вже
 * видно, а натиснути ще нема куди (так зараз з Instagram).
 */
function ChannelRow({ channel }) {
  const { label, href, accent, Icon } = channel

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

  if (!href) {
    return (
      <span
        className={`${styles.channel} ${styles.channelSoon}`}
        style={{ '--accent': accent }}
        aria-disabled="true"
      >
        {content}
      </span>
    )
  }

  // viber:// відкриває застосунок, а не сайт — нове вікно лишило б порожню вкладку
  const opensSite = href.startsWith('http')

  return (
    <a
      href={href}
      {...(opensSite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={styles.channel}
      style={{ '--accent': accent }}
    >
      {content}
    </a>
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
