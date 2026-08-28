import { useEffect, useState } from 'react'
import OrderModal from '@/components/OrderModal'
import { CONTACTS } from '@/config/site'
import { subscribeStickyCta } from '@/lib/stickyCta'
import { PhoneIcon } from '@/components/icons'
import styles from './CallButton.module.css'

/**
 * Плаваюча кнопка звʼязку в нижньому куті.
 *
 * Раніше вона стояла в шапці, але там її видно лише на початку сторінки:
 * варто прокрутити — і способу звʼязатися вже нема перед очима. Внизу вона
 * лишається на екрані завжди, і в неї зручно влучити великим пальцем на
 * телефоні, де шапка далеко вгорі.
 *
 * Відкриває вікно тільки зі способами звʼязку — без форми. Форма живе на
 * кнопці «Замовити»: це різні наміри. «Подзвонити» — коли людина хоче
 * говорити зараз, а не заповнювати поля.
 *
 * Зʼявляється не одразу: поки видно перший екран, там і так є великі кнопки
 * замовлення, і третя кнопка поруч лише відбирала б увагу.
 */
export default function CallButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [stickyCta, setStickyCta] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Калькулятор повідомляє, коли його підсумок із кнопкою «Замовити»
  // видно внизу екрана — тоді поступаємось місцем.
  useEffect(() => subscribeStickyCta(setStickyCta), [])

  const shown = scrolled && !stickyCta

  return (
    <>
      <button
        className={`${styles.button} ${shown ? styles.visible : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Звʼязатися: ${CONTACTS.phoneDisplay}`}
        aria-hidden={!shown}
        tabIndex={shown ? 0 : -1}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <PhoneIcon size={23} />
      </button>

      <OrderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        channelsOnly
        eyebrow="Звʼязок"
        title="Зателефонуйте або напишіть"
        subtitle={`${CONTACTS.hours}. Оберіть зручний спосіб — відповімо швидко.`}
      />
    </>
  )
}
