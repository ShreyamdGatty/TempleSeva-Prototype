import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { User, Address, Devotee, Seva } from '../../types'
import { useLanguage } from '../../contexts/LanguageContext'
import { nakshatras, rashis, sevas } from '../../data'
import { useDevotees } from '../../hooks/useDevotees'
import { useWishlist } from '../../hooks/useWishlist'
import { formatPrice } from '../../utils/helpers'
import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown'
import { IonIcon } from '../../components/IonIcon'

interface ProfilePageProps {
  user: User | null
  addresses?: Address[]
  onUpdateUser: (updates: Partial<User>) => void
  onWishlist?: () => void
  onOrders: () => void
  onOpenQrPass?: () => void
  onOpenSideMenu: () => void
  onLogout: () => void
  showToast: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
  onDevoteeDetails?: () => void
  onSwitchTemple?: () => void
  onSevas?: () => void
  wishlist?: string[]
  onToggleWishlist?: (sevaId: string) => void
  onAddToCart?: (seva: Seva) => void
  selectedTemple?: import('../../types').Temple | null
  orders?: import('../../types').Order[]
  devotees?: Devotee[]
  onAddDevotee?: (data: Omit<Devotee, 'id'>) => Devotee
  onUpdateDevotee?: (id: string, updated: Partial<Devotee>) => void
  onRemoveDevotee?: (id: string) => void
}

const ProfilePage = ({
  user,
  addresses: _addresses = [],
  onUpdateUser,
  onWishlist: _onWishlist,
  onOrders,
  onOpenQrPass,
  onOpenSideMenu,
  onLogout,
  showToast,
  onSwitchTemple,
  onSevas,
  wishlist: propWishlist,
  onToggleWishlist,
  onAddToCart,
  selectedTemple,
  orders: propOrders = [],
  devotees: propDevotees,
  onAddDevotee: propAddDevotee,
  onUpdateDevotee: propUpdateDevotee,
  onRemoveDevotee: propRemoveDevotee,
}: ProfilePageProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, setLanguage, toggleLanguage, t, translateSeva, translateTemple } = useLanguage()

  // Active temple scoping
  const activeTemple = selectedTemple || { id: 'meenakshi', name: 'Shree Meenakshi Temple', location: 'Madurai, Tamil Nadu', image: '/temple-hero.webp', description: '' }
  const localizedActiveTemple = translateTemple(activeTemple)

  // Wishlist state and handlers (scoped to the currently selected temple)
  const fallbackWishlist = useWishlist()
  const currentWishlist = propWishlist !== undefined ? propWishlist : fallbackWishlist.wishlist
  const handleToggleWish = (sevaId: string) => {
    if (onToggleWishlist) {
      onToggleWishlist(sevaId)
    } else {
      fallbackWishlist.toggle(sevaId)
    }
  }
  const wishlistedSevas = sevas.filter((s) => currentWishlist.includes(s.id) && s.templeId === activeTemple.id)

  // State to track sevas currently being removed (to display white heart before removal)
  const [removingWishlistIds, setRemovingWishlistIds] = useState<string[]>([])

  const handleRemoveWishlistItem = (sevaId: string, sevaName: string) => {
    // Turn heart white immediately
    setRemovingWishlistIds((prev) => [...prev, sevaId])

    setTimeout(() => {
      handleToggleWish(sevaId)
      setRemovingWishlistIds((prev) => prev.filter((id) => id !== sevaId))
      showToast(
        language === 'KN'
          ? `${sevaName} ಮೆಚ್ಚಿನವುಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ`
          : `${sevaName} removed from wishlist`,
        'info'
      )
    }, 350)
  }

  // Active tab in "My Account" sidebar: 'profile' | 'add-devotee' | 'devotee-list' | 'wishlist'
  const getInitialTab = (): 'profile' | 'add-devotee' | 'devotee-list' | 'wishlist' => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    const state = location.state as { tab?: string } | null
    const chosen = tabParam || state?.tab
    if (chosen === 'devotee-list' || chosen === 'devotees') return 'devotee-list'
    if (chosen === 'add-devotee') return 'add-devotee'
    if (chosen === 'wishlist' || chosen === 'favorites') return 'wishlist'
    return 'profile'
  }

  const [activeTab, setActiveTab] = useState<'profile' | 'add-devotee' | 'devotee-list' | 'wishlist'>(getInitialTab)

  const selectTab = (tab: 'profile' | 'add-devotee' | 'devotee-list' | 'wishlist') => {
    setActiveTab(tab)
    navigate(`/profile?tab=${tab}`, { replace: true, state: { tab } })
  }

  // Sync tab if URL query or state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    const state = location.state as { tab?: string } | null
    const chosen = tabParam || state?.tab
    if (chosen === 'devotee-list' || chosen === 'devotees') {
      setActiveTab('devotee-list')
    } else if (chosen === 'add-devotee') {
      setActiveTab('add-devotee')
    } else if (chosen === 'wishlist' || chosen === 'favorites') {
      setActiveTab('wishlist')
    } else if (chosen === 'profile') {
      setActiveTab('profile')
    }
  }, [location.search, location.state])

  // Devotee management via props or scoped hook for active temple
  const fallbackDevotees = useDevotees(user?.name, activeTemple.id)
  const devotees = propDevotees !== undefined ? propDevotees : fallbackDevotees.devotees
  const addDevotee = propAddDevotee || fallbackDevotees.addDevotee
  const updateDevotee = propUpdateDevotee || fallbackDevotees.updateDevotee
  const removeDevotee = propRemoveDevotee || fallbackDevotees.removeDevotee
  const [devoteeForm, setDevoteeForm] = useState({
    name: '',
    relationship: 'Self',
    nakshatra: '',
    rashi: '',
    gotram: '',
  })
  const [devoteeErrors, setDevoteeErrors] = useState<Record<string, boolean>>({})

  // Inline edit devotee state for Devotee List
  const [editingDevoteeId, setEditingDevoteeId] = useState<string | null>(null)
  const [editDevoteeForm, setEditDevoteeForm] = useState({
    name: '',
    relationship: 'Self',
    nakshatra: '',
    rashi: '',
    gotram: '',
  })
  const [editDevoteeErrors, setEditDevoteeErrors] = useState<Record<string, boolean>>({})

  const startEditingDevotee = (dev: Devotee) => {
    setEditingDevoteeId(dev.id!)
    setEditDevoteeForm({
      name: dev.name,
      relationship: dev.relationship || 'Self',
      nakshatra: dev.nakshatra || '',
      rashi: dev.rashi || '',
      gotram: dev.gotram || '',
    })
    setEditDevoteeErrors({})
  }

  const cancelEditingDevotee = () => {
    setEditingDevoteeId(null)
    setEditDevoteeErrors({})
  }

  const handleUpdateDevotee = (id: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!editDevoteeForm.name.trim()) {
      setEditDevoteeErrors({ name: true })
      showToast(language === 'KN' ? 'ದಯವಿಟ್ಟು ಭಕ್ತರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter devotee name', 'error')
      return
    }

    updateDevotee(id, {
      name: editDevoteeForm.name.trim(),
      templeId: activeTemple.id,
      relationship: editDevoteeForm.relationship,
      nakshatra: editDevoteeForm.nakshatra || '',
      rashi: editDevoteeForm.rashi || '',
      gotram: editDevoteeForm.gotram.trim() || undefined,
    })

    showToast(
      language === 'KN'
        ? `${editDevoteeForm.name} ಅವರ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!`
        : `Devotee ${editDevoteeForm.name} updated successfully!`,
      'success'
    )
    setEditingDevoteeId(null)
    setEditDevoteeErrors({})
  }

  const handleSaveDevotee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devoteeForm.name.trim()) {
      setDevoteeErrors({ name: true })
      showToast(language === 'KN' ? 'ದಯವಿಟ್ಟು ಭಕ್ತರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ' : 'Please enter devotee name', 'error')
      return
    }

    addDevotee({
      name: devoteeForm.name.trim(),
      templeId: activeTemple.id,
      relationship: devoteeForm.relationship,
      nakshatra: devoteeForm.nakshatra || '',
      rashi: devoteeForm.rashi || '',
      gotram: devoteeForm.gotram.trim() || undefined,
    })

    showToast(
      language === 'KN'
        ? `${devoteeForm.name} ಅವರ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!`
        : `Devotee ${devoteeForm.name} saved successfully!`,
      'success'
    )

    // Reset form
    setDevoteeForm({
      name: '',
      relationship: 'Family Member',
      nakshatra: '',
      rashi: '',
      gotram: '',
    })
    setDevoteeErrors({})
    // User stays on the Add Devotee form without navigating to devotee-list
  }

  // Edit states for Account Details
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

  // Split user name into first and last name if available
  const nameParts = (user?.name || '').trim().split(' ')
  const defaultFirst = user?.firstName || nameParts[0] || ''
  const defaultLast = user?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '')

  const [firstName, setFirstName] = useState(defaultFirst)
  const [lastName, setLastName] = useState(defaultLast)
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState(user?.email || 'shreyamd2002@gmail.com')
  const [birthday, setBirthday] = useState(user?.birthday || '')
  const [gender, setGender] = useState(user?.gender || '')

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim()) {
      showToast(language === 'KN' ? 'ಮೊದಲ ಹೆಸರು ಕಡ್ಡಾಯವಾಗಿದೆ' : 'First Name is mandatory', 'error')
      return
    }
    const fullName = lastName.trim() ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim()

    onUpdateUser({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      phone: user?.phone || phone.trim() || undefined,
      email: email.trim(),
    })

    setIsEditingEmail(false)
    showToast(language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Changes saved successfully!', 'success')
  }

  const displayName = firstName.trim() || user?.name || 'Guest'

  return (
    <div className="min-h-screen bg-[#fffcf6] text-[#34251e]">
      {/* ── Top Header (Temple Theme) ── */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-2xs">
        <div className="relative flex h-[74px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-left shrink-0 cursor-pointer"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap">
                {language === 'KN' ? (
                  <>
                    ಟೆಂಪಲ್<span className="text-[#c1440e]">ಸೇವಾ</span>
                  </>
                ) : (
                  <>
                    Temple<span className="text-[#c1440e]">Seva</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Centered Navigation Links: Home, Sevas */}
          <nav className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8 text-sm font-semibold text-[#5c4d41]">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
            >
              {t('navHome')}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSevas) {
                  onSevas()
                } else if (onSwitchTemple) {
                  onSwitchTemple()
                } else {
                  navigate('/sevas')
                }
              }}
              className="whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
            >
              {language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}
            </button>
          </nav>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            {/* User Profile Menu Trigger: Clicking Hi, {displayName} opens the profile menu */}
            {user ? (
              <button
                type="button"
                onClick={onOpenSideMenu}
                className="group flex items-center gap-2 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] pl-1 pr-3 py-1 text-xs font-semibold text-[#34251e] shadow-2xs transition hover:shadow-xs cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${displayName} - Profile & Menu`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#c1440e] to-[#d4a64a] text-white text-[10px] font-bold shadow-2xs">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-[#34251e] group-hover:text-[#c1440e] transition-colors truncate max-w-[80px] sm:max-w-none">
                  Hi, {displayName}
                </span>
                <svg
                  className="h-3.5 w-3.5 text-[#8b7a6d] group-hover:text-[#c1440e] transition-transform group-hover:translate-y-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#34251e]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#c1440e] to-[#d4a64a] text-white text-[10px] font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">Hi, {displayName}</span>
              </div>
            )}

            {/* Subtle Divider before Language Dropdown */}
            <span className="hidden sm:inline-block h-6 w-px bg-[#eadfd1]" />

            {/* Language Dropdown in Corner of Navbar */}
            <LanguageDropdown />

            {/* Mobile Hamburger Menu Button (Visible on screens < lg) */}
            <button
              type="button"
              onClick={onOpenSideMenu}
              className="flex lg:hidden items-center justify-center h-9 w-9 rounded-full border border-[#e0d3c5] bg-white text-[#5c4d41] hover:border-[#c1440e] hover:text-[#c1440e] transition shadow-2xs cursor-pointer ml-0.5"
              aria-label="Open mobile navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Two-Column Layout ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ── LEFT COLUMN: "My Account" Menu Card ── */}
          <aside className="w-full md:w-72 rounded-2xl bg-white p-4 shadow-sm border border-[#eadfd1] shrink-0">
            {/* Header: "My Account" + Close Button */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#eadfd1] px-2">
              <h2 className="font-serif text-xl font-bold text-[#34251e]">
                {language === 'KN' ? 'ನನ್ನ ಖಾತೆ' : 'My Account'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="grid h-8 w-8 place-items-center rounded-full text-base font-bold text-[#8b7a6d] hover:bg-[#f5ede2] hover:text-[#34251e] transition cursor-pointer"
                aria-label="Close"
                title="Home"
              >
                ✕
              </button>
            </div>


            {/* Menu Items */}
            <nav className="flex flex-row overflow-x-auto no-scrollbar gap-2 pb-1 md:flex-col md:space-y-1 text-sm font-medium">
              {/* Profile */}
              <button
                type="button"
                onClick={() => selectTab('profile')}
                className={`shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-[#fdf2e9] text-[#c1440e] font-bold'
                    : 'text-[#75685d] hover:bg-[#faf4ec]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#fdf2e9] text-[#c1440e]">
                    <IonIcon name="person-outline" className="text-sm text-[#c1440e]" />
                  </span>
                  <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}</span>
                </div>
                {activeTab === 'profile' ? (
                  <span className="text-xs">▸</span>
                ) : (
                  <IonIcon name="chevron-forward-outline" className="text-xs text-[#b5a496]" />
                )}
              </button>

              {/* Add Devotee */}
              <button
                type="button"
                onClick={() => selectTab('add-devotee')}
                className={`shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'add-devotee'
                    ? 'bg-[#fdf2e9] text-[#c1440e] font-bold border border-[#f5cb9e] md:border-transparent'
                    : 'text-[#75685d] hover:bg-[#faf4ec]'
                }`}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#fff0f3] text-[#c1440e]">
                    <IonIcon name="person-add-outline" className="text-sm text-[#c1440e]" />
                  </span>
                  <span className="font-medium text-[#34251e]">
                    {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ' : 'Add Devotee'}
                  </span>
                </div>
                {activeTab === 'add-devotee' ? (
                  <span className="hidden md:inline-block text-xs">▸</span>
                ) : (
                  <IonIcon name="chevron-forward-outline" className="hidden md:inline-block text-xs text-[#b5a496]" />
                )}
              </button>

              {/* Devotee List */}
              <button
                type="button"
                onClick={() => selectTab('devotee-list')}
                className={`shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'devotee-list'
                    ? 'bg-[#fdf2e9] text-[#c1440e] font-bold border border-[#f5cb9e] md:border-transparent'
                    : 'text-[#75685d] hover:bg-[#faf4ec]'
                }`}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#f5ede2] text-[#8b7a6d]">
                    <IonIcon name="people-outline" className="text-sm text-[#5c4d41]" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#34251e]">
                      {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ' : 'Devotee List'}
                    </span>
                    {devotees.length > 0 && (
                      <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-[10px] font-bold text-[#8b7a6d]">
                        {devotees.length}
                      </span>
                    )}
                  </div>
                </div>
                {activeTab === 'devotee-list' ? (
                  <span className="hidden md:inline-block text-xs">▸</span>
                ) : (
                  <IonIcon name="chevron-forward-outline" className="hidden md:inline-block text-xs text-[#b5a496]" />
                )}
              </button>

              {/* Your Orders */}
              <button
                type="button"
                onClick={() => onOrders()}
                className="shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 text-[#75685d] hover:bg-[#faf4ec] transition cursor-pointer whitespace-nowrap"
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#f5ede2] text-[#8b7a6d]">
                    <IonIcon name="receipt-outline" className="text-sm text-[#5c4d41]" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{language === 'KN' ? 'ನಿಮ್ಮ ಸೇವೆಗಳು (Your Orders)' : 'Your Orders'}</span>
                    {propOrders.length > 0 && (
                      <span className="rounded-full bg-[#e9f5ed] px-2 py-0.5 text-[10px] font-bold text-[#28724d]">
                        {propOrders.length}
                      </span>
                    )}
                  </div>
                </div>
                <IonIcon name="chevron-forward-outline" className="hidden md:inline-block text-xs text-[#b5a496]" />
              </button>

              {/* Your Wishlist */}
              <button
                type="button"
                onClick={() => selectTab('wishlist')}
                className={`shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'wishlist'
                    ? 'bg-[#fdf2e9] text-[#c1440e] font-bold border border-[#f5cb9e] md:border-transparent'
                    : 'text-[#75685d] hover:bg-[#faf4ec]'
                }`}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626]">
                    <IonIcon name="heart-outline" className="text-sm text-[#dc2626]" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#34251e]">
                      {language === 'KN' ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳು' : 'Your Wishlist'}
                    </span>
                    {wishlistedSevas.length > 0 && (
                      <span className="rounded-full bg-[#fdf2e9] px-2 py-0.5 text-[10px] font-bold text-[#c1440e]">
                        {wishlistedSevas.length}
                      </span>
                    )}
                  </div>
                </div>
                {activeTab === 'wishlist' ? (
                  <span className="hidden md:inline-block text-xs">▸</span>
                ) : (
                  <IonIcon name="chevron-forward-outline" className="hidden md:inline-block text-xs text-[#b5a496]" />
                )}
              </button>

              {/* Payment QR Pass (Active & Deactive Codes) */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenQrPass) {
                    onOpenQrPass()
                  }
                }}
                className="shrink-0 md:w-full flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 md:py-3 text-[#75685d] hover:bg-[#faf4ec] transition cursor-pointer whitespace-nowrap group"
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#fff4eb] text-[#c1440e]">
                    <IonIcon name="qr-code-outline" className="text-sm text-[#c1440e]" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#34251e]">
                      {language === 'KN' ? 'ಪಾವತಿ ಕ್ಯೂಆರ್ ಪಾಸ್ (Payment QR Pass)' : 'Payment QR Pass'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-1.5 py-0.5 text-[9px] font-bold text-[#c1440e]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active / Deactive
                    </span>
                  </div>
                </div>
                <IonIcon name="chevron-forward-outline" className="hidden md:inline-block text-xs text-[#b5a496] group-hover:text-[#c1440e] transition" />
              </button>



              {/* Switch Temple */}
              {onSwitchTemple && (
                <button
                  type="button"
                  onClick={onSwitchTemple}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[#75685d] hover:bg-[#fff9f3] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#fff4ec] text-[#c1440e]">
                      <IonIcon name="business-outline" className="text-sm text-[#c1440e]" />
                    </span>
                    <div className="text-left">
                      <span className="block font-medium text-[#34251e] group-hover:text-[#c1440e] transition">
                        {language === 'KN' ? 'ದೇವಾಲಯ ಬದಲಾಯಿಸಿ' : 'Switch Temple'}
                      </span>
                      <span className="block text-[11px] text-[#8b7a6d]">
                        {language === 'KN' ? 'ಕ್ಷೇತ್ರ ಬದಲಾವಣೆ' : 'Change active temple'}
                      </span>
                    </div>
                  </div>
                  <IonIcon name="chevron-forward-outline" className="text-xs text-[#b5a496] group-hover:text-[#c1440e]" />
                </button>
              )}

              {/* Change Language Row */}
              <div className="rounded-xl border border-[#eadfd1] bg-[#fffcf6] p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdf2e9] text-[#c1440e] shadow-2xs">
                      <svg
                        className="h-4 w-4 text-[#c1440e]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-[#34251e]">
                      {language === 'KN' ? 'ಭಾಷೆ' : 'Language'}
                    </span>
                  </div>

                  {/* Two Rectangle Boxes in Theme Color */}
                  <div className="flex items-center gap-1 rounded-lg bg-[#f5ede2] p-0.5 border border-[#eadfd1]">
                    <button
                      type="button"
                      onClick={() => setLanguage('EN')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        language === 'EN'
                          ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-xs'
                          : 'text-[#674f40] hover:text-[#c1440e]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('KN')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        language === 'KN'
                          ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-xs'
                          : 'text-[#674f40] hover:text-[#c1440e]'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>
              </div>

            </nav>

            {/* Logout button at bottom of sidebar */}
            {user && (
              <div className="mt-6 pt-4 border-t border-[#eadfd1] px-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded-xl border border-[#d94444] py-2.5 text-center text-xs font-bold text-[#d94444] hover:bg-[#fde8e8] transition cursor-pointer"
                >
                  {language === 'KN' ? 'ನಿರ್ಗಮಿಸಿ (Sign out)' : 'Sign out'}
                </button>
              </div>
            )}
          </aside>

          {/* ── RIGHT COLUMN: Profile & Account Details (Temple Theme) ── */}
          <section className="flex-1 w-full rounded-2xl bg-white p-6 sm:p-10 shadow-sm border border-[#eadfd1]">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveChanges}>
                {/* ── Top Profile Header: Large Avatar + Name ── */}
                <div className="flex items-center gap-6 pb-8 border-b border-[#eadfd1]">
                  {/* Large Avatar */}
                  <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full bg-gradient-to-br from-[#c1440e] to-[#d4a64a] shadow-lg shrink-0 border-4 border-[#f5ede2]">
                    <svg className="h-14 w-14 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>

                  {/* Name Header */}
                  <div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#34251e]">
                      {displayName}
                    </h1>
                    {user ? (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-0.5 text-xs font-semibold text-[#16a34a] shadow-2xs">
                        <svg className="h-3.5 w-3.5 text-[#16a34a] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold text-[#16a34a]">
                          {language === 'KN' ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Verified'}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs sm:text-sm text-[#8b7a6d]">
                        Guest Account · Add details to complete profile
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Section 1: Account Details ── */}
                <div className="mt-8">
                  <h3 className="font-serif text-lg font-bold text-[#34251e]">
                    {language === 'KN' ? 'ಖಾತೆ ವಿವರಗಳು' : 'Account Details'}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile Number (Non-editable) */}
                    <div>
                      <div className="mb-1.5">
                        <label className="text-xs font-semibold text-[#8b7a6d]">
                          {language === 'KN' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
                        </label>
                      </div>

                      <div className="flex items-center justify-between w-full rounded-xl border border-[#eadfd1] bg-[#faf4ec] px-4 py-3 text-sm text-[#5c4d41] font-medium">
                        <span>{phone || user?.phone || '+91 98765 43210'}</span>
                        <span className="text-[#8b7a6d] text-xs">🔒</span>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#8b7a6d]">
                          {language === 'KN' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(!isEditingEmail)}
                          className="flex items-center gap-1 text-xs font-bold text-[#c1440e] hover:underline cursor-pointer"
                        >
                          <span>✎</span>
                          <span>{isEditingEmail ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>

                      <div className="relative">
                        {isEditingEmail ? (
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full rounded-xl border border-[#c1440e] bg-white px-4 py-3 text-sm text-[#34251e] outline-none shadow-2xs focus:ring-2 focus:ring-[#c1440e]/20 pr-10"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center justify-between w-full rounded-xl border border-[#eadfd1] bg-[#faf4ec] px-4 py-3 text-sm text-[#34251e]">
                            <span className="truncate">{email}</span>
                            <span className="text-[#22c55e] font-black text-sm" title="Verified">
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Personal Details ── */}
                <div className="mt-10 pt-8 border-t border-[#eadfd1]">
                  <h3 className="font-serif text-lg font-bold text-[#34251e]">
                    {language === 'KN' ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Personal Details'}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name * (Mandatory) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ಮೊದಲ ಹೆಸರು' : 'First Name'} <span className="text-[#c1440e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={language === 'KN' ? 'ಮೊದಲ ಹೆಸರು ನಮೂದಿಸಿ' : 'Enter first name'}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-4 py-3 text-sm text-[#34251e] outline-none transition focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20"
                      />
                    </div>

                    {/* Second Name / Last Name (Not Mandatory) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ಎರಡನೇ ಹೆಸರು / ಕೊನೆಯ ಹೆಸರು (ಐಚ್ಛಿಕ)' : 'Second Name / Last Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={language === 'KN' ? 'ಎರಡನೇ ಹೆಸರು ನಮೂದಿಸಿ' : 'Enter second name (optional)'}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-4 py-3 text-sm text-[#34251e] outline-none transition focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20"
                      />
                    </div>

                    {/* Devotees Added Count Card */}
                    <div className="md:col-span-2 rounded-2xl border border-[#eadfd1] bg-[#fffaf1] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fdf2e9] text-[#c1440e] text-lg font-bold shadow-2xs">
                          📿
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#34251e]">
                              {language === 'KN' ? 'ಸೇರಿಸಲಾದ ಭಕ್ತರು' : 'Devotees Added'}
                            </h4>
                            <span className="rounded-full bg-[#c1440e] text-white px-2.5 py-0.5 text-xs font-bold shadow-2xs">
                              {devotees.length}
                            </span>
                          </div>
                          <p className="text-xs text-[#8b7a6d] mt-0.5">
                            {language === 'KN'
                              ? `ನಿಮ್ಮ ಖಾತೆಗೆ ${devotees.length} ಭಕ್ತರ ವಿವರಗಳನ್ನು ಸೇರಿಸಲಾಗಿದೆ.`
                              : `Total of ${devotees.length} devotee profile(s) linked to your account.`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => selectTab('devotee-list')}
                        className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-white border border-[#eadfd1] px-3.5 py-2 text-xs font-bold text-[#c1440e] hover:bg-[#fff9f3] transition cursor-pointer shadow-2xs"
                      >
                        <span>{language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ' : 'View Devotee List'}</span>
                        <span>›</span>
                      </button>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:shadow-lg hover:translate-y-[-1px] cursor-pointer"
                    >
                      {language === 'KN' ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ (Save Changes)' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── 1. ADD DEVOTEE FORM TAB ── */}
            {activeTab === 'add-devotee' && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eadfd1] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-2xl text-white shadow-sm">
                      ➕
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#34251e]">
                          {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ' : 'Add Devotee Details'}
                        </h2>
                        <span className="rounded-full bg-[#f5ede2] px-2.5 py-0.5 text-xs font-bold text-[#8b7a6d]">
                          Sankalpa
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#8b7a6d]">
                        {language === 'KN'
                          ? 'ಪೂಜಾ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಕುಟುಂಬ ಸದಸ್ಯರ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ ಸೇರಿಸಿ'
                          : 'Add family member names, nakshatra & gotra for sacred pujas'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vedic Sankalpa Explainer Banner */}
                <div className="mt-6 rounded-2xl border border-[#d4a64a]/30 bg-[#fffaf1] p-4 text-xs text-[#8b7a6d] leading-relaxed">
                  <span className="font-bold text-[#c1440e]">🕉️ {language === 'KN' ? 'ಸಂಕಲ್ಪದ ಮಹತ್ವ:' : 'Sankalpa Importance:'}</span>{' '}
                  {language === 'KN'
                    ? 'ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬ ಸದಸ್ಯರ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರವನ್ನು ಉಚ್ಚರಿಸಿ ದೈವಿಕ ಸಂಕಲ್ಪ ಮಾಡುತ್ತಾರೆ. ಈ ವಿವರಗಳು ಅರ್ಚಕರಿಗೆ ನೇರವಾಗಿ ತಲುಪುತ್ತವೆ.'
                    : 'During puja, priests recite the devotee name, birth star (nakshatra), and lineage (gotram) for individual and family sanctification.'}
                </div>

                {/* Devotee Form */}
                <form onSubmit={handleSaveDevotee} className="mt-6 rounded-2xl border border-[#eadfd1] bg-white p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#34251e] mb-4 flex items-center gap-2">
                    <span className="text-[#c1440e]">➕</span>
                    <span>{language === 'KN' ? 'ಹೊಸ ಭಕ್ತರನ್ನು ಸೇರಿಸಿ' : 'Add New Devotee / Family Member'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ಭಕ್ತರ ಪೂರ್ಣ ಹೆಸರು (Full Name)' : 'Devotee Full Name'}{' '}
                        <span className="text-[#c1440e]">*</span>
                      </label>
                      <input
                        type="text"
                        value={devoteeForm.name}
                        onChange={(e) => {
                          setDevoteeForm({ ...devoteeForm, name: e.target.value })
                          if (devoteeErrors.name) setDevoteeErrors({})
                        }}
                        placeholder={language === 'KN' ? 'ಉದಾ. ಶ್ರೇಯಸ್ ಶರ್ಮ' : 'e.g. Ramesh Kumar'}
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-[#34251e] outline-none transition ${
                          devoteeErrors.name
                            ? 'border-[#d94444] bg-[#fef2f2]'
                            : 'border-[#eadfd1] focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20'
                        }`}
                      />
                      {devoteeErrors.name && (
                        <p className="mt-1 text-xs text-[#d94444]">
                          {language === 'KN' ? 'ಹೆಸರು ಅಗತ್ಯವಿದೆ' : 'Devotee name is required'}
                        </p>
                      )}
                    </div>

                    {/* Gotram */}
                    <div>
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ಗೋತ್ರ (Gotram)' : 'Gotram'}{' '}
                        <span className="text-[11px] text-[#b5a496]">({language === 'KN' ? 'ಐಚ್ಛಿಕ' : 'optional'})</span>
                      </label>
                      <input
                        type="text"
                        value={devoteeForm.gotram}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, gotram: e.target.value })}
                        placeholder={language === 'KN' ? 'ಉದಾ. ಕಶ್ಯಪ, ಭಾರದ್ವಾಜ' : 'e.g. Kashyapa, Bharadwaja'}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-4 py-3 text-sm text-[#34251e] outline-none transition focus:border-[#c1440e]"
                      />
                    </div>

                    {/* Nakshatra */}
                    <div>
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ (Nakshatra)' : 'Nakshatra (Birth Star)'}
                      </label>
                      <select
                        value={devoteeForm.nakshatra}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, nakshatra: e.target.value })}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-4 py-3 text-sm text-[#34251e] outline-none transition focus:border-[#c1440e] cursor-pointer"
                      >
                        <option value="">{language === 'KN' ? '-- ನಕ್ಷತ್ರ ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Nakshatra --'}</option>
                        {nakshatras.map((nak) => (
                          <option key={nak} value={nak}>
                            {nak}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rashi */}
                    <div>
                      <label className="block text-xs font-semibold text-[#8b7a6d] mb-1.5">
                        {language === 'KN' ? 'ರಾಶಿ (Rashi / Moon Sign)' : 'Rashi (Moon Sign)'}
                      </label>
                      <select
                        value={devoteeForm.rashi}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, rashi: e.target.value })}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-4 py-3 text-sm text-[#34251e] outline-none transition focus:border-[#c1440e] cursor-pointer"
                      >
                        <option value="">{language === 'KN' ? '-- ರಾಶಿ ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Rashi --'}</option>
                        {rashis.map((ras) => (
                          <option key={ras} value={ras}>
                            {ras}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDevoteeForm({ name: '', relationship: 'Self', nakshatra: '', rashi: '', gotram: '' })
                        setDevoteeErrors({})
                      }}
                      className="rounded-xl border border-[#d9cabb] px-5 py-3 text-sm font-semibold text-[#75685d] hover:bg-[#f5ede2] transition cursor-pointer"
                    >
                      {language === 'KN' ? 'ಮರುಹೊಂದಿಸಿ (Reset)' : 'Reset'}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-8 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg hover:translate-y-[-1px] cursor-pointer"
                    >
                      {language === 'KN' ? 'ಭಕ್ತರ ವಿವರಗಳನ್ನು ಉಳಿಸಿ' : 'Save Devotee Details'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── 2. DEVOTEE LIST TAB (ONLY Devotee List displayed!) ── */}
            {activeTab === 'devotee-list' && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eadfd1] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-2xl text-white shadow-sm">
                      📿
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#34251e]">
                          {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ' : 'Devotee List'}
                        </h2>
                        <span className="rounded-full bg-[#f5ede2] px-2.5 py-0.5 text-xs font-bold text-[#8b7a6d]">
                          {devotees.length} {language === 'KN' ? 'ಭಕ್ತರು' : 'Devotees'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#8b7a6d]">
                        {language === 'KN'
                          ? 'ಪೂಜಾ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಉಳಿಸಲಾದ ಕುಟುಂಬದ ಸದಸ್ಯರ ಪಟ್ಟಿ'
                          : 'Family members registered for sacred sankalpa'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Devotees List Only */}
                <div className="mt-8">
                  {devotees.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#eadfd1] bg-[#faf4ec]">
                      <span className="text-5xl">📿</span>
                      <h4 className="mt-4 font-serif font-bold text-lg text-[#34251e]">
                        {language === 'KN' ? 'ಇನ್ನೂ ಯಾವುದೇ ಭಕ್ತರನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ' : 'No devotees in your list yet'}
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-[#8b7a6d] max-w-md mx-auto">
                        {language === 'KN'
                          ? 'ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರ ಹೆಸರಿನಲ್ಲಿ ಸಂಕಲ್ಪ ಮಾಡಲು ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.'
                          : 'Add your family members with birth star (nakshatra) and rashi for authentic priest sankalpa during rituals.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => selectTab('add-devotee')}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                      >
                        <span>➕</span>
                        <span>{language === 'KN' ? 'ಮೊದಲ ಭಕ್ತರನ್ನು ಸೇರಿಸಿ' : 'Add Your First Devotee'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#eadfd1] bg-white shadow-2xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#eadfd1] bg-[#faf4ec] text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                            <th className="py-3.5 px-4 text-center w-12">#</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಭಕ್ತರ ಹೆಸರು' : 'Devotee Name'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ' : 'Nakshatra'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ರಾಶಿ' : 'Rashi'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಗೋತ್ರ' : 'Gotram'}</th>
                            <th className="py-3.5 px-4 text-center w-44">{language === 'KN' ? 'ಕ್ರಿಯೆಗಳು' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eadfd1] text-xs text-[#34251e]">
                          {devotees.map((dev, idx) => {
                            const isEditing = editingDevoteeId === dev.id
                            if (isEditing) {
                              return (
                                <tr key={dev.id} className="bg-[#fffaf1]">
                                  <td colSpan={6} className="p-4 sm:p-5 border-l-4 border-l-[#c1440e]">
                                    <form onSubmit={(e) => handleUpdateDevotee(dev.id!, e)} className="space-y-4">
                                      <div className="flex items-center justify-between pb-2 border-b border-[#eadfd1]">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-[#c1440e]">✏️</span>
                                          <h4 className="font-bold text-xs sm:text-sm text-[#34251e]">
                                            {language === 'KN'
                                              ? `${dev.name} ಅವರ ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ`
                                              : `Edit Details for ${dev.name}`}
                                          </h4>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={cancelEditingDevotee}
                                          className="text-xs font-bold text-[#8b7a6d] hover:text-[#34251e] transition cursor-pointer"
                                        >
                                          ✕ {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {/* Name */}
                                        <div className="lg:col-span-1">
                                          <label className="block text-[10px] font-bold text-[#8b7a6d] mb-1">
                                            {language === 'KN' ? 'ಹೆಸರು *' : 'Name *'}
                                          </label>
                                          <input
                                            type="text"
                                            value={editDevoteeForm.name}
                                            onChange={(e) => {
                                              setEditDevoteeForm({ ...editDevoteeForm, name: e.target.value })
                                              if (editDevoteeErrors.name) setEditDevoteeErrors({})
                                            }}
                                            className={`w-full rounded-lg border px-3 py-2 text-xs text-[#34251e] outline-none transition bg-white ${
                                              editDevoteeErrors.name
                                                ? 'border-[#d94444] bg-[#fef2f2]'
                                                : 'border-[#eadfd1] focus:border-[#c1440e]'
                                            }`}
                                            placeholder="Devotee name"
                                          />
                                        </div>

                                        {/* Nakshatra */}
                                        <div>
                                          <label className="block text-[10px] font-bold text-[#8b7a6d] mb-1">
                                            {language === 'KN' ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'}
                                          </label>
                                          <select
                                            value={editDevoteeForm.nakshatra}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, nakshatra: e.target.value })}
                                            className="w-full rounded-lg border border-[#eadfd1] bg-white px-3 py-2 text-xs text-[#34251e] outline-none transition focus:border-[#c1440e] cursor-pointer"
                                          >
                                            <option value="">-- Nakshatra --</option>
                                            {nakshatras.map((nak) => (
                                              <option key={nak} value={nak}>
                                                {nak}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Rashi */}
                                        <div>
                                          <label className="block text-[10px] font-bold text-[#8b7a6d] mb-1">
                                            {language === 'KN' ? 'ರಾಶಿ' : 'Rashi'}
                                          </label>
                                          <select
                                            value={editDevoteeForm.rashi}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, rashi: e.target.value })}
                                            className="w-full rounded-lg border border-[#eadfd1] bg-white px-3 py-2 text-xs text-[#34251e] outline-none transition focus:border-[#c1440e] cursor-pointer"
                                          >
                                            <option value="">-- Rashi --</option>
                                            {rashis.map((ras) => (
                                              <option key={ras} value={ras}>
                                                {ras}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Gotram */}
                                        <div>
                                          <label className="block text-[10px] font-bold text-[#8b7a6d] mb-1">
                                            {language === 'KN' ? 'ಗೋತ್ರ' : 'Gotram'}
                                          </label>
                                          <input
                                            type="text"
                                            value={editDevoteeForm.gotram}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, gotram: e.target.value })}
                                            placeholder="e.g. Kashyapa"
                                            className="w-full rounded-lg border border-[#eadfd1] bg-white px-3 py-2 text-xs text-[#34251e] outline-none transition focus:border-[#c1440e]"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={cancelEditingDevotee}
                                          className="rounded-lg border border-[#d9cabb] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#75685d] hover:bg-[#f5ede2] transition cursor-pointer"
                                        >
                                          {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                                        </button>
                                        <button
                                          type="submit"
                                          className="rounded-lg bg-gradient-to-r from-[#c1440e] to-[#df5619] px-4 py-1.5 text-xs font-bold text-white shadow-2xs hover:shadow-md transition cursor-pointer"
                                        >
                                          {language === 'KN' ? 'ಉಳಿಸಿ' : 'Save Changes'}
                                        </button>
                                      </div>
                                    </form>
                                  </td>
                                </tr>
                              )
                            }

                            return (
                              <tr key={dev.id} className="hover:bg-[#faf4ec] transition">
                                {/* Index */}
                                <td className="py-3.5 px-4 text-center font-semibold text-[#8b7a6d]">
                                  {idx + 1}
                                </td>

                                {/* Devotee Name */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-tr from-[#fdf2e9] to-[#fff5ee] border border-[#f5cfb5] text-[#c1440e] font-bold text-xs shadow-2xs">
                                      {dev.name.charAt(0).toUpperCase() || '🕉️'}
                                    </div>
                                    <span className="font-bold text-sm text-[#34251e]">{dev.name}</span>
                                  </div>
                                </td>


                                {/* Nakshatra */}
                                <td className="py-3.5 px-4 font-medium text-[#75685d]">
                                  {dev.nakshatra || <span className="text-[#b5a496]">—</span>}
                                </td>

                                {/* Rashi */}
                                <td className="py-3.5 px-4 font-medium text-[#75685d]">
                                  {dev.rashi || <span className="text-[#b5a496]">—</span>}
                                </td>

                                {/* Gotram */}
                                <td className="py-3.5 px-4 font-medium text-[#75685d]">
                                  {dev.gotram || <span className="text-[#b5a496]">—</span>}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditingDevotee(dev)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-[#eadfd1] bg-white px-2.5 py-1.5 text-xs font-bold text-[#34251e] hover:border-[#c1440e] hover:text-[#c1440e] hover:bg-[#fff9f3] transition cursor-pointer shadow-2xs"
                                      title="Edit Devotee"
                                    >
                                      <span>✏️</span>
                                      <span>{language === 'KN' ? 'ತಿದ್ದುಪಡಿ' : 'Edit'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            language === 'KN'
                                              ? `ನೀವು ಖಚಿತವಾಗಿ ${dev.name} ಅವರನ್ನು ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲು ಬಯಸುವಿರಾ?`
                                              : `Are you sure you want to delete ${dev.name} from your devotee list?`
                                          )
                                        ) {
                                          removeDevotee(dev.id!)
                                          showToast(
                                            language === 'KN' ? `${dev.name} ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ` : `${dev.name} removed from devotee list`,
                                            'info'
                                          )
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 rounded-lg border border-[#fde8e8] bg-[#fef2f2] px-2.5 py-1.5 text-xs font-bold text-[#d94444] hover:bg-[#fde8e8] transition cursor-pointer shadow-2xs"
                                      title="Delete Devotee"
                                    >
                                      <span>🗑️</span>
                                      <span>{language === 'KN' ? 'ತೆಗೆದುಹಾಕಿ' : 'Delete'}</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── 3. YOUR WISHLIST / FAVOURITES TAB (In-Page View) ── */}
            {activeTab === 'wishlist' && (
              <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#eadfd1] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#d4a64a] text-2xl text-white shadow-sm">
                      ❤️
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#34251e]">
                          {language === 'KN' ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಸೇವೆಗಳು' : 'Your Wishlist'}
                        </h2>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#8b7a6d]">
                        {language === 'KN'
                          ? 'ಉಳಿಸಿದ ಪವಿತ್ರ ಸೇವೆಗಳು ಮತ್ತು ಪೂಜೆಗಳು'
                          : 'Saved ritual offerings and pujas'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8">
                  {wishlistedSevas.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-[#eadfd1] bg-[#faf4ec]">
                      <span className="text-5xl">🤍</span>
                      <h4 className="mt-4 font-serif font-bold text-lg text-[#34251e]">
                        {language === 'KN'
                          ? 'ಮೆಚ್ಚಿನವುಗಳ ಪಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ'
                          : 'No Saved Sevas'}
                      </h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-[#8b7a6d] max-w-md mx-auto">
                        {language === 'KN'
                          ? 'ನೀವು ಯಾವುದೇ ಸೇವೆಗಳನ್ನು ಮೆಚ್ಚಿನವುಗಳಿಗೆ ಸೇರಿಸಿಲ್ಲ. ಲಭ್ಯವಿರುವ ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳನ್ನು ಉಳಿಸಲು ಹೃದಯ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
                          : "You haven't saved any offerings yet. Explore available sevas and tap the heart icon to add to your wishlist."}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/sevas')}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                      >
                        <span>🪔</span>
                        <span>{language === 'KN' ? `${localizedActiveTemple.name} ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ` : `Explore ${localizedActiveTemple.name} Sevas`}</span>
                      </button>
                    </div>
                  ) : (
                    /* Wishlist Items Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistedSevas.map((rawSeva) => {
                        const seva = translateSeva ? translateSeva(rawSeva) : rawSeva
                        const isRemoving = removingWishlistIds.includes(seva.id)

                        return (
                          <div
                            key={seva.id}
                            className={`group relative flex flex-col justify-between rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs hover:shadow-sm transition-all duration-300 ${
                              isRemoving ? 'opacity-40 scale-[0.98]' : ''
                            }`}
                          >
                            <div className="flex gap-4">
                              <img
                                src={seva.image}
                                alt={seva.name}
                                className="h-24 w-24 shrink-0 rounded-xl object-cover border border-[#eadfd1]"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/temple-hero.webp'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-bold text-base text-[#34251e] truncate hover:text-[#c1440e] transition">
                                    {seva.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveWishlistItem(seva.id, seva.name)}
                                    disabled={isRemoving}
                                    className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 cursor-pointer shrink-0 shadow-2xs hover:scale-110 active:scale-95 ${
                                      isRemoving
                                        ? 'bg-white border-[#d9cabb] text-[#b5a496]'
                                        : 'bg-[#fdf2e9] border-[#f5cfb5] text-[#c1440e] hover:bg-[#fde5d5]'
                                    }`}
                                    title={isRemoving ? 'Removing...' : 'Remove from wishlist'}
                                    aria-label="Remove from wishlist"
                                  >
                                    {isRemoving ? (
                                      /* White Heart when removing */
                                      <svg
                                        className="h-4.5 w-4.5 text-[#b5a496]"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="#ffffff"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                        />
                                      </svg>
                                    ) : (
                                      /* Full Red Heart */
                                      <svg
                                        className="h-4.5 w-4.5 fill-[#c1440e] text-[#c1440e]"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                                <p className="mt-1 text-xs text-[#8b7a6d] line-clamp-2 leading-relaxed">
                                  {seva.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#eadfd1] flex items-center justify-between">
                              <div>
                                <span className="font-bold text-base text-[#c1440e]">
                                  {formatPrice(seva.price)}
                                </span>
                                {seva.originalPrice && (
                                  <span className="ml-2 text-xs text-[#b5a496] line-through">
                                    {formatPrice(seva.originalPrice)}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (onAddToCart) {
                                    onAddToCart(rawSeva)
                                  } else {
                                    navigate('/sevas', { state: { openCart: true } })
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:shadow-md transition cursor-pointer"
                              >
                                <span>🪔</span>
                                <span>{language === 'KN' ? 'ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ' : 'Book Seva'}</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

          </section>
        </div>
      </main>


    </div>
  )
}

export default ProfilePage
