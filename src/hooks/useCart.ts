import { useState, useCallback, useMemo } from 'react'
import type { Seva, CartItem, Devotee, Coupon } from '../types'
import { coupons } from '../data'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([])
  const [devoteeSeva, setDevoteeSeva] = useState<Seva | null>(null)
  const [devotee, setDevotee] = useState<Devotee>({ name: '', nakshatra: '', rashi: '', gotram: '' })
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.seva.price * item.quantity, 0),
    [cart]
  )

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'flat') return appliedCoupon.discount
    return Math.round((subtotal * appliedCoupon.discount) / 100)
  }, [appliedCoupon, subtotal])

  const total = useMemo(() => Math.max(subtotal - discount, 0), [subtotal, discount])

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const addSeva = useCallback(
    (
      seva: Seva,
      selectedDate: string,
      slotOrNotice?: string | ((msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void),
      maybeNotice?: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
    ) => {
      const slot = typeof slotOrNotice === 'string' ? slotOrNotice : (seva.availableSlots && seva.availableSlots[0]) || '07:00 AM - Morning Pooja'
      const onNotice = typeof slotOrNotice === 'function' ? slotOrNotice : maybeNotice

      const now = new Date()
      const fallbackDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })}`
      const effectiveDate = selectedDate || fallbackDate

      const maxQty = seva.maxQuantity || 5

      setCart((items) => {
        const existingIndex = items.findIndex(
          (item) => item.seva.id === seva.id && (!item.slot || item.slot === slot)
        )
        if (existingIndex > -1) {
          const currentQty = items[existingIndex].quantity
          if (currentQty >= maxQty) {
            if (onNotice) onNotice(`Maximum booking limit of ${maxQty} reached for this seva.`, 'warning')
            return items
          }
          const updated = [...items]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: currentQty + 1,
            slot: slot || updated[existingIndex].slot,
            date: effectiveDate || updated[existingIndex].date,
          }
          if (onNotice) onNotice(`${seva.name} quantity updated (${currentQty + 1})`, 'success')
          return updated
        }

        if (onNotice) onNotice(`${seva.name} added to cart`, 'success')
        return [
          ...items,
          {
            id: `${seva.id}-${Date.now()}`,
            seva,
            quantity: 1,
            date: effectiveDate,
            slot,
          },
        ]
      })
    },
    []
  )

  const addDevoteeSeva = useCallback(
    (onNotice: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void) => {
      if (!devotee.name || !devotee.nakshatra || !devotee.rashi || !devoteeSeva) return
      setCart((items) => [
        ...items,
        { id: `${devoteeSeva.id}-${Date.now()}`, seva: devoteeSeva, quantity: 1, devotee: { ...devotee } },
      ])
      onNotice(`${devoteeSeva.name} added with devotee details`, 'success')
      setDevoteeSeva(null)
      setDevotee({ name: '', nakshatra: '', rashi: '', gotram: '' })
    },
    [devotee, devoteeSeva]
  )

  const changeQty = useCallback(
    (id: string, amount: number, onNotice?: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void) => {
      setCart((items) =>
        items.flatMap((item) => {
          if (item.id !== id) return [item]
          const maxQty = item.seva.maxQuantity || 5
          const nextQty = item.quantity + amount
          if (amount > 0 && nextQty > maxQty) {
            if (onNotice) onNotice(`Maximum limit of ${maxQty} reached for ${item.seva.name}.`, 'warning')
            return [item]
          }
          return nextQty > 0 ? [{ ...item, quantity: nextQty }] : []
        })
      )
    },
    []
  )

  const updateItemDevotees = useCallback((id: string, ticketDevotees: Devotee[]) => {
    setCart((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              ticketDevotees,
              devotee: ticketDevotees[0] || item.devotee,
            }
          : item
      )
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart((items) => items.filter((item) => item.id !== id))
  }, [])

  const saveForLater = useCallback((id: string) => {
    setCart((items) => {
      const item = items.find((i) => i.id === id)
      if (item) setSavedForLater((s) => [...s, item])
      return items.filter((i) => i.id !== id)
    })
  }, [])

  const moveToCart = useCallback((id: string) => {
    setSavedForLater((items) => {
      const item = items.find((i) => i.id === id)
      if (item) setCart((c) => [...c, item])
      return items.filter((i) => i.id !== id)
    })
  }, [])

  const removeSaved = useCallback((id: string) => {
    setSavedForLater((items) => items.filter((i) => i.id !== id))
  }, [])

  const applyCoupon = useCallback(
    (code: string): boolean => {
      setCouponError('')
      const coupon = coupons.find((c) => c.code.toLowerCase() === code.toLowerCase())
      if (!coupon) {
        setCouponError('Invalid coupon code')
        return false
      }
      if (subtotal < coupon.minAmount) {
        setCouponError(`Minimum order ₹${coupon.minAmount} required`)
        return false
      }
      setAppliedCoupon(coupon)
      return true
    },
    [subtotal]
  )

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
    setCouponError('')
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setAppliedCoupon(null)
    setCouponError('')
  }, [])

  return {
    cart, savedForLater, subtotal, discount, total, itemCount,
    devoteeSeva, setDevoteeSeva, devotee, setDevotee,
    appliedCoupon, couponError,
    addSeva, addDevoteeSeva, changeQty, removeItem, updateItemDevotees,
    saveForLater, moveToCart, removeSaved,
    applyCoupon, removeCoupon, clearCart,
  }
}
