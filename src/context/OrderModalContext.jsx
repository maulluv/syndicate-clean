import { createContext, useContext, useState, useCallback } from 'react'
import OrderModal from '@/components/OrderModal'

const OrderModalContext = createContext(null)

/**
 * Провайдер модалки замовлення.
 * Обгортаємо ним застосунок — і будь-де можна викликати:
 *   const openOrder = useOrderModal()
 *   <Button onClick={openOrder}>Замовити</Button>
 *
 * Відкрити одразу на потрібній вкладці або з готовим розрахунком:
 *   openOrder({ tab: 'photo' })
 *   openOrder({ service: 'sofa' })
 *   openOrder({ calc: 'Кутовий диван × 1 — 2200 грн\nРазом: 2200 грн' })
 *
 * Стан скидається при закритті, щоб наступне відкриття не показало
 * розрахунок від попереднього разу.
 */
export function OrderModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [payload, setPayload] = useState(null)

  const open = useCallback((next) => {
    // onClick передає в обробник подію — її за налаштування вважати не можна
    setPayload(next && !next.nativeEvent && typeof next === 'object' ? next : null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setPayload(null)
  }, [])

  return (
    <OrderModalContext.Provider value={open}>
      {children}
      <OrderModal
        isOpen={isOpen}
        onClose={close}
        initialTab={payload?.tab}
        calc={payload?.calc}
        service={payload?.service}
      />
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
