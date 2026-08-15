import { useState } from 'react'
import styles from './ServicePhoto.module.css'

/**
 * ServicePhoto — знімок послуги для картки та модалки.
 * Шлях і колір беруться з SERVICES у config/site.js (`photo`, `tone`).
 * Якщо файлу ще немає або він не завантажився — показуємо градієнтну плашку
 * з діамантом бренду, тож сітка лишається цілісною й нічого не ламається.
 *
 * @param {{title, photo?, tone?}} service
 * @param {string} className - клас із батьківського модуля (розміри/анімація)
 * @param {'lazy'|'eager'} loading
 */
export default function ServicePhoto({ service, className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)
  const showFallback = !service.photo || failed

  if (showFallback) {
    return (
      <div
        className={`${styles.fallback} ${className}`}
        style={{ '--tone': service.tone || 'var(--color-gold)' }}
        role="img"
        aria-label={service.title}
      >
        <DiamondMark />
      </div>
    )
  }

  return (
    <img
      className={`${styles.photo} ${className}`}
      src={service.photo}
      alt={service.title}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function DiamondMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 6 H30 L37 15 L20 36 L3 15 Z" fill="currentColor" />
      <path
        d="M10 6 L14.5 15 H3 M30 6 L25.5 15 H37 M14.5 15 H25.5 M14.5 15 L20 36 M25.5 15 L20 36"
        stroke="#0e0e10"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.3"
      />
    </svg>
  )
}
