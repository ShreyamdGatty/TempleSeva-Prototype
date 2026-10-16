import { useState, useCallback, useEffect } from 'react'
import { STORAGE_DEVOTEES } from '../data'
import { readJson } from '../utils/storage'
import type { Devotee } from '../types'

export function useDevotees(initialUserName?: string) {
  const [devotees, setDevotees] = useState<Devotee[]>(() => {
    const saved = readJson<Devotee[]>(STORAGE_DEVOTEES, [])
    if (saved && saved.length > 0) return saved
    if (initialUserName) {
      const initialDevotee: Devotee = {
        id: `dev-${Date.now()}`,
        name: initialUserName,
        nakshatra: 'Rohini',
        rashi: 'Vrishabha (Taurus)',
        gotram: 'Kashyapa',
        relationship: 'Self',
      }
      return [initialDevotee]
    }
    return []
  })

  // Synchronize with localStorage
  useEffect(() => {
    if (devotees.length > 0) {
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(devotees))
    }
  }, [devotees])

  const addDevotee = useCallback((data: Omit<Devotee, 'id'>) => {
    const newDevotee: Devotee = {
      ...data,
      id: `dev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }
    setDevotees((prev) => {
      const next = [...prev, newDevotee]
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
      return next
    })
    return newDevotee
  }, [])

  const updateDevotee = useCallback((id: string, updated: Partial<Devotee>) => {
    setDevotees((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
      return next
    })
  }, [])

  const removeDevotee = useCallback((id: string) => {
    setDevotees((prev) => {
      const next = prev.filter((d) => d.id !== id)
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
      return next
    })
  }, [])

  return {
    devotees,
    addDevotee,
    updateDevotee,
    removeDevotee,
  }
}
