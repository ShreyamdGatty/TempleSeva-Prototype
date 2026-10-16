import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { User, Address, Devotee, Seva } from '../../types'
import { useLanguage } from '../../contexts/LanguageContext'
import { nakshatras, rashis, sevas } from '../../data'
import { useDevotees } from '../../hooks/useDevotees'
import { useWishlist } from '../../hooks/useWishlist'
import { formatPrice } from '../../utils/helpers'
import LanguageModal from '../../components/LanguageModal/LanguageModal'

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
  wishlist?: string[]
  onToggleWishlist?: (sevaId: string) => void
  onAddToCart?: (seva: Seva) => void
}

const ProfilePage = ({
  user,
  addresses: _addresses = [],
  onUpdateUser,
  onWishlist: _onWishlist,
  onOrders,
  onOpenSideMenu,
  onLogout,
  showToast,
  wishlist: propWishlist,
  onToggleWishlist,
  onAddToCart,
}: ProfilePageProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { language, toggleLanguage: _toggleLanguage, t, translateSeva } = useLanguage()

  // State for Language Change Confirmation Modal (from sidebar Language button)
  const [langModalOpen, setLangModalOpen] = useState(false)

  // Wishlist state and handlers (fallback to useWishlist hook if not passed via props)
  const fallbackWishlist = useWishlist()
  const currentWishlist = propWishlist !== undefined ? propWishlist : fallbackWishlist.wishlist
  const handleToggleWish = (sevaId: string) => {
    if (onToggleWishlist) {
      onToggleWishlist(sevaId)
    } else {
      fallbackWishlist.toggle(sevaId)
    }
  }
  const wishlistedSevas = sevas.filter((s) => currentWishlist.includes(s.id))

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

  // Devotee management via useDevotees hook
  const { devotees, addDevotee, updateDevotee, removeDevotee } = useDevotees(user?.name)
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
    setEditingDevoteeId(dev.id)
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
    selectTab('devotee-list')
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
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || user?.name || 'Guest'

    onUpdateUser({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      email: email.trim(),
      birthday: birthday.trim() || undefined,
      gender: gender || undefined,
    })

    setIsEditingPhone(false)
    setIsEditingEmail(false)
    showToast(language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Changes saved successfully!', 'success')
  }

  const displayName = firstName.trim() || user?.name || 'Guest'

  return (
    <div className="min-h-screen bg-[#f2f5f9] text-[#222222]">
      {/* ── Top Header (BookMyShow / TempleSeva Style) ── */}
      <header className="sticky top-0 z-30 border-b border-[#e5e9f0] bg-white transition-all shadow-2xs">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] font-serif text-xl font-bold text-white shadow-md">
              ॐ
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight whitespace-nowrap">
              {language === 'KN' ? (
                <>
                  ಟೆಂಪಲ್<span className="text-[#f84464]">ಸೇವಾ</span>
                </>
              ) : (
                <>
                  Temple<span className="text-[#f84464]">Seva</span>
                </>
              )}
            </span>
          </button>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#333333]">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e4e4e7] text-white">
                <svg className="h-5 w-5 text-[#71717a]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </span>
              <span className="hidden sm:inline">Hi, {displayName}</span>
            </div>

            {/* Menu Trigger: Only shown after login is successful */}
            {user && (
              <button
                type="button"
                onClick={onOpenSideMenu}
                className="group flex items-center justify-center h-10 w-10 rounded-xl border border-[#e5e9f0] bg-white text-[#333333] shadow-xs transition hover:border-[#c1440e] hover:bg-[#fff9f3] hover:text-[#c1440e] cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${displayName} - Profile & Menu`}
              >
                {/* Desktop View: Profile Icon */}
                <div className="relative hidden sm:flex items-center justify-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#333333] group-hover:text-[#c1440e] transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#c1440e] ring-2 ring-white" />
                </div>

                {/* Mobile View: 3-Line Hamburger Icon */}
                <span className="flex sm:hidden flex-col gap-1 w-5 items-center justify-center pointer-events-none">
                  <span className="block h-0.5 w-full bg-[#333333] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#333333] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#333333] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Category Subheader */}
        <div className="hidden lg:flex border-t border-[#f0f2f5] bg-white px-8 py-2 text-xs font-medium text-[#555555]">
          <div className="mx-auto flex max-w-7xl w-full items-center justify-between">
            <div className="flex gap-6">
              <button onClick={() => navigate('/sevas')} className="hover:text-[#f84464] cursor-pointer">
                {t('navTemples')}
              </button>
              <button onClick={() => navigate('/sevas')} className="hover:text-[#f84464] cursor-pointer">
                {t('heroBookSeva')}
              </button>
              <button onClick={() => onOrders()} className="hover:text-[#f84464] cursor-pointer">
                {t('navMySevas')}
              </button>
              <a href="/#how" className="hover:text-[#f84464]">
                {t('navHowItWorks')}
              </a>
              <a href="/#faq" className="hover:text-[#f84464]">
                {t('navFaq')}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Two-Column Layout (Matching BookMyShow My Account) ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ── LEFT COLUMN: "My Account" Menu Card ── */}
          <aside className="w-full md:w-72 rounded-2xl bg-white p-4 shadow-xs border border-[#e5e9f0] shrink-0">
            {/* Header: "My Account" + Close Button */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#f0f2f5] px-2">
              <h2 className="text-xl font-bold text-[#222222]">
                {language === 'KN' ? 'ನನ್ನ ಖಾತೆ' : 'My Account'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="grid h-8 w-8 place-items-center rounded-full text-base font-bold text-[#888888] hover:bg-[#f4f4f5] hover:text-[#222222] transition cursor-pointer"
                aria-label="Close"
                title="Back to home"
              >
                ✕
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1 text-sm font-medium">
              {/* Profile */}
              <button
                type="button"
                onClick={() => selectTab('profile')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#fef0f2] text-[#f84464] font-bold'
                    : 'text-[#444444] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#fce4e8] text-[#f84464] text-xs">
                    👤
                  </span>
                  <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}</span>
                </div>
                {activeTab === 'profile' && <span className="text-xs">▸</span>}
              </button>

              {/* Add Devotee */}
              <button
                type="button"
                onClick={() => selectTab('add-devotee')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition cursor-pointer ${
                  activeTab === 'add-devotee'
                    ? 'bg-[#fef0f2] text-[#f84464] font-bold'
                    : 'text-[#444444] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#f84464] font-bold">➕</span>
                  <span className="font-medium text-[#222222]">
                    {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ' : 'Add Devotee'}
                  </span>
                </div>
                {activeTab === 'add-devotee' ? (
                  <span className="text-xs">▸</span>
                ) : (
                  <span className="text-xs text-[#aaaaaa]">›</span>
                )}
              </button>

              {/* Devotee List */}
              <button
                type="button"
                onClick={() => selectTab('devotee-list')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition cursor-pointer ${
                  activeTab === 'devotee-list'
                    ? 'bg-[#fef0f2] text-[#f84464] font-bold'
                    : 'text-[#444444] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#666666]">📿</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#222222]">
                      {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ' : 'Devotee List'}
                    </span>
                    {devotees.length > 0 && (
                      <span className="rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[10px] font-bold text-[#666666]">
                        {devotees.length}
                      </span>
                    )}
                  </div>
                </div>
                {activeTab === 'devotee-list' ? (
                  <span className="text-xs">▸</span>
                ) : (
                  <span className="text-xs text-[#aaaaaa]">›</span>
                )}
              </button>

              {/* Your Orders */}
              <button
                type="button"
                onClick={() => onOrders()}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[#444444] hover:bg-[#f9fafb] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#666666]">📄</span>
                  <span>{language === 'KN' ? 'ನಿಮ್ಮ ಸೇವೆಗಳು (Your Orders)' : 'Your Orders'}</span>
                </div>
                <span className="text-xs text-[#aaaaaa]">›</span>
              </button>

              {/* Your Wishlist */}
              <button
                type="button"
                onClick={() => selectTab('wishlist')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 transition cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-[#fef0f2] text-[#f84464] font-bold'
                    : 'text-[#444444] hover:bg-[#f9fafb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#666666]">🤍</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#222222]">
                      {language === 'KN' ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳು' : 'Your Wishlist'}
                    </span>
                    {currentWishlist.length > 0 && (
                      <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                        {currentWishlist.length}
                      </span>
                    )}
                  </div>
                </div>
                {activeTab === 'wishlist' ? (
                  <span className="text-xs">▸</span>
                ) : (
                  <span className="text-xs text-[#aaaaaa]">›</span>
                )}
              </button>

              {/* Change Language */}
              <button
                type="button"
                onClick={() => setLangModalOpen(true)}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[#444444] hover:bg-[#f9fafb] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#c1440e]">🌐</span>
                  <div className="text-left">
                    <span className="block font-medium text-[#222222]">
                      {language === 'KN' ? 'ಭಾಷೆ ಬದಲಾಯಿಸಿ' : 'Change Language'}
                    </span>
                    <span className="block text-[11px] text-[#888888]">
                      {language === 'KN' ? 'ಪ್ರಸ್ತುತ: ಕನ್ನಡ' : 'Current: English'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#aaaaaa]">›</span>
              </button>

            </nav>

            {/* Logout button at bottom of sidebar */}
            {user && (
              <div className="mt-6 pt-4 border-t border-[#f0f2f5] px-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full rounded-xl border border-[#f84464] py-2.5 text-center text-xs font-bold text-[#f84464] hover:bg-[#fff0f3] transition cursor-pointer"
                >
                  {language === 'KN' ? 'ನಿರ್ಗಮಿಸಿ (Sign out)' : 'Sign out'}
                </button>
              </div>
            )}
          </aside>

          {/* ── RIGHT COLUMN: Profile & Account Details (BookMyShow Style) ── */}
          <section className="flex-1 w-full rounded-2xl bg-white p-6 sm:p-10 shadow-xs border border-[#e5e9f0]">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveChanges}>
                {/* ── Top Profile Header: Large Avatar + Name ── */}
                <div className="flex items-center gap-6 pb-8 border-b border-[#f0f2f5]">
                  {/* Large Avatar Placeholder */}
                  <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-full bg-[#f0f2f5] shadow-2xs shrink-0 border border-[#e5e9f0]">
                    <svg className="h-16 w-16 text-[#8e8e93]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>

                  {/* Name Header */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222222]">
                      {displayName}
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-[#777777]">
                      {user ? 'Verified Devotee Account' : 'Guest Account · Add details to complete profile'}
                    </p>
                  </div>
                </div>

                {/* ── Section 1: Account Details ── */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-[#222222]">
                    {language === 'KN' ? 'ಖಾತೆ ವಿವರಗಳು' : 'Account Details'}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mobile Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#555555]">
                          {language === 'KN' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Mobile Number'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsEditingPhone(!isEditingPhone)}
                          className="flex items-center gap-1 text-xs font-bold text-[#f84464] hover:underline cursor-pointer"
                        >
                          <span>✎</span>
                          <span>{isEditingPhone ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>

                      {isEditingPhone ? (
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter mobile number"
                          className="w-full rounded-xl border border-[#f84464] bg-white px-4 py-3 text-sm text-[#222222] outline-none shadow-2xs focus:ring-2 focus:ring-[#f84464]/20"
                          autoFocus
                        />
                      ) : (
                        <div className="w-full rounded-xl border border-[#e5e9f0] bg-[#fafbfc] px-4 py-3 text-sm text-[#666666]">
                          {phone || '+91 98765 43210'}
                        </div>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#555555]">
                          {language === 'KN' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(!isEditingEmail)}
                          className="flex items-center gap-1 text-xs font-bold text-[#f84464] hover:underline cursor-pointer"
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
                            className="w-full rounded-xl border border-[#f84464] bg-white px-4 py-3 text-sm text-[#222222] outline-none shadow-2xs focus:ring-2 focus:ring-[#f84464]/20 pr-10"
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center justify-between w-full rounded-xl border border-[#e5e9f0] bg-[#fafbfc] px-4 py-3 text-sm text-[#222222]">
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
                <div className="mt-10 pt-8 border-t border-[#f0f2f5]">
                  <h3 className="text-lg font-bold text-[#222222]">
                    {language === 'KN' ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Personal Details'}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಮೊದಲ ಹೆಸರು' : 'First Name'} <span className="text-[#f84464]">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name here"
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] focus:ring-2 focus:ring-[#f84464]/20"
                      />
                    </div>

                    {/* Last Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಕೊನೆಯ ಹೆಸರು' : 'Last Name'} <span className="text-[#f84464]">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name here"
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] focus:ring-2 focus:ring-[#f84464]/20"
                      />
                    </div>

                    {/* Birthday (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಜನ್ಮ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)' : 'Birthday (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] focus:ring-2 focus:ring-[#f84464]/20"
                      />
                    </div>

                    {/* Identity (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಲಿಂಗ / ಗುರುತು (ಐಚ್ಛಿಕ)' : 'Identity (Optional)'}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] focus:ring-2 focus:ring-[#f84464]/20 cursor-pointer"
                      >
                        <option value="">Select Identity</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#f84464] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e03152] hover:shadow-md cursor-pointer"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f2f5] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#f84464] to-[#ff6b85] text-2xl text-white shadow-sm">
                      ➕
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222]">
                          {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ' : 'Add Devotee Details'}
                        </h2>
                        <span className="rounded-full bg-[#fef0f2] px-2.5 py-0.5 text-xs font-bold text-[#f84464]">
                          Sankalpa
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#777777]">
                        {language === 'KN'
                          ? 'ಪೂಜಾ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಕುಟುಂಬ ಸದಸ್ಯರ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ ಸೇರಿಸಿ'
                          : 'Add family member names, nakshatra & gotra for sacred temple pujas'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectTab('devotee-list')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#f0f2f5] px-4 py-2 text-xs font-bold text-[#444444] hover:bg-[#e4e7eb] transition cursor-pointer"
                    >
                      <span>📿</span>
                      <span>
                        {language === 'KN'
                          ? `ಭಕ್ತರ ಪಟ್ಟಿ (${devotees.length})`
                          : `View Devotee List (${devotees.length})`}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => selectTab('profile')}
                      className="flex items-center gap-1.5 rounded-xl border border-[#e5e9f0] px-4 py-2 text-xs font-bold text-[#555555] hover:border-[#f84464] hover:text-[#f84464] transition cursor-pointer"
                    >
                      <span>←</span>
                      <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}</span>
                    </button>
                  </div>
                </div>

                {/* Vedic Sankalpa Explainer Banner */}
                <div className="mt-6 rounded-2xl border border-[#fed7aa] bg-[#fffaf5] p-4 text-xs text-[#8a6842] leading-relaxed">
                  <span className="font-bold text-[#c1440e]">🕉️ {language === 'KN' ? 'ಸಂಕಲ್ಪದ ಮಹತ್ವ:' : 'Sankalpa Importance:'}</span>{' '}
                  {language === 'KN'
                    ? 'ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬ ಸದಸ್ಯರ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರವನ್ನು ಉಚ್ಚರಿಸಿ ದೈವಿಕ ಸಂಕಲ್ಪ ಮಾಡುತ್ತಾರೆ. ಈ ವಿವರಗಳು ಅರ್ಚಕರಿಗೆ ನೇರವಾಗಿ ತಲುಪುತ್ತವೆ.'
                    : 'During puja, priests recite the devotee name, birth star (nakshatra), and lineage (gotram) for individual and family sanctification.'}
                </div>

                {/* Devotee Form */}
                <form onSubmit={handleSaveDevotee} className="mt-6 rounded-2xl border border-[#e5e9f0] bg-white p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#222222] mb-4 flex items-center gap-2">
                    <span className="text-[#f84464]">➕</span>
                    <span>{language === 'KN' ? 'ಹೊಸ ಭಕ್ತರನ್ನು ಸೇರಿಸಿ' : 'Add New Devotee / Family Member'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಭಕ್ತರ ಪೂರ್ಣ ಹೆಸರು (Full Name)' : 'Devotee Full Name'}{' '}
                        <span className="text-[#f84464]">*</span>
                      </label>
                      <input
                        type="text"
                        value={devoteeForm.name}
                        onChange={(e) => {
                          setDevoteeForm({ ...devoteeForm, name: e.target.value })
                          if (devoteeErrors.name) setDevoteeErrors({})
                        }}
                        placeholder={language === 'KN' ? 'ಉದಾ. ಶ್ರೇಯಸ್ ಶರ್ಮ' : 'e.g. Ramesh Kumar'}
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-[#222222] outline-none transition ${
                          devoteeErrors.name
                            ? 'border-[#f84464] bg-[#fff5f5]'
                            : 'border-[#e5e9f0] focus:border-[#f84464] focus:ring-2 focus:ring-[#f84464]/20'
                        }`}
                      />
                      {devoteeErrors.name && (
                        <p className="mt-1 text-xs text-[#f84464]">
                          {language === 'KN' ? 'ಹೆಸರು ಅಗತ್ಯವಿದೆ' : 'Devotee name is required'}
                        </p>
                      )}
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಸಂಬಂಧ (Relationship)' : 'Relationship'}
                      </label>
                      <select
                        value={devoteeForm.relationship}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, relationship: e.target.value })}
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
                      >
                        <option value="Self">Self (ಸ್ವತಃ)</option>
                        <option value="Spouse">Spouse (ಪತಿ / ಪತ್ನಿ)</option>
                        <option value="Son">Son (ಮಗ)</option>
                        <option value="Daughter">Daughter (ಮಗಳು)</option>
                        <option value="Father">Father (ತಂದೆ)</option>
                        <option value="Mother">Mother (ತಾಯಿ)</option>
                        <option value="Brother">Brother (ಸಹೋದರ)</option>
                        <option value="Sister">Sister (ಸಹೋದರಿ)</option>
                        <option value="Other">Other (ಇತರರು)</option>
                      </select>
                    </div>

                    {/* Gotram */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಗೋತ್ರ (Gotram)' : 'Gotram'}{' '}
                        <span className="text-[11px] text-[#888888]">({language === 'KN' ? 'ಐಚ್ಛಿಕ' : 'optional'})</span>
                      </label>
                      <input
                        type="text"
                        value={devoteeForm.gotram}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, gotram: e.target.value })}
                        placeholder={language === 'KN' ? 'ಉದಾ. ಕಶ್ಯಪ, ಭಾರದ್ವಾಜ' : 'e.g. Kashyapa, Bharadwaja'}
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464]"
                      />
                    </div>

                    {/* Nakshatra */}
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ (Nakshatra)' : 'Nakshatra (Birth Star)'}
                      </label>
                      <select
                        value={devoteeForm.nakshatra}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, nakshatra: e.target.value })}
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
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
                      <label className="block text-xs font-semibold text-[#555555] mb-1.5">
                        {language === 'KN' ? 'ರಾಶಿ (Rashi / Moon Sign)' : 'Rashi (Moon Sign)'}
                      </label>
                      <select
                        value={devoteeForm.rashi}
                        onChange={(e) => setDevoteeForm({ ...devoteeForm, rashi: e.target.value })}
                        className="w-full rounded-xl border border-[#e5e9f0] bg-white px-4 py-3 text-sm text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
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
                      className="rounded-xl border border-[#d5d5d5] px-5 py-3 text-sm font-semibold text-[#555555] hover:bg-[#f7f7f7] transition cursor-pointer"
                    >
                      {language === 'KN' ? 'ಮರುಹೊಂದಿಸಿ (Reset)' : 'Reset'}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#f84464] px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e03152] hover:shadow-md cursor-pointer"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f2f5] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#f84464] to-[#ff6b85] text-2xl text-white shadow-sm">
                      📿
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222]">
                          {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ' : 'Devotee List'}
                        </h2>
                        <span className="rounded-full bg-[#f4f4f5] px-2.5 py-0.5 text-xs font-bold text-[#666666]">
                          {devotees.length} {language === 'KN' ? 'ಭಕ್ತರು' : 'Devotees'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#777777]">
                        {language === 'KN'
                          ? 'ಪೂಜಾ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಉಳಿಸಲಾದ ಕುಟುಂಬದ ಸದಸ್ಯರ ಪಟ್ಟಿ'
                          : 'Family members registered for sacred temple sankalpa'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Devotees List Only */}
                <div className="mt-8">
                  {devotees.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#e5e9f0] bg-[#fafbfc]">
                      <span className="text-5xl">📿</span>
                      <h4 className="mt-4 font-bold text-lg text-[#222222]">
                        {language === 'KN' ? 'ಇನ್ನೂ ಯಾವುದೇ ಭಕ್ತರನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ' : 'No devotees in your list yet'}
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-[#777777] max-w-md mx-auto">
                        {language === 'KN'
                          ? 'ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರ ಹೆಸರಿನಲ್ಲಿ ಸಂಕಲ್ಪ ಮಾಡಲು ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.'
                          : 'Add your family members with birth star (nakshatra) and rashi for authentic priest sankalpa during rituals.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => selectTab('add-devotee')}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f84464] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#e03152] transition cursor-pointer"
                      >
                        <span>➕</span>
                        <span>{language === 'KN' ? 'ಮೊದಲ ಭಕ್ತರನ್ನು ಸೇರಿಸಿ' : 'Add Your First Devotee'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#e5e9f0] bg-white shadow-2xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#e5e9f0] bg-[#fafbfc] text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                            <th className="py-3.5 px-4 text-center w-12">#</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಭಕ್ತರ ಹೆಸರು' : 'Devotee Name'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಸಂಬಂಧ' : 'Relationship'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ' : 'Nakshatra'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ರಾಶಿ' : 'Rashi'}</th>
                            <th className="py-3.5 px-4">{language === 'KN' ? 'ಗೋತ್ರ' : 'Gotram'}</th>
                            <th className="py-3.5 px-4 text-center w-44">{language === 'KN' ? 'ಕ್ರಿಯೆಗಳು' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f2f5] text-xs text-[#333333]">
                          {devotees.map((dev, idx) => {
                            const isEditing = editingDevoteeId === dev.id
                            if (isEditing) {
                              return (
                                <tr key={dev.id} className="bg-[#fffaf5]">
                                  <td colSpan={7} className="p-4 sm:p-5 border-l-4 border-l-[#f84464]">
                                    <form onSubmit={(e) => handleUpdateDevotee(dev.id, e)} className="space-y-4">
                                      <div className="flex items-center justify-between pb-2 border-b border-[#f0e6dc]">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-[#f84464]">✏️</span>
                                          <h4 className="font-bold text-xs sm:text-sm text-[#222222]">
                                            {language === 'KN'
                                              ? `${dev.name} ಅವರ ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ`
                                              : `Edit Details for ${dev.name}`}
                                          </h4>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={cancelEditingDevotee}
                                          className="text-xs font-bold text-[#777777] hover:text-[#222222] transition cursor-pointer"
                                        >
                                          ✕ {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                        {/* Name */}
                                        <div className="lg:col-span-1">
                                          <label className="block text-[10px] font-bold text-[#555555] mb-1">
                                            {language === 'KN' ? 'ಹೆಸರು *' : 'Name *'}
                                          </label>
                                          <input
                                            type="text"
                                            value={editDevoteeForm.name}
                                            onChange={(e) => {
                                              setEditDevoteeForm({ ...editDevoteeForm, name: e.target.value })
                                              if (editDevoteeErrors.name) setEditDevoteeErrors({})
                                            }}
                                            className={`w-full rounded-lg border px-3 py-2 text-xs text-[#222222] outline-none transition bg-white ${
                                              editDevoteeErrors.name
                                                ? 'border-[#f84464] bg-[#fff5f5]'
                                                : 'border-[#e5e9f0] focus:border-[#f84464]'
                                            }`}
                                            placeholder="Devotee name"
                                          />
                                        </div>

                                        {/* Relationship */}
                                        <div>
                                          <label className="block text-[10px] font-bold text-[#555555] mb-1">
                                            {language === 'KN' ? 'ಸಂಬಂಧ' : 'Relationship'}
                                          </label>
                                          <select
                                            value={editDevoteeForm.relationship}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, relationship: e.target.value })}
                                            className="w-full rounded-lg border border-[#e5e9f0] bg-white px-3 py-2 text-xs text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
                                          >
                                            <option value="Self">Self (ಸ್ವತಃ)</option>
                                            <option value="Spouse">Spouse (ಪತಿ / ಪತ್ನಿ)</option>
                                            <option value="Son">Son (ಮಗ)</option>
                                            <option value="Daughter">Daughter (ಮಗಳು)</option>
                                            <option value="Father">Father (ತಂದೆ)</option>
                                            <option value="Mother">Mother (ತಾಯಿ)</option>
                                            <option value="Brother">Brother (ಸಹೋದರ)</option>
                                            <option value="Sister">Sister (ಸಹೋದರಿ)</option>
                                            <option value="Other">Other (ಇತರರು)</option>
                                          </select>
                                        </div>

                                        {/* Nakshatra */}
                                        <div>
                                          <label className="block text-[10px] font-bold text-[#555555] mb-1">
                                            {language === 'KN' ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'}
                                          </label>
                                          <select
                                            value={editDevoteeForm.nakshatra}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, nakshatra: e.target.value })}
                                            className="w-full rounded-lg border border-[#e5e9f0] bg-white px-3 py-2 text-xs text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
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
                                          <label className="block text-[10px] font-bold text-[#555555] mb-1">
                                            {language === 'KN' ? 'ರಾಶಿ' : 'Rashi'}
                                          </label>
                                          <select
                                            value={editDevoteeForm.rashi}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, rashi: e.target.value })}
                                            className="w-full rounded-lg border border-[#e5e9f0] bg-white px-3 py-2 text-xs text-[#222222] outline-none transition focus:border-[#f84464] cursor-pointer"
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
                                          <label className="block text-[10px] font-bold text-[#555555] mb-1">
                                            {language === 'KN' ? 'ಗೋತ್ರ' : 'Gotram'}
                                          </label>
                                          <input
                                            type="text"
                                            value={editDevoteeForm.gotram}
                                            onChange={(e) => setEditDevoteeForm({ ...editDevoteeForm, gotram: e.target.value })}
                                            placeholder="e.g. Kashyapa"
                                            className="w-full rounded-lg border border-[#e5e9f0] bg-white px-3 py-2 text-xs text-[#222222] outline-none transition focus:border-[#f84464]"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={cancelEditingDevotee}
                                          className="rounded-lg border border-[#d5d5d5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#555555] hover:bg-[#f0f0f0] transition cursor-pointer"
                                        >
                                          {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                                        </button>
                                        <button
                                          type="submit"
                                          className="rounded-lg bg-[#f84464] px-4 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#e03152] transition cursor-pointer"
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
                              <tr key={dev.id} className="hover:bg-[#fafbfc] transition">
                                {/* Index */}
                                <td className="py-3.5 px-4 text-center font-semibold text-[#777777]">
                                  {idx + 1}
                                </td>

                                {/* Devotee Name */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-tr from-[#fff0f2] to-[#fef2f4] border border-[#fed7dc] text-[#f84464] font-bold text-xs shadow-2xs">
                                      {dev.name.charAt(0).toUpperCase() || '🕉️'}
                                    </div>
                                    <span className="font-bold text-sm text-[#222222]">{dev.name}</span>
                                  </div>
                                </td>

                                {/* Relationship */}
                                <td className="py-3.5 px-4">
                                  {dev.relationship ? (
                                    <span className="inline-block rounded-md bg-[#fef0f2] px-2.5 py-0.5 text-[11px] font-bold text-[#f84464]">
                                      {dev.relationship}
                                    </span>
                                  ) : (
                                    <span className="text-[#999999]">—</span>
                                  )}
                                </td>

                                {/* Nakshatra */}
                                <td className="py-3.5 px-4 font-medium text-[#444444]">
                                  {dev.nakshatra ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span className="text-[#f59e0b]">⭐</span>
                                      <span>{dev.nakshatra}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[#999999]">—</span>
                                  )}
                                </td>

                                {/* Rashi */}
                                <td className="py-3.5 px-4 font-medium text-[#444444]">
                                  {dev.rashi ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span className="text-[#3b82f6]">🌙</span>
                                      <span>{dev.rashi}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[#999999]">—</span>
                                  )}
                                </td>

                                {/* Gotram */}
                                <td className="py-3.5 px-4 font-medium text-[#444444]">
                                  {dev.gotram ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span className="text-[#8b5cf6]">🔱</span>
                                      <span>{dev.gotram}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[#999999]">—</span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditingDevotee(dev)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-[#e5e9f0] bg-white px-2.5 py-1.5 text-xs font-bold text-[#333333] hover:border-[#f84464] hover:text-[#f84464] hover:bg-[#fff9fa] transition cursor-pointer shadow-2xs"
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
                                          removeDevotee(dev.id)
                                          showToast(
                                            language === 'KN' ? `${dev.name} ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ` : `${dev.name} removed from devotee list`,
                                            'info'
                                          )
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 rounded-lg border border-[#fee2e2] bg-[#fff5f5] px-2.5 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2] transition cursor-pointer shadow-2xs"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#f0f2f5] gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#f84464] to-[#ff6b85] text-2xl text-white shadow-sm">
                      ❤️
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222]">
                          {language === 'KN' ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಸೇವೆಗಳು' : 'Your Wishlist'}
                        </h2>
                        <span className="rounded-full bg-[#fef0f2] px-2.5 py-0.5 text-xs font-bold text-[#f84464]">
                          {wishlistedSevas.length} {language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-[#777777]">
                        {language === 'KN'
                          ? 'ನೀವು ಉಳಿಸಿದ ಪವಿತ್ರ ದೇವಾಲಯ ಸೇವೆಗಳು ಮತ್ತು ಪೂಜೆಗಳು'
                          : 'Your saved sacred temple rituals, archanas, and special offerings'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8">
                  {wishlistedSevas.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-[#e5e9f0] bg-[#fafbfc]">
                      <span className="text-5xl">🤍</span>
                      <h4 className="mt-4 font-bold text-lg text-[#222222]">
                        {language === 'KN'
                          ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳ ಪಟ್ಟಿ ಖಾಲಿಯಾಗಿದೆ'
                          : 'Your Wishlist is Empty'}
                      </h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-[#777777] max-w-md mx-auto">
                        {language === 'KN'
                          ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಪವಿತ್ರ ಸೇವೆಗಳನ್ನು ಮೆಚ್ಚಿನವುಗಳಿಗೆ ಸೇರಿಸಿಲ್ಲ. ಲಭ್ಯವಿರುವ ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳನ್ನು ಉಳಿಸಲು ಹೃದಯ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
                          : 'You haven\'t saved any sacred sevas or temple offerings yet. Explore our available sevas and tap the heart icon to save your favourites.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/sevas')}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f84464] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#e03152] transition cursor-pointer"
                      >
                        <span>🪔</span>
                        <span>{language === 'KN' ? 'ಪವಿತ್ರ ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Sacred Sevas'}</span>
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
                            className={`group relative flex flex-col justify-between rounded-2xl border border-[#e5e9f0] bg-white p-4 shadow-2xs hover:shadow-sm transition-all duration-300 ${
                              isRemoving ? 'opacity-40 scale-[0.98]' : ''
                            }`}
                          >
                            <div className="flex gap-4">
                              <img
                                src={seva.image}
                                alt={seva.name}
                                className="h-24 w-24 shrink-0 rounded-xl object-cover border border-[#f0f2f5]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-bold text-base text-[#222222] truncate hover:text-[#f84464] transition">
                                    {seva.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveWishlistItem(seva.id, seva.name)}
                                    disabled={isRemoving}
                                    className={`grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 cursor-pointer shrink-0 shadow-2xs hover:scale-110 active:scale-95 ${
                                      isRemoving
                                        ? 'bg-white border-[#d1d5db] text-[#9ca3af]'
                                        : 'bg-[#fff1f2] border-[#fecdd3] text-[#e11d48] hover:bg-[#ffe4e6]'
                                    }`}
                                    title={isRemoving ? 'Removing...' : 'Remove from wishlist'}
                                    aria-label="Remove from wishlist"
                                  >
                                    {isRemoving ? (
                                      /* White Heart when removing (Meesho style) */
                                      <svg
                                        className="h-4.5 w-4.5 text-[#9ca3af]"
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
                                        className="h-4.5 w-4.5 fill-[#e11d48] text-[#e11d48]"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                                <p className="mt-1 text-xs text-[#777777] line-clamp-2 leading-relaxed">
                                  {seva.description}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#f0f2f5] flex items-center justify-between">
                              <div>
                                <span className="font-bold text-base text-[#c1440e]">
                                  {formatPrice(seva.price)}
                                </span>
                                {seva.originalPrice && (
                                  <span className="ml-2 text-xs text-[#888888] line-through">
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
                                    navigate('/sevas')
                                  }
                                  showToast(
                                    language === 'KN'
                                      ? `${seva.name} ಬುಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!`
                                      : `${seva.name} added to your seva basket!`,
                                    'success'
                                  )
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#f84464] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#e03152] transition cursor-pointer"
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

      {/* ── Language Switch Confirmation Modal ── */}
      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
      />
    </div>
  )
}

export default ProfilePage
