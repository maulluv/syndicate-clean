import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

/**
 * Logo — знак бренду (SVG «іскра чистоти») + текстовий wordmark.
 * Легко замінити: передай інші name / tagline, або підстав власний SVG у <LogoMark>.
 *
 * @param {string} name - назва бренду
 * @param {string} tagline - підпис під назвою
 * @param {boolean} showTagline - показувати підпис
 * @param {'sm'|'md'} size
 */
export default function Logo({
  name = 'SYNDICATE CLEAN',
  tagline = 'Хімчистка меблів',
  showTagline = true,
  size = 'md',
}) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`} aria-label={`${name} — на головну`}>
      <LogoMark />
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        {showTagline && <span className={styles.tagline}>{tagline}</span>}
      </span>
    </Link>
  )
}

/** Знак — золотий діамант (під бренд SYNDICATE CLEAN). Замінити тут, якщо буде готове лого. */
function LogoMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGold" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d9c191" />
            <stop offset="1" stopColor="#c9a86a" />
          </linearGradient>
        </defs>
        {/* Огранка діаманта */}
        <path
          d="M10 6 H30 L37 15 L20 36 L3 15 Z"
          fill="url(#logoGold)"
        />
        {/* Внутрішні грані */}
        <path
          d="M10 6 L14.5 15 H3 M30 6 L25.5 15 H37 M14.5 15 H25.5 M14.5 15 L20 36 M25.5 15 L20 36"
          stroke="#0e0e10"
          strokeWidth="1.1"
          strokeLinejoin="round"
          opacity="0.35"
        />
      </svg>
    </span>
  )
}
