import { Link } from 'react-router-dom'
import styles from './Button.module.css'

/**
 * Button — єдина кнопка на весь сайт. Реюзабельна й полиморфна.
 *
 * @param {'primary'|'outline'|'ghost'} variant - візуальний стиль
 * @param {'sm'|'md'|'lg'} size - розмір
 * @param {string} [to] - якщо задано, рендериться як внутрішнє посилання (React Router <Link>)
 * @param {string} [href] - якщо задано, рендериться як зовнішнє посилання <a>
 * @param {boolean} [fullWidth] - розтягнути на всю ширину
 * @param {React.ReactNode} [iconRight] - іконка праворуч від тексту
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  fullWidth = false,
  iconRight,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </>
  )

  // Внутрішнє посилання
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  // Зовнішнє посилання
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  // Звичайна кнопка
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  )
}
