import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/Button'
import { SERVICES, CONTACTS } from '@/config/site'
import { ArrowRightIcon, CheckIcon, PhoneIcon } from '@/components/icons'
import styles from './OrderForm.module.css'

const EMPTY = { name: '', phone: '', service: '', comment: '', website: '' }

/**
 * Форма заявки. Надсилає дані на /api/order, а звідти вони йдуть
 * у Telegram власнику — див. worker/order.js.
 *
 * Сенс форми: людині, яка не хоче відкривати месенджер і починати розмову,
 * достатньо лишити імʼя й телефон. Месенджери лишаються поруч як альтернатива,
 * а не як єдиний шлях.
 *
 * @param {() => void} [onDone] - викликається після успішної відправки
 *                                (модалка закривається із затримкою)
 */
export default function OrderForm({ onDone }) {
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorField, setErrorField] = useState(null)
  const { pathname } = useLocation()

  const update = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    if (errorField === field) setErrorField(null)
  }

  async function submit(event) {
    event.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setErrorField(null)

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, page: pathname }),
      })
      const result = await response.json().catch(() => ({}))

      if (result.ok) {
        setStatus('sent')
        // Даємо побачити підтвердження, і аж потім закриваємо
        if (onDone) setTimeout(onDone, 2600)
        return
      }

      // Сервер каже, яке саме поле не сподобалось — підсвічуємо його й
      // повертаємось у звичайний стан. Загальне «не вдалося надіслати» тут
      // показувати не можна: людина вирішить, що зламався сайт, хоча треба
      // просто дописати цифру в номері.
      if (result.error === 'name' || result.error === 'phone') {
        setErrorField(result.error)
        setStatus('idle')
        return
      }

      // Решта — це вже справжній збій: немає налаштувань, Telegram не
      // відповів, мережа впала. Тут доречно показати телефон.
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.done}>
        <span className={styles.doneIcon}>
          <CheckIcon size={26} />
        </span>
        <p className={styles.doneTitle}>Заявку прийнято</p>
        <p className={styles.doneText}>
          Звʼяжемося з вами найближчим часом у робочі години: {CONTACTS.hours}.
        </p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {/* Пастка для ботів: людина цього поля не бачить (сховане стилями),
          автоматичний заповнювач — заповнить. Сервер тоді мовчки відкидає
          заявку. tabIndex і autoComplete прибирають поле і з клавіатури. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Не заповнюйте це поле
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={update('website')}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Як до вас звертатися</span>
        <input
          type="text"
          className={`${styles.input} ${errorField === 'name' ? styles.invalid : ''}`}
          value={values.name}
          onChange={update('name')}
          placeholder="Олена"
          autoComplete="name"
          required
        />
        {errorField === 'name' && (
          <span className={styles.hint}>Вкажіть, будь ласка, імʼя</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Телефон</span>
        <input
          type="tel"
          className={`${styles.input} ${errorField === 'phone' ? styles.invalid : ''}`}
          value={values.phone}
          onChange={update('phone')}
          placeholder="+38 (0__) ___-__-__"
          autoComplete="tel"
          required
        />
        {errorField === 'phone' && (
          <span className={styles.hint}>Перевірте номер — здається, бракує цифр</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Що почистити</span>
        <div className={styles.selectWrap}>
          <select className={styles.select} value={values.service} onChange={update('service')}>
            <option value="">Оберіть зі списку</option>
            {SERVICES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          Коментар <span className={styles.optional}>— необовʼязково</span>
        </span>
        <textarea
          className={styles.textarea}
          value={values.comment}
          onChange={update('comment')}
          placeholder="Кутовий диван, є плями від кави"
          rows={3}
        />
      </label>

      {status === 'error' && (
        <p className={styles.error} role="alert">
          Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте:{' '}
          <a href={`tel:${CONTACTS.phone}`} className={styles.errorPhone}>
            <PhoneIcon size={14} />
            {CONTACTS.phoneDisplay}
          </a>
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={status === 'sending'}
        iconRight={status === 'sending' ? null : <ArrowRightIcon />}
      >
        {status === 'sending' ? 'Надсилаємо…' : 'Залишити заявку'}
      </Button>
    </form>
  )
}
