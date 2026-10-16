import { useState, useCallback } from 'react'
import { STORAGE_WISHLIST } from '../data'
import { readJson } from '../utils/storage'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readJson<string[]>(STORAGE_WISHLIST, [])
  )

  const toggle = useCallback((sevaId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(sevaId) ? prev.filter((id) => id !== sevaId) : [...prev, sevaId]
      window.localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(next))
      return next
    })
  }, [])

  const isWished = useCallback((sevaId: string) => wishlist.includes(sevaId), [wishlist])

  return { wishlist, toggle, isWished }
}
