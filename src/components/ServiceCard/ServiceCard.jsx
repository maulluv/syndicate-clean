import { useRef, useState } from 'react'
import { PlayIcon } from '@/components/icons'
import styles from './ServiceCard.module.css'

/**
 * ServiceCard — картка послуги.
 * Відео стартує при наведенні мишкою; клік по картці відкриває модалку (onOpen).
 *
 * @param {{title, desc, price, video, poster?}} service
 * @param {() => void} onOpen
 */
export default function ServiceCard({ service, onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const handleEnter = () => {
    const v = videoRef.current
    if (!v) return
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {})
  }

  const handleLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setPlaying(false)
  }

  return (
    <button
      className={styles.card}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      aria-label={`Детальніше про «${service.title}»`}
    >
      <div className={styles.media}>
        <video
          ref={videoRef}
          className={styles.video}
          src={service.video}
          poster={service.poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className={`${styles.playHint} ${playing ? styles.hidden : ''}`}>
          <PlayIcon />
          <span>переглянути</span>
        </div>
        <span className={styles.price}>{service.price}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.desc}>{service.desc}</p>
        <span className={styles.more}>Детальніше →</span>
      </div>
    </button>
  )
}
