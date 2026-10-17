import { useState, useCallback } from 'react'
import type { Order, Temple, CartItem, Address, OrderTimelineEvent } from '../types'
import { STORAGE_ORDERS, temples, sevas } from '../data'
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

function getInitialSampleOrders(): Order[] {
  const meenakshiTemple = temples[0] || { id: 'meenakshi', name: 'Shree Meenakshi Temple', location: 'Madurai, Tamil Nadu', image: '/temple-hero.webp', description: '' }
  const tirupatiTemple = temples[1] || { id: 'venkateswara', name: 'Sri Venkateswara Swamy', location: 'Tirupati, Andhra Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=85', description: '' }
  const kashiTemple = temples[2] || { id: 'kashi', name: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85', description: '' }

  const meenSeva = sevas.find((s) => s.id === 'meenakshi-abhishekam') || sevas[0]
  const tiruSeva = sevas.find((s) => s.id === 'tirupati-suprabhatham') || sevas[4] || sevas[0]
  const kashiSeva = sevas.find((s) => s.id === 'kashi-rudrabhishekam') || sevas[8] || sevas[0]

  return [
    {
      id: 'TS-MEEN-7821',
      temple: meenakshiTemple,
      date: '28 Oct 2026',
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      paymentMethod: 'UPI / QR Pass',
      subtotal: meenSeva.price,
      discount: 0,
      total: meenSeva.price,
      items: [
        {
          id: 'item-sample-meen-1',
          seva: meenSeva,
          quantity: 1,
          date: '28 Oct 2026',
          slot: '06:30 AM - Pratah Abhishekam',
          devotee: { id: 'dev-1', name: 'Srinivasan Iyer', nakshatra: 'Rohini', rashi: 'Vrishabha', gotram: 'Kashyapa' },
        },
      ],
      timeline: [
        { label: 'Order Placed', time: 'Today, 08:30 AM', description: 'Seva confirmed at Madurai Meenakshi sanctum.', completed: true },
        { label: 'Payment Verified', time: 'Today, 08:31 AM', description: 'UPI dakshina verified.', completed: true },
        { label: 'Temple Notified', time: 'Today, 08:32 AM', description: 'Archaka assigned for morning sankalpam.', completed: true },
        { label: 'Seva Scheduled', time: '28 Oct 2026, 06:30 AM', description: 'Sundareswarar Abhishekam scheduled.', completed: false },
        { label: 'Seva Completed', time: '', description: 'Holy vibhuti prasadam packing upon completion.', completed: false },
      ],
    },
    {
      id: 'TS-TIRU-4392',
      temple: tirupatiTemple,
      date: '29 Oct 2026',
      status: 'Cancelled',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      paymentMethod: 'UPI / QR Pass',
      subtotal: tiruSeva.price,
      discount: 0,
      total: tiruSeva.price,
      items: [
        {
          id: 'item-sample-tiru-1',
          seva: tiruSeva,
          quantity: 1,
          date: '29 Oct 2026',
          slot: '03:00 AM - Suprabhatha Seva',
          devotee: { id: 'dev-2', name: 'Ananya Sharma', nakshatra: 'Ashwini', rashi: 'Mesha', gotram: 'Bharadwaja' },
        },
      ],
      timeline: [
        { label: 'Order Cancelled', time: 'Yesterday, 04:15 PM', description: 'Booking cancelled by devotee. Slot released.', completed: true },
        { label: 'Refund Processed', time: 'Yesterday, 04:30 PM', description: 'Dakshina reversed to original payment mode.', completed: true },
        { label: 'Temple Notified', time: 'Yesterday, 04:31 PM', description: 'Slot vacated for waitlisted devotees.', completed: true },
        { label: 'Seva Scheduled', time: '', description: 'Cancelled', completed: false },
        { label: 'Seva Completed', time: '', description: 'Cancelled', completed: false },
      ],
    },
    {
      id: 'TS-KASH-9120',
      temple: kashiTemple,
      date: '30 Oct 2026',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      paymentMethod: 'Net Banking',
      subtotal: kashiSeva.price,
      discount: 0,
      total: kashiSeva.price,
      items: [
        {
          id: 'item-sample-kash-1',
          seva: kashiSeva,
          quantity: 1,
          date: '30 Oct 2026',
          slot: '07:00 AM - Ganga Abhishekam',
          devotee: { id: 'dev-3', name: 'Vijay Anand', nakshatra: 'Uttara', rashi: 'Kanya', gotram: 'Vashishta' },
        },
      ],
      timeline: [
        { label: 'Order Placed', time: 'Today, 06:00 AM', description: 'Rudrabhisheka booking received.', completed: true },
        { label: 'Payment Verified', time: 'Today, 06:01 AM', description: 'Dakshina verified successfully.', completed: true },
        { label: 'Temple Notified', time: 'Today, 06:15 AM', description: 'Varanasi Jyotirlinga sanctum assigned priest.', completed: true },
        { label: 'Seva In Preparation', time: 'Today, 07:00 AM', description: 'Sacred Ganga theertha and bilva patra prepared.', completed: true },
        { label: 'Seva Completed', time: '', description: 'Awaiting sanctum completion and prasadam packaging.', completed: false },
      ],
    },
  ]
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const existing = readJson<Order[]>(STORAGE_ORDERS, [])
    if (existing && existing.length > 0) return existing
    const initial = getInitialSampleOrders()
    window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(initial))
    return initial
  })
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
        temple,
        date,
        items,
        subtotal,
        discount,
        total,
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
              timeline: [
                {
                  label: 'Order Cancelled',
                  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  description: 'Booking cancelled by devotee. Slot released.',
                  completed: true,
                },
                ...o.timeline.slice(1).map((t) => ({ ...t, completed: false })),
              ],
            }
          : o
      )
      setOrders(updated)
      window.localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated))
    },
    [orders]
  )

  const reorder = useCallback((order: Order) => {
    return order.items
  }, [])

  return { orders, ordersOpen, setOrdersOpen, trackingOrder, setTrackingOrder, createOrder, cancelOrder, reorder }
}
