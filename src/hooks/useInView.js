import { useEffect, useRef, useState } from 'react'

/**
 * useInView — повертає [ref, inView].
 * Додає true, коли елемент зʼявляється у вьюпорті (для scroll-reveal анімацій).
 * Працює на всіх пристроях, тож дає «оживлення» і на телефоні, де немає hover.
 *
 * @param {{threshold?: number, rootMargin?: string, once?: boolean}} opts
 */
export function useInView({ threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Якщо IntersectionObserver недоступний — одразу показуємо (без анімації).
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
