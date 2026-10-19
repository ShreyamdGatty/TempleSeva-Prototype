import { useState, useCallback, useEffect, useMemo } from 'react'
import { STORAGE_DEVOTEES } from '../data'
import { readJson } from '../utils/storage'
import type { Devotee } from '../types'

function getInitialSampleDevotees(initialUserName?: string): Devotee[] {
  return [
    {
      id: 'dev-meen-1',
      templeId: 'meenakshi',
      name: initialUserName || 'Srinivasan Iyer',
      nakshatra: 'Rohini',
      rashi: 'Vrishabha (Taurus)',
      gotram: 'Kashyapa',
      relationship: 'Self',
    },
    {
      id: 'dev-tiru-1',
      templeId: 'venkateswara',
      name: initialUserName || 'Ananya Sharma',
      nakshatra: 'Ashwini',
      rashi: 'Mesha (Aries)',
      gotram: 'Bharadwaja',
      relationship: 'Self',
    },
    {
      id: 'dev-kash-1',
      templeId: 'kashi',
      name: initialUserName || 'Vijay Anand',
      nakshatra: 'Uttara Phalguni',
      rashi: 'Kanya (Virgo)',
      gotram: 'Vashishta',
      relationship: 'Self',
    },
  ]
}

export function useDevotees(initialUserName?: string, activeTempleId: string = 'meenakshi') {
  const [allDevotees, setAllDevotees] = useState<Devotee[]>(() => {
    const saved = readJson<Devotee[]>(STORAGE_DEVOTEES, [])
    if (saved && saved.length > 0) {
      // Ensure existing devotees have templeId (defaulting legacy ones to meenakshi)
      const hasTempleIds = saved.some((d) => !!d.templeId)
      if (hasTempleIds) return saved
      const migrated = saved.map((d) => ({ ...d, templeId: d.templeId || 'meenakshi' }))
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(migrated))
      return migrated
    }
    const initial = getInitialSampleDevotees(initialUserName)
    window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(initial))
    return initial
  })

  // Synchronize with localStorage
  useEffect(() => {
    if (allDevotees.length > 0) {
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(allDevotees))
    }
  }, [allDevotees])

  // Filter devotees for the active temple only
  const devotees = useMemo(() => {
    return allDevotees.filter((d) => !d.templeId || d.templeId === activeTempleId)
  }, [allDevotees, activeTempleId])

  const addDevotee = useCallback(
    (data: Omit<Devotee, 'id'>) => {
      const newDevotee: Devotee = {
        ...data,
        templeId: data.templeId || activeTempleId || 'meenakshi',
        id: `dev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      }
      setAllDevotees((prev) => {
        const next = [...prev, newDevotee]
        window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
        return next
      })
      return newDevotee
    },
    [activeTempleId]
  )

  const updateDevotee = useCallback((id: string, updated: Partial<Devotee>) => {
    setAllDevotees((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
      return next
    })
  }, [])

  const removeDevotee = useCallback((id: string) => {
    setAllDevotees((prev) => {
      const next = prev.filter((d) => d.id !== id)
      window.localStorage.setItem(STORAGE_DEVOTEES, JSON.stringify(next))
      return next
    })
  }, [])

  return {
    devotees,
    allDevotees,
    addDevotee,
    updateDevotee,
    removeDevotee,
  }
}

