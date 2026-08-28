import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SEO, pageUrl, ANALYTICS } from '@/config/site'

/**
 * Тримає заголовок вкладки й опис сторінки актуальними при переходах.
 *
 * Розподіл праці такий:
 *   • Пошуковики й месенджери читають теги з готового HTML — їх проставляє
 *     збірка (scripts/generate-seo.mjs), бо роботи не виконують JavaScript.
 *   • Живий відвідувач ходить сайтом без перезавантаження сторінки, тож
 *     той HTML лишається від першої відкритої адреси. Цей хук оновлює
 *     заголовок вкладки, опис і canonical на кожному переході.
 *
 * Тексти беруться з SEO у config/site.js — тобто з того самого місця,
 * що й у збірці, і розʼїхатись вони не можуть.
 */
export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const known = SEO[pathname]
    const meta = known ?? SEO.notFound
    const url = pageUrl(pathname)

    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', url)

    // На невідомій адресі (404) canonical прибираємо: він вказував би на
    // сторінку, якої не існує. Замість нього — заборона індексації.
    setCanonical(known ? url : null)
    setMeta('name', 'robots', known ? 'index, follow' : 'noindex')

    trackPageView(meta.title)
  }, [pathname])
}

/** Оновлює <meta ...> або створює його, якщо тега ще немає. */
function setMeta(keyName, keyValue, content) {
  let tag = document.head.querySelector(`meta[${keyName}="${keyValue}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(keyName, keyValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Canonical каже Google, яку адресу вважати основною для цієї сторінки.
 * href === null — тег прибирається зовсім.
 */
function setCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]')

  if (href === null) {
    existing?.remove()
    return
  }

  const link = existing ?? document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }))
  link.href = href
}

/**
 * Рахує перегляд сторінки в Google Analytics.
 * У збірці лічильник налаштований з send_page_view: false, тож переходи
 * всередині сайту рахуються звідси — інакше вони або губились би, або
 * перша сторінка рахувалась двічі.
 * Якщо ANALYTICS.ga4 порожній, gtag на сторінці немає і виклик просто мовчить.
 */
function trackPageView(title) {
  if (!ANALYTICS.ga4 || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  })
}
