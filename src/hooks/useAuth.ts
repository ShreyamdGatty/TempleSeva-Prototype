import { useState, useCallback } from 'react'
import type { User } from '../types'
import { STORAGE_USER, STORAGE_SESSION } from '../data'
import { readJson } from '../utils/storage'

export function useAuth() {
  const [registeredUser, setRegisteredUser] = useState<User | null>(() =>
    readJson<User | null>(STORAGE_USER, null)
  )

  const [user, setUser] = useState<User | null>(() =>
    window.localStorage.getItem(STORAGE_SESSION) === 'true'
      ? readJson<User | null>(STORAGE_USER, null)
      : null
  )

  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)

  const login = useCallback((account: User) => {
    window.localStorage.setItem(STORAGE_SESSION, 'true')
    setUser(account)
    setAuthMode(null)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_SESSION)
    setUser(null)
  }, [])

  const register = useCallback((account: User) => {
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(account))
    setRegisteredUser(account)
  }, [])

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) {
        const guestUser: User = {
          name: updates.name || (updates.firstName ? `${updates.firstName} ${updates.lastName || ''}`.trim() : 'Devotee Guest'),
          email: updates.email || 'guest@templeseva.com',
          password: 'guest-password',
          ...updates,
        }
        setUser(guestUser)
        setRegisteredUser(guestUser)
        window.localStorage.setItem(STORAGE_USER, JSON.stringify(guestUser))
        window.localStorage.setItem(STORAGE_SESSION, 'true')
        return
      }
      const updated = { ...user, ...updates }
      setUser(updated)
      setRegisteredUser(updated)
      window.localStorage.setItem(STORAGE_USER, JSON.stringify(updated))
    },
    [user]
  )

  return { user, registeredUser, authMode, setAuthMode, login, logout, register, updateUser }
}
