import { useState, useCallback } from 'react'
import type { Order, Temple, CartItem, Address, Coupon, OrderTimelineEvent } from '../types'
import { STORAGE_ORDERS } from '../data'
import { readJson } from '../utils/storage'
import { generateOrderId } from '../utils/helpers'

function buildTimeline(createdAt: string): OrderTimelineEvent[] {
  const d = new Date(createdAt)
  return [
    { label: 'Order Placed', time: d.toLocaleString('en-IN'), description: 'Your seva booking has been confirmed.', completed: true },
    { label: 'Payment Verified', time: new Date(d.getTime() + 60000).toLocaleString('en-IN'), description: 'Payment received and verified successfully.', completed: true },
    { label: 'Temple Notified', time: new Date(d.getTime() + 120000).toLocaleString('en-IN'), description: 'The temple has been notified of your booking.', completed: true },
    { label: 'Seva Scheduled', time: '', description: 'Your seva will be performed on the selected date.', completed: false },
    { label: 'Seva Completed', time: '', description: 'The seva has been completed. Prasadam will be dispatched.', completed: false },
  ]
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => readJson<Order[]>(STORAGE_ORDERS, []))
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null)

  const createOrder = useCallback(
    (
      temple: Temple,
      date: string,
      items: CartItem[],
      subtotal: number,
      discount: number,
      total: number,
      paymentMethod: string,
      address?: Address,
      couponCode?: string
    ): Order => {
      const createdAt = new Date().toISOString()
      const order: Order = {
        id: generateOrderId(),
        temple, date, items, subtotal, discount, total,
        status: 'Confirmed',
        createdAt,
        timeline: buildTimeline(createdAt),
        paymentMethod,
        address,
        couponCode,
      }
      const updated = [order, ...orders]
      setOrders(updated)
      window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated))
      return order
    },
    [orders]
  )

  const cancelOrder = useCallback(
    (orderId: string) => {
      const updated = orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled' as const,
              timeline: o.timeline.map((t) =>
                t.label === 'Order Placed'
                  ? { ...t, label: 'Order Cancelled', description: 'This order has been cancelled.' }
                  : { ...t, completed: false }
              ),
            }
          : o
      )
      setOrders(updated)
      window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated))
    },
    [orders]
  )

  const reorder = useCallback(
    (order: Order) => {
      return order.items
    },
    []
  )

  return { orders, ordersOpen, setOrdersOpen, trackingOrder, setTrackingOrder, createOrder, cancelOrder, reorder }
}
