import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/components/icons'
import styles from './Modal.module.css'

/**
 * Modal — універсальне модальне вікно.
 * Закривається по Esc, кліку на затемнення та хрестику.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {React.ReactNode} corner - додатковий вміст у кутку (напр. мініатюра)
 * @param {'md'|'lg'} size
 */
export default function Modal({ isOpen, onClose, children, corner, size = 'md' }) {
  // Закриття по Escape + блокування скролу сторінки
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`${styles.modal} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Закрити">
          <CloseIcon />
        </button>

        {corner && <div className={styles.corner}>{corner}</div>}

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
