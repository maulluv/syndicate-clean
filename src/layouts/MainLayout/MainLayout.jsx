import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CallButton from '@/components/CallButton'
import { usePageMeta } from '@/hooks/usePageMeta'
import styles from './MainLayout.module.css'

/** Каркас сайту: шапка зверху, контент сторінки в центрі, футер знизу. */
export default function MainLayout() {
  const { pathname } = useLocation()

  // Заголовок вкладки й опис сторінки — свої для кожного розділу
  usePageMeta()

  // Прокрутка нагору при переході між сторінками
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />

      {/* Плаваюча кнопка звʼязку — на всіх сторінках, зʼявляється після
          прокрутки першого екрана */}
      <CallButton />
    </div>
  )
}
