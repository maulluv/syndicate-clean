import { useState } from 'react'
import Container from '@/components/Container'
import ChemistryCard from '@/components/ChemistryCard'
import ChemBottle from '@/components/ChemBottle'
import Modal from '@/components/Modal'
import { CHEMISTRY } from '@/config/site'
import styles from './Chemistry.module.css'

export default function Chemistry() {
  const [active, setActive] = useState(null)

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <p className="eyebrow">Що ми використовуємо</p>
          <h1 className={styles.title}>Наша хімія</h1>
          <p className={styles.lead}>
            Тільки професійні засоби, що повертають меблям чистоту без шкоди
            для тканини, здоровʼя та домашніх улюбленців. Натисніть на засіб, щоб
            дізнатися більше.
          </p>
        </header>

        <div className={styles.grid}>
          {CHEMISTRY.map((item) => (
            <ChemistryCard key={item.id} item={item} onClick={() => setActive(item)} />
          ))}
        </div>
      </Container>

      {/* Модалка з описом обраного засобу */}
      <Modal
        isOpen={!!active}
        onClose={() => setActive(null)}
        size="lg"
        corner={
          active && (
            <div className={styles.cornerBottle} style={{ '--accent': active.color }}>
              <ChemBottle color={active.color} uid={`modal-${active.id}`} />
            </div>
          )
        }
      >
        {active && (
          <div className={styles.modalBody}>
            <span className={styles.modalShort} style={{ color: active.color }}>
              {active.short}
            </span>
            <h2 className={styles.modalTitle}>{active.title}</h2>
            <p className={styles.modalDesc}>{active.desc}</p>
          </div>
        )}
      </Modal>
    </section>
  )
}
