import { Routes, Route } from 'react-router-dom'
import { OrderModalProvider } from '@/context/OrderModalContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import Chemistry from '@/pages/Chemistry'
import Reviews from '@/pages/Reviews'
import Contacts from '@/pages/Contacts'

export default function App() {
  return (
    <OrderModalProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/poslugy" element={<Services />} />
          <Route path="/himiya" element={<Chemistry />} />
          <Route path="/vidguky" element={<Reviews />} />
          <Route path="/kontakty" element={<Contacts />} />
        </Route>
      </Routes>
    </OrderModalProvider>
  )
}
