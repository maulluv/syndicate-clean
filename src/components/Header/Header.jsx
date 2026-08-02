import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { useOrderModal } from '@/context/OrderModalContext'
import { NAV_LINKS } from '@/config/site'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const openOrder = useOrderModal()

  // Тінь/фон при скролі
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Закривати мобільне меню при зміні сторінки
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Блокувати скрол сторінки, коли відкрите мобільне меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${
          menuOpen ? styles.menuActive : ''
        }`}
      >
        <Container className={styles.inner}>
          <Logo />

        {/* Десктоп-навігація */}
        <nav className={styles.nav} aria-label="Головна навігація">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button size="sm" className={styles.cta} onClick={openOrder}>
            Замовити чистку
          </Button>

          {/* Бургер (мобільний) */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
          </div>
        </Container>
      </header>

      {/* Мобільне меню — окремий елемент поза <header>, щоб на нього
          не впливав backdrop-filter хедера (інакше ламається position: fixed). */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            fullWidth
            className={styles.mobileCta}
            onClick={() => {
              setMenuOpen(false)
              openOrder()
            }}
          >
            Замовити чистку
          </Button>
        </nav>
      </div>
    </>
  )
}
