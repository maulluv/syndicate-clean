import { Routes, Route, Navigate } from 'react-router-dom'
import { OrderModalProvider } from '@/context/OrderModalContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import Chemistry from '@/pages/Chemistry'
import Contacts from '@/pages/Contacts'
import Works from '@/pages/Works'
import NotFound from '@/pages/NotFound'
import { HAS_WORKS, WORKS_PATH } from '@/config/site'

export default function App() {
  return (
    <OrderModalProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/poslugy" element={<Services />} />
          <Route path="/himiya" element={<Chemistry />} />
          <Route path="/kontakty" element={<Contacts />} />

          {/* «Наші роботи» зʼявляються самі, щойно в config/site.js буде
              перше фото «до/після» чи скріншот подяки. Поки їх немає,
              маршрут не реєструється — сторінки просто не існує.

              Шлях береться константою, а не рядком: так перевірка в
              scripts/generate-seo.mjs не вважає його маршрутом, забутим
              у SEO, поки сторінка вимкнена. */}
          {HAS_WORKS && <Route path={WORKS_PATH} element={<Works />} />}

          {/* Стара сторінка «Відгуки» більше не існує — її замінили «Наші
              роботи». Адреса лишається робочою, щоб старі посилання не
              вели в нікуди. */}
          <Route
            path="/vidguky"
            element={<Navigate to={HAS_WORKS ? WORKS_PATH : '/'} replace />}
          />

          {/* Будь-яка інша адреса — 404 замість порожньої сторінки */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </OrderModalProvider>
  )
}
