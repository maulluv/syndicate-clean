import { Routes, Route, Navigate } from 'react-router-dom'
import { OrderModalProvider } from '@/context/OrderModalContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import Chemistry from '@/pages/Chemistry'
import Contacts from '@/pages/Contacts'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <OrderModalProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/poslugy" element={<Services />} />
          <Route path="/himiya" element={<Chemistry />} />
          <Route path="/kontakty" element={<Contacts />} />

          {/* Сторінка «Відгуки» тимчасово прихована (див. src/pages/Reviews).
              Стара адреса не має віддавати порожнечу — ведемо на головну. */}
          <Route path="/vidguky" element={<Navigate to="/" replace />} />

          {/* Будь-яка інша адреса — 404 замість порожньої сторінки */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </OrderModalProvider>
  )
}
