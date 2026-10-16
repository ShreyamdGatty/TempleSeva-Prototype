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
    (seva: Seva, selectedDate: string, onNotice: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void) => {
      if (!selectedDate) {
        onNotice('Choose a date before adding a Seva.', 'warning')
        return
      }
      if (seva.requiresDevotee) {
        setDevoteeSeva(seva)
        return
      }
      setCart((items) => {
        const existing = items.find((item) => item.id === seva.id)
        return existing
          ? items.map((item) =>
              item.id === seva.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...items, { id: seva.id, seva, quantity: 1 }]
      })
      onNotice(`${seva.name} added to cart`, 'success')
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

  const changeQty = useCallback((id: string, amount: number) => {
    setCart((items) =>
      items.flatMap((item) =>
        item.id === id
          ? item.quantity + amount > 0
            ? [{ ...item, quantity: item.quantity + amount }]
            : []
          : [item]
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
    addSeva, addDevoteeSeva, changeQty, removeItem,
    saveForLater, moveToCart, removeSaved,
    applyCoupon, removeCoupon, clearCart,
  }
}
