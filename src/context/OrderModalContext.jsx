import { createContext, useContext, useState, useCallback } from 'react'
import OrderModal from '@/components/OrderModal'

const OrderModalContext = createContext(null)

/**
 * Провайдер модалки замовлення.
 * Обгортаємо ним застосунок — і будь-де можна викликати:
 *   const openOrder = useOrderModal()
 *   <Button onClick={openOrder}>Замовити</Button>
 */
export function OrderModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <OrderModalContext.Provider value={open}>
      {children}
      <OrderModal isOpen={isOpen} onClose={close} />
    </OrderModalContext.Provider>
  )
}

/** Повертає функцію відкриття модалки замовлення. */
export function useOrderModal() {
  const ctx = useContext(OrderModalContext)
  if (ctx === null) {
    throw new Error('useOrderModal має використовуватись усередині <OrderModalProvider>')
  }
  return ctx
}
