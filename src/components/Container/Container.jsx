import styles from './Container.module.css'

/**
 * Container — центрує контент і задає горизонтальні відступи.
 * Використовується на всіх сторінках, щоб ширина була однаковою.
 *
 * @param {React.ElementType} as - тег обгортки (div, section, header, footer...)
 * @param {string} className - додаткові класи
 */
export default function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`${styles.container} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
