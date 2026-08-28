import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { setStickyCta } from '@/lib/stickyCta'
import { CALCULATOR_ITEMS } from '@/config/site'
import { PlusIcon, MinusIcon, ArrowRightIcon } from '@/components/icons'
import styles from './Calculator.module.css'

/** Розбиває позиції по категоріях, зберігаючи порядок із прайсу. */
function byGroup(items) {
  const groups = new Map()
  for (const item of items) {
    if (!groups.has(item.group)) groups.set(item.group, [])
    groups.get(item.group).push(item)
  }
  return [...groups.entries()]
}

const money = (value) => `${value.toLocaleString('uk-UA')} грн`

/**
 * Калькулятор вартості.
 *
 * Навіщо: «скільки це коштує» — головне питання, з яким людина заходить,
 * і питати його в чаті багатьом незручно. Тут вона сама збирає свій набір
 * і одразу бачить порядок суми.
 *
 * Ціни беруться з PRICING у config/site.js — тих самих, що в таблиці вище.
 * Тому прайс і калькулятор не можуть розійтися.
 *
 * Сума навмисно подається як приблизна: у прайсі ціни «від», а реальна
 * залежить від стану меблів. Обіцяти точну цифру до огляду — це створювати
 * конфлікт на етапі оплати.
 */
export default function Calculator() {
  const [counts, setCounts] = useState({})
  const openOrder = useOrderModal()
  const groups = useMemo(() => byGroup(CALCULATOR_ITEMS), [])
  const totalRef = useRef(null)

  /* Поки підсумок із кнопкою «Замовити» видно на екрані, плаваюча кнопка
     звʼязку ховається: вона стоїть у тому ж куті й наїжджала просто на
     кнопку замовлення. Дві дії, що перекривають одна одну, — це не вибір,
     а промах пальцем. */
  useEffect(() => {
    const node = totalRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setStickyCta(entry.isIntersecting),
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      setStickyCta(false)
    }
  }, [])

  const change = (id, delta) =>
    setCounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta)
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })

  const chosen = CALCULATOR_ITEMS.filter((item) => counts[item.id] > 0)
  const total = chosen.reduce((sum, item) => sum + item.amount * counts[item.id], 0)

  /** Текст розрахунку, який піде разом із заявкою в Telegram. */
  const summary = () =>
    [
      ...chosen.map(
        (item) =>
          `${item.label} × ${counts[item.id]} ${item.unit} — ${money(item.amount * counts[item.id])}`
      ),
      `Разом орієнтовно: ${money(total)}`,
    ].join('\n')

  return (
    <div className={styles.calc}>
      <header className={styles.head}>
        <p className="eyebrow">Порахувати вартість</p>
        <h2 className={styles.title}>Калькулятор</h2>
        <p className={styles.lead}>
          Оберіть, що потрібно почистити — побачите орієнтовну суму одразу,
          без дзвінків і листування.
        </p>
      </header>

      <div className={styles.groups}>
        {groups.map(([title, items]) => (
          <div key={title} className={styles.group}>
            <h3 className={styles.groupTitle}>{title}</h3>

            <ul className={styles.items}>
              {items.map((item) => {
                const count = counts[item.id] ?? 0
                return (
                  <li
                    key={item.id}
                    className={`${styles.item} ${count > 0 ? styles.itemActive : ''}`}
                  >
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>{item.label}</span>
                      <span className={styles.itemPrice}>
                        від {money(item.amount)}
                        {item.unit !== 'шт' && ` / ${item.unit}`}
                      </span>
                    </div>

                    <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.step}
                        onClick={() => change(item.id, -1)}
                        disabled={count === 0}
                        aria-label={`Прибрати: ${item.label}`}
                      >
                        <MinusIcon size={17} />
                      </button>
                      <span className={styles.count} aria-live="polite">
                        {count}
                      </span>
                      <button
                        type="button"
                        className={styles.step}
                        onClick={() => change(item.id, 1)}
                        aria-label={`Додати: ${item.label}`}
                      >
                        <PlusIcon size={17} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Підсумок липне до низу екрана, поки людина гортає список: сума має
          бути перед очима в момент вибору, а не десь нижче. */}
      <div ref={totalRef} className={`${styles.total} ${total > 0 ? styles.totalActive : ''}`}>
        <div className={styles.totalText}>
          <span className={styles.totalLabel}>
            {total > 0 ? 'Орієнтовно' : 'Оберіть позиції вище'}
          </span>
          <span className={styles.totalValue}>{money(total)}</span>
        </div>

        <Button
          size="lg"
          disabled={total === 0}
          iconRight={<ArrowRightIcon />}
          onClick={() => openOrder({ calc: summary() })}
          className={styles.totalButton}
        >
          Замовити
        </Button>
      </div>

      <p className={styles.note}>
        Це орієнтовна сума за прайсом. Точну назвемо після огляду — вона
        залежить від стану меблів, тканини та складності забруднень.
        Виїзд майстра безкоштовний.
      </p>
    </div>
  )
}
