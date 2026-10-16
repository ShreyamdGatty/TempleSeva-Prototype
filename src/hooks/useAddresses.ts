import { useState, useCallback } from 'react'
import { STORAGE_ADDRESSES } from '../data'
import { readJson } from '../utils/storage'
import type { Address } from '../types'

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(() =>
    readJson<Address[]>(STORAGE_ADDRESSES, [])
  )

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`
    setAddresses((prev) => {
      const updated = address.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev
      const next = [...updated, { ...address, id }]
      window.localStorage.setItem(STORAGE_ADDRESSES, JSON.stringify(next))
      return next
    })
  }, [])

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id)
      window.localStorage.setItem(STORAGE_ADDRESSES, JSON.stringify(next))
      return next
    })
  }, [])

  const setDefault = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.map((a) => ({ ...a, isDefault: a.id === id }))
      window.localStorage.setItem(STORAGE_ADDRESSES, JSON.stringify(next))
      return next
    })
  }, [])

  const defaultAddress = addresses.find((a) => a.isDefault) ?? null

  return { addresses, defaultAddress, addAddress, removeAddress, setDefault }
}
