import { Link } from 'react-router-dom'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { NAV_LINKS, SERVICES, SOCIAL, CONTACTS, BRAND } from '@/config/site'
import {
  InstagramIcon,
  TelegramIcon,
  FacebookIcon,
  ArrowRightIcon,
} from '@/components/icons'
import styles from './Footer.module.css'

const SOCIALS = [
  { label: 'Instagram', href: SOCIAL.instagram, icon: <InstagramIcon size={18} /> },
  { label: 'Telegram', href: SOCIAL.telegram, icon: <TelegramIcon size={18} /> },
  { label: 'Facebook', href: SOCIAL.facebook, icon: <FacebookIcon size={18} /> },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const openOrder = useOrderModal()

  return (
    <footer className={styles.footer}>
      <Container>
        {/* CTA-смуга */}
        <div className={styles.cta}>
          <div>
            <p className="eyebrow">Готові до чистоти?</p>
            <h2 className={styles.ctaTitle}>
              Даруємо меблям <em>другу молодість</em>
            </h2>
          </div>
          <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
            Замовити чистку
          </Button>
        </div>

        <div className={styles.divider} />

        {/* Основна сітка */}
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Logo />
            <p className={styles.brandText}>
              Професійна хімчистка меблів у Києві та області. Глибоке та
              делікатне чищення з безпечною хімією та турботою про кожну деталь.
            </p>
            <div className={styles.socials}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.col} aria-label="Навігація у футері">
            <h3 className={styles.colTitle}>Навігація</h3>
            <ul className={styles.list}>
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Послуги</h3>
            <ul className={styles.list}>
              {SERVICES.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link to="/poslugy" className={styles.link}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Контакти</h3>
            <ul className={styles.list}>
              <li>
                <a href={`tel:${CONTACTS.phone}`} className={styles.link}>
                  {CONTACTS.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACTS.email}`} className={styles.link}>
                  {CONTACTS.email}
                </a>
              </li>
              <li className={styles.listItem}>{CONTACTS.city}</li>
              <li className={styles.listItem}>{CONTACTS.hours}</li>
            </ul>
          </div>
        </div>

        {/* Нижня смуга */}
        <div className={styles.bottom}>
          <p>© {year} {BRAND.name}. Усі права захищено.</p>
          <p className={styles.credit}>{BRAND.slogan}</p>
        </div>
      </Container>
    </footer>
  )
}
