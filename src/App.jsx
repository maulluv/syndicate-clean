import { Routes, Route, Navigate } from 'react-router-dom'
import { OrderModalProvider } from '@/context/OrderModalContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import Service from '@/pages/Service'
import Chemistry from '@/pages/Chemistry'
import Contacts from '@/pages/Contacts'
import Works from '@/pages/Works'
import Process from '@/pages/Process'
import NotFound from '@/pages/NotFound'
import { HAS_WORKS, WORKS_PATH, HAS_PROCESS, PROCESS_PATH, SERVICE_BASE } from '@/config/site'

export default function App() {
  return (
    <OrderModalProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/poslugy" element={<Services />} />

          {/* Окрема сторінка кожної послуги: /poslugy/chyshchennya-dyvaniv.
              Шлях складається з константи, а не пишеться рядком, — так
              перевірка маршрутів у збірці не сприймає його як забутий у SEO
              (записи туди генеруються зі списку послуг). */}
          <Route path={`${SERVICE_BASE}/:slug`} element={<Service />} />
          <Route path="/himiya" element={<Chemistry />} />
          <Route path="/kontakty" element={<Contacts />} />

          {/* «Як ми працюємо» зʼявляється сама, щойно в config/site.js
              бодай в одному кроці буде ролик. Шлях константою — щоб
              перевірка маршрутів у збірці не вважала його забутим у SEO,
              поки сторінка вимкнена. */}
          {HAS_PROCESS && <Route path={PROCESS_PATH} element={<Process />} />}

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
