import Container from '@/components/Container'
import Button from '@/components/Button'
import ProcessVideo from '@/components/ProcessVideo'
import { useOrderModal } from '@/context/OrderModalContext'
import { PROCESS, CONTACTS } from '@/config/site'
import { ArrowRightIcon } from '@/components/icons'
import styles from './Process.module.css'

/**
 * «Як ми працюємо» — кроки процесу з роликами.
 *
 * Сторінка існує лише коли є ролики: маршрут реєструється в App.jsx за
 * тією ж умовою, що вмикає пункт меню. Тому тут не треба перевіряти
 * порожні дані.
 *
 * Кроки без ролика показуємо теж — процес має читатись цілком, а не
 * уривками. Просто в них немає кадру збоку.
 */
export default function Process() {
  const openOrder = useOrderModal()

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Без сюрпризів</p>
          <h1 className={styles.title}>Як ми працюємо</h1>
          <p className={styles.lead}>
            Показуємо весь процес — від заявки до сухого дивана. Щоб ви
            знали, що саме відбуватиметься у вас удома.
          </p>
        </header>

        <ol className={styles.steps}>
          {PROCESS.map((step, index) => (
            <li key={step.id} className={styles.step}>
              <div className={styles.text}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepText}>{step.text}</p>
              </div>

              {step.video && (
                <div className={styles.media}>
                  <ProcessVideo
                    src={step.video}
                    poster={step.poster}
                    alt={`${step.title} — як це виглядає`}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Питання лишились? Відповімо до того, як щось робити.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
              Замовити чистку
            </Button>
            <Button href={`tel:${CONTACTS.phone}`} size="lg" variant="outline">
              {CONTACTS.phoneDisplay}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
