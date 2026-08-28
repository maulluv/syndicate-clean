import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/Button'
import PhotoPicker from '@/components/PhotoPicker'
import { SERVICES, CONTACTS } from '@/config/site'
import { nextPhoneValue, phoneForSending } from '@/lib/phone'
import { ArrowRightIcon, CheckIcon, PhoneIcon } from '@/components/icons'
import styles from './OrderForm.module.css'

const EMPTY = { name: '', phone: '', service: '', comment: '', website: '' }

/** Тексти, що відрізняються між двома режимами форми. */
const MODES = {
  order: {
    photosLabel: 'Фото меблів',
    photosNote: 'Необовʼязково, але з фото оцінка буде точнішою',
    commentPlaceholder: 'Кутовий диван, є плями від кави',
    submit: 'Залишити заявку',
    doneText: 'Звʼяжемося з вами найближчим часом',
  },
  photo: {
    photosLabel: 'Фото меблів',
    photosNote: 'Головне тут — знімки. За ними назвемо вартість.',
    commentPlaceholder: 'Що турбує: пляма, запах, загальне освіження',
    submit: 'Надіслати на оцінку',
    doneText: 'Подивимось фото й повернемось із вартістю',
  },
}

/**
 * Форма заявки. Надсилає дані на /api/order, звідти вони йдуть у Telegram —
 * див. worker/order.js.
 *
 * Два режими:
 *   order — звичайна заявка, фото за бажанням
 *   photo — оцінка по фото: знімки стоять першими й обовʼязкові
 *
 * Сенс форми: людині, яка не хоче відкривати месенджер і починати розмову,
 * достатньо лишити імʼя й телефон. Месенджери лишаються поруч як альтернатива.
 *
 * @param {'order'|'photo'} [mode]
 * @param {string} [calc] - готовий розрахунок із калькулятора
 * @param {() => void} [onDone]
 */
export default function OrderForm({ mode = 'order', calc, service, onDone }) {
  // Послуга може прийти ззовні — наприклад, коли натиснули «Замовити»
  // у картці конкретної послуги. Тоді список одразу показує потрібне,
  // і людині не треба обирати те, що вона щойно й так обрала.
  const [values, setValues] = useState({ ...EMPTY, service: service ?? '' })
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorField, setErrorField] = useState(null)
  const { pathname } = useLocation()

  const texts = MODES[mode]
  const needsPhotos = mode === 'photo'

  const update = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    if (errorField === field) setErrorField(null)
  }

  // Телефон приводимо до вигляду +380 (67) 123-45-67 просто під час набору
  const updatePhone = (event) => {
    setValues((prev) => ({ ...prev, phone: nextPhoneValue(event.target.value, prev.phone) }))
    if (errorField === 'phone') setErrorField(null)
  }

  async function submit(event) {
    event.preventDefault()
    if (status === 'sending') return

    if (needsPhotos && photos.length === 0) {
      setErrorField('photos')
      return
    }

    setStatus('sending')
    setErrorField(null)

    try {
      // З фото — форма з файлами, без фото — звичайний JSON: він легший
      // і не змушує сервер розбирати multipart без потреби.
      let body
      const headers = {}
      const common = {
        ...values,
        // На сервер іде чистий номер без розмітки: +380671234567
        phone: phoneForSending(values.phone),
        page: pathname,
        kind: calc ? 'calc' : mode,
        ...(calc ? { calc } : {}),
      }

      if (photos.length) {
        const form = new FormData()
        Object.entries(common).forEach(([key, value]) => form.append(key, value))
        photos.forEach((file) => form.append('photo', file, file.name))
        body = form
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(common)
      }

      const response = await fetch('/api/order', { method: 'POST', headers, body })
      const result = await response.json().catch(() => ({}))

      if (result.ok) {
        setStatus('sent')
        if (onDone) setTimeout(onDone, 2800)
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

      // Решта — справжній збій: немає налаштувань, Telegram не відповів,
      // мережа впала. Тут доречно показати телефон.
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
          {texts.doneText}. Працюємо {CONTACTS.hours.replace('Пн–Нд: ', 'щодня ')}.
        </p>
      </div>
    )
  }

  const photoBlock = (
    <div className={styles.field}>
      <span className={styles.label}>
        {texts.photosLabel}{' '}
        <span className={styles.optional}>— {texts.photosNote}</span>
      </span>
      <PhotoPicker photos={photos} onChange={(next) => {
        setPhotos(next)
        if (errorField === 'photos') setErrorField(null)
      }} />
      {errorField === 'photos' && (
        <span className={styles.hint}>Додайте хоча б один знімок</span>
      )}
    </div>
  )

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {/* Пастка для ботів: людина цього поля не бачить (винесене за екран),
          автоматичний заповнювач — заповнить. Сервер тоді мовчки відкидає
          заявку. tabIndex прибирає поле і з клавіатури. */}
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

      {calc && (
        <div className={styles.calc}>
          <span className={styles.calcLabel}>Ваш розрахунок</span>
          <pre className={styles.calcBody}>{calc}</pre>
        </div>
      )}

      {/* В режимі оцінки знімки — головне, тож стоять першими */}
      {needsPhotos && photoBlock}

      <div className={styles.row}>
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
            inputMode="tel"
            className={`${styles.input} ${errorField === 'phone' ? styles.invalid : ''}`}
            value={values.phone}
            onChange={updatePhone}
            placeholder="+380 (__) ___-__-__"
            autoComplete="tel"
            required
          />
          {errorField === 'phone' && (
            <span className={styles.hint}>Перевірте номер — здається, бракує цифр</span>
          )}
        </label>
      </div>

      {!needsPhotos && !calc && (
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
      )}

      <label className={styles.field}>
        <span className={styles.label}>
          Коментар <span className={styles.optional}>— необовʼязково</span>
        </span>
        <textarea
          className={styles.textarea}
          value={values.comment}
          onChange={update('comment')}
          placeholder={texts.commentPlaceholder}
          rows={3}
        />
      </label>

      {!needsPhotos && photoBlock}

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
        className={styles.submit}
      >
        {status === 'sending' ? 'Надсилаємо…' : texts.submit}
      </Button>
    </form>
  )
}
