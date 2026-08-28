import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Calculator from '@/components/Calculator'
import { useOrderModal } from '@/context/OrderModalContext'
import { INTRO, CHEMISTRY_INTRO, CONTACTS } from '@/config/site'
import { ArrowRightIcon, CheckIcon, ShieldIcon } from '@/components/icons'
import styles from './Home.module.css'

export default function Home() {
  const openOrder = useOrderModal()

  return (
    <>
      <section className={styles.hero}>
        <HeroBackground />

        {/* ===== Контент ===== */}
        <Container className={styles.inner}>
          <p className={`eyebrow ${styles.eyebrow}`}>Меблевий клінінг преміум-класу</p>

          <h1 className={styles.title}>
            <span className={styles.titleScript}>Досконала</span>
            <span className={styles.titleBlock}>ЧИСТОТА</span>
          </h1>

          <p className={styles.subtitle}>{INTRO.lead}</p>

          <div className={styles.actions}>
            <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
              Замовити чистку
            </Button>
            <Button to="/poslugy" size="lg" variant="outline">
              Наші послуги
            </Button>
          </div>
        </Container>

        {/* Індикатор скролу */}
        <div className={styles.scroll} aria-hidden="true">
          <span>гортайте</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      <IntroSection openOrder={openOrder} />

      {/* Калькулятор і на головній: більшість заходить саме сюди, і питання
          «скільки це коштує» виникає тут, а не на сторінці послуг. Компонент
          той самий, ціни ті самі — дублювання даних немає. */}
      <section className={styles.calc}>
        <Container>
          <Calculator />
        </Container>
      </section>

      <ChemistrySection />
    </>
  )
}

/** Блок про безпеку хімії — текст у config/site.js (CHEMISTRY_INTRO). */
function ChemistrySection() {
  return (
    <section className={styles.chem}>
      <Container>
        <header className={styles.chemHead}>
          <p className="eyebrow">{CHEMISTRY_INTRO.eyebrow}</p>
          <h2 className={styles.chemTitle}>{CHEMISTRY_INTRO.title}</h2>
          <p className={styles.chemLead}>{CHEMISTRY_INTRO.lead}</p>
        </header>

        <div className={styles.chemGrid}>
          {CHEMISTRY_INTRO.points.map((p) => (
            <div key={p.title} className={styles.chemCard}>
              <span className={styles.chemIcon}>
                <ShieldIcon size={20} />
              </span>
              <h3 className={styles.chemCardTitle}>{p.title}</h3>
              <p className={styles.chemCardDesc}>{p.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/himiya" className={styles.chemLink}>
          {CHEMISTRY_INTRO.linkText}
          <ArrowRightIcon />
        </Link>
      </Container>
    </section>
  )
}

/**
 * Фон героя.
 * Фото кладемо в /public/hero (див. design/hero/README.md):
 *   hero-mobile.webp — 1080×1620, для телефонів
 *   hero.webp        — 1920×1080, для планшетів і десктопу
 * Поки файлів немає (або якщо не завантажились) — показуємо градієнтний фон,
 * тож сайт ніколи не «ламається» через відсутню картинку.
 */
function HeroBackground() {
  const [hasPhoto, setHasPhoto] = useState(true)

  return (
    <div className={styles.bg} aria-hidden="true">
      {hasPhoto && (
        <picture>
          <source media="(max-width: 768px)" srcSet="/hero/hero-mobile.webp" type="image/webp" />
          <img
            className={styles.photo}
            src="/hero/hero.webp"
            alt=""
            fetchpriority="high"
            decoding="async"
            onError={() => setHasPhoto(false)}
          />
        </picture>
      )}
      <div className={styles.overlay} />
    </div>
  )
}

/** Блок «Про підхід» — текст власника з config/site.js (INTRO). */
function IntroSection({ openOrder }) {
  return (
    <section className={styles.intro}>
      <Container className={styles.introInner}>
        <div className={styles.introText}>
          <p className="eyebrow">Наш підхід</p>
          <h2 className={styles.introTitle}>{INTRO.statement}</h2>

          {INTRO.paragraphs.map((p) => (
            <p key={p} className={styles.introParagraph}>
              {p}
            </p>
          ))}

          <ul className={styles.principles}>
            {INTRO.principles.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className={styles.introAside}>
          <ul className={styles.points}>
            {INTRO.points.map((point) => (
              <li key={point} className={styles.point}>
                <span className={styles.pointIcon}>
                  <CheckIcon size={18} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <p className={styles.outro}>{INTRO.outro}</p>

          <div className={styles.meta}>
            <span>{CONTACTS.city}</span>
            <span>{CONTACTS.note}</span>
          </div>

          <Button size="lg" iconRight={<ArrowRightIcon />} onClick={openOrder}>
            Замовити чистку
          </Button>
        </div>
      </Container>

      <Container>
        <p className={styles.closing}>{INTRO.closing}</p>
      </Container>
    </section>
  )
}
