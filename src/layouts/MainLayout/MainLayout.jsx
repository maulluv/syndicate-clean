import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './MainLayout.module.css'

/** Каркас сайту: шапка зверху, контент сторінки в центрі, футер знизу. */
export default function MainLayout() {
  const { pathname } = useLocation()

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
    </div>
  )
}
