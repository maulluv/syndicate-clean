import { useState } from 'react'
import { FAQ } from '@/config/site'
import styles from './Faq.module.css'

/**
 * Блок «Часті питання».
 *
 * Показує лише ті питання, на які власник дав відповідь: у config/site.js
 * порожній answer означає «ще не відповіли», і таке питання просто не
 * рендериться. Якщо відповідей немає жодної, блок не зʼявляється взагалі —
 * порожній розділ виглядав би гірше, ніж його відсутність.
 *
 * Відкрите одне питання за раз: так відповідь не губиться серед сусідніх,
 * і список лишається оглядовим.
 */
export default function Faq() {
  const [open, setOpen] = useState(null)
  const items = FAQ.filter((item) => item.answer?.trim())

  if (!items.length) return null

  return (
    <div className={styles.faq}>
      <header className={styles.head}>
        <p className="eyebrow">Питання й відповіді</p>
        <h2 className={styles.title}>Що зазвичай запитують</h2>
      </header>

      <ul className={styles.list}>
        {items.map((item, index) => {
          const isOpen = open === index
          return (
            <li key={item.q} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
              <button
                type="button"
                className={styles.question}
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className={styles.sign} aria-hidden="true" />
              </button>

              {/* Обгортка з grid-рядком 0fr → 1fr дає плавне розгортання
                  під будь-яку висоту тексту. Через max-height довелось би
                  вгадувати число, і довгі відповіді обрізались би. */}
              <div className={styles.answerWrap}>
                <div className={styles.answerInner}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
