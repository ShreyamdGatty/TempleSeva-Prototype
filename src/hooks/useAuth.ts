import { useState, useCallback } from 'react'
import type { User } from '../types'
import { STORAGE_USER, STORAGE_SESSION } from '../data'
import { readJson } from '../utils/storage'

export const DEFAULT_DEMO_USER: User = {
  name: 'Shreya Gatty',
  email: 'shreyamd2002@gmail.com',
  password: 'password123',
  phone: '+91 94800 12345',
}

export function useAuth() {
  const [registeredUser, setRegisteredUser] = useState<User | null>(() => {
    const saved = readJson<User | null>(STORAGE_USER, null)
    if (saved) return saved
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(DEFAULT_DEMO_USER))
    return DEFAULT_DEMO_USER
  })

  const [user, setUser] = useState<User | null>(() =>
    window.localStorage.getItem(STORAGE_SESSION) === 'true'
      ? readJson<User | null>(STORAGE_USER, null) || DEFAULT_DEMO_USER
      : null
  )

  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)

  const login = useCallback((account: User) => {
    window.localStorage.setItem(STORAGE_SESSION, 'true')
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(account))
    setRegisteredUser(account)
    setUser(account)
    setAuthMode(null)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_SESSION)
    setUser(null)
    // Note: STORAGE_USER and registeredUser are preserved so the user can log in again using the same credentials
  }, [])

  const register = useCallback((account: User) => {
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(account))
    const users = readJson<User[]>('temple-seva.users_list', [])
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === account.email.toLowerCase()
    )
    if (existingIndex >= 0) {
      users[existingIndex] = account
    } else {
      users.push(account)
    }
    window.localStorage.setItem('temple-seva.users_list', JSON.stringify(users))
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
