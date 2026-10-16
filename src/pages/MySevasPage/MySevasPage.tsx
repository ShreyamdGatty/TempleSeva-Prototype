import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order, User, Devotee } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { nakshatras, rashis } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'

interface MySevasPageProps {
  user: User | null
  orders: Order[]
  devotees: Devotee[]
  onAddDevotee: (devotee: Omit<Devotee, 'id'>) => void
  onUpdateDevotee: (id: string, updated: Partial<Devotee>) => void
  onRemoveDevotee: (id: string) => void
  onCancelOrder: (orderId: string) => void
  onReorder: (order: Order) => void
  onOpenQrPass: () => void
  onOpenSideMenu: () => void
  onLogin: () => void
  onRegister?: () => void
  onProfile: () => void
  onWishlist: () => void
  wishlistCount?: number
  showToast: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
}

const statusColor: Record<string, string> = {
  Confirmed: 'bg-[#e8f0fe] text-[#2b5a9e] border border-[#b9d5fc]',
  'In Progress': 'bg-[#fef3e2] text-[#9a6700] border border-[#fbd38d]',
  Completed: 'bg-[#e9f5ed] text-[#28724d] border border-[#b2e5c8]',
  Cancelled: 'bg-[#fde8e8] text-[#d94444] border border-[#f8b4b4]',
}

const MySevasPage = ({
  user,
  orders,
  devotees,
  onAddDevotee,
  onUpdateDevotee,
  onRemoveDevotee,
  onCancelOrder,
  onReorder,
  onOpenQrPass,
  onOpenSideMenu,
  onLogin,
  onProfile,
  onWishlist,
  wishlistCount = 0,
  showToast,
}: MySevasPageProps) => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t, translateTemple, translateSeva } = useLanguage()

  // Tabs: 'sevas' | 'devotees'
  const [activeTab, setActiveTab] = useState<'sevas' | 'devotees'>('sevas')

  // Filter for orders
  const [orderFilter, setOrderFilter] = useState<'all' | 'Confirmed' | 'Completed' | 'Cancelled'>('all')

  // Expanded tracking timeline IDs
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({})

  // Add/Edit Devotee Modal State
  const [isDevoteeModalOpen, setIsDevoteeModalOpen] = useState(false)
  const [editingDevoteeId, setEditingDevoteeId] = useState<string | null>(null)
  const [devoteeForm, setDevoteeForm] = useState<Omit<Devotee, 'id'>>({
    name: '',
    nakshatra: '',
    rashi: '',
    gotram: '',
    relationship: 'Family Member',
  })
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})

  const toggleTimeline = (orderId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const openAddDevotee = () => {
    navigate('/profile?tab=devotees', { state: { tab: 'devotees' } })
  }

  const openEditDevotee = (devotee: Devotee) => {
    if (!devotee.id) return
    setEditingDevoteeId(devotee.id)
    setDevoteeForm({
      name: devotee.name,
      nakshatra: devotee.nakshatra,
      rashi: devotee.rashi,
      gotram: devotee.gotram || '',
      relationship: devotee.relationship || 'Family Member',
    })
    setFormErrors({})
    setIsDevoteeModalOpen(true)
  }

  const handleSaveDevotee = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, boolean> = {}
    if (!devoteeForm.name.trim()) errs.name = true

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }

    if (editingDevoteeId) {
      onUpdateDevotee(editingDevoteeId, devoteeForm)
      showToast(t('devoteeUpdatedSuccess'), 'success')
    } else {
      onAddDevotee(devoteeForm)
      showToast(t('devoteeAddedSuccess'), 'success')
    }

    setIsDevoteeModalOpen(false)
  }

  const handleDeleteDevotee = (id?: string) => {
    if (!id) return
    if (window.confirm(language === 'KN' ? 'ಈ ಭಕ್ತರ ವಿವರವನ್ನು ಅಳಿಸುವುದೇ?' : 'Remove this devotee from sankalpa list?')) {
      onRemoveDevotee(id)
      showToast(t('devoteeDeletedSuccess'), 'info')
    }
  }

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter)

  const relationships = [
    { value: 'Self', label: t('relationshipSelf') },
    { value: 'Spouse', label: t('relationshipSpouse') },
    { value: 'Father', label: t('relationshipFather') },
    { value: 'Mother', label: t('relationshipMother') },
    { value: 'Son', label: t('relationshipSon') },
    { value: 'Daughter', label: t('relationshipDaughter') },
    { value: 'Family Member', label: t('relationshipFamily') },
  ]

  return (
    <div className="min-h-screen bg-[#fffcf6] text-[#34251e]">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-2xs">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4">
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
                    ಟೆಂಪಲ್<span className="text-[#c1440e]">ಸೇವಾ</span>
                  </>
                ) : (
                  <>
                    Temple<span className="text-[#c1440e]">Seva</span>
                  </>
                )}
              </span>
            </button>

            {/* Back link */}
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#eadfd1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#674f40] transition hover:border-[#c1440e] hover:text-[#c1440e] cursor-pointer"
            >
              <span>←</span>
              <span>{t('backToHome')}</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full border border-[#c1440e] bg-white px-3 py-1.5 text-xs font-bold text-[#c1440e] shadow-xs transition hover:bg-[#f5ede2] whitespace-nowrap cursor-pointer"
            >
              <span className="text-sm">🌐</span>
              <span>{language === 'EN' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Wishlist quick link */}
            <button
              onClick={onWishlist}
              className="relative hidden sm:grid h-9 w-9 place-items-center rounded-full border border-[#e0d3c5] bg-white text-sm transition hover:border-[#c1440e] cursor-pointer shrink-0"
              title={t('navFavorites')}
            >
              🤍
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#c1440e] text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Book More Sevas CTA */}
            <button
              onClick={() => navigate('/sevas')}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-4 py-2 text-xs font-bold text-[#c1440e] transition hover:bg-[#c1440e] hover:text-white shadow-xs cursor-pointer"
            >
              <span className="animate-diya">🪔</span>
              <span>{t('backToSevas')}</span>
            </button>

            {/* User Profile or Login */}
            {user ? (
              <button
                type="button"
                onClick={onProfile}
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#e0d3c5] bg-white px-3 py-1.5 text-xs font-bold whitespace-nowrap transition hover:border-[#c1440e] cursor-pointer"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#c1440e] text-[10px] text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:shadow-md cursor-pointer"
              >
                {t('navLogin')}
              </button>
            )}

            {/* Menu Trigger: Only shown after login is successful */}
            {user && (
              <button
                type="button"
                onClick={onOpenSideMenu}
                className="group flex items-center justify-center h-10 w-10 rounded-xl border border-[#e0d3c5] bg-white text-[#34251e] shadow-xs transition hover:border-[#c1440e] hover:bg-[#fff9f3] hover:text-[#c1440e] cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${user.name} - Profile & Menu`}
              >
                {/* Desktop View: Profile Icon */}
                <div className="relative hidden sm:flex items-center justify-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#34251e] group-hover:text-[#c1440e] transition-colors"
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
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#eadfd1] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f5ede2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#c1440e]">
              <span className="pulse-beacon" />
              <span>{t('ordersSub')}</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e]">
              {t('mySevasFullTitle')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#806f61] leading-relaxed">
              {t('mySevasFullSub')}
            </p>
          </div>

          {/* Quick Action: Add Devotee Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openAddDevotee}
              className="btn-primary sheen-card flex items-center gap-2 px-5 py-3 text-sm font-bold shadow-md cursor-pointer"
            >
              <span className="text-lg">📿</span>
              <span>{t('addDevoteeBtn')}</span>
            </button>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={onOpenQrPass}
                className="flex items-center gap-2 rounded-2xl border-2 border-[#d97706]/40 bg-white px-4 py-3 text-sm font-bold text-[#b45309] shadow-xs transition hover:border-[#c1440e] hover:bg-[#fffaf0] cursor-pointer"
              >
                <span>📱</span>
                <span>{t('sideMenuQrPass')}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Statistics Summary Cards ── */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs">
            <p className="text-xs font-bold uppercase text-[#8b7a6d]">Total Sevas</p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#c1440e]">
              {orders.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs">
            <p className="text-xs font-bold uppercase text-[#8b7a6d]">Confirmed</p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#2b5a9e]">
              {orders.filter((o) => o.status === 'Confirmed').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs">
            <p className="text-xs font-bold uppercase text-[#8b7a6d]">Completed</p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#28724d]">
              {orders.filter((o) => o.status === 'Completed').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs">
            <p className="text-xs font-bold uppercase text-[#8b7a6d]">Registered Devotees</p>
            <p className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#b87000]">
              {devotees.length}
            </p>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="mt-10 flex border-b border-[#eadfd1] gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('sevas')}
            className={`flex items-center gap-2 pb-4 text-base font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'sevas'
                ? 'border-[#c1440e] text-[#c1440e]'
                : 'border-transparent text-[#75685d] hover:text-[#34251e]'
            }`}
          >
            <span>🪔</span>
            <span>{t('tabMySevas')}</span>
            <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-xs text-[#674f40]">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devotees')}
            className={`flex items-center gap-2 pb-4 text-base font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'devotees'
                ? 'border-[#c1440e] text-[#c1440e]'
                : 'border-transparent text-[#75685d] hover:text-[#34251e]'
            }`}
          >
            <span>📿</span>
            <span>{t('tabDevotees')}</span>
            <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-xs text-[#674f40]">
              {devotees.length}
            </span>
          </button>
        </div>

        {/* ── TAB 1: MY SEVAS LIST ── */}
        {activeTab === 'sevas' && (
          <div className="mt-6">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'Confirmed', 'Completed', 'Cancelled'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setOrderFilter(filterKey)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      orderFilter === filterKey
                        ? 'bg-[#34251e] text-white shadow-xs'
                        : 'bg-white border border-[#eadfd1] text-[#674f40] hover:bg-[#f5ede2]'
                    }`}
                  >
                    {filterKey === 'all'
                      ? t('filterAll')
                      : filterKey === 'Confirmed'
                      ? t('filterConfirmed')
                      : filterKey === 'Completed'
                      ? t('filterCompleted')
                      : t('filterCancelled')}
                  </button>
                ))}
              </div>

              <p className="text-xs font-medium text-[#8b7a6d]">
                {filteredOrders.length} {t('itemsLabel').toLowerCase()}
              </p>
            </div>

            {/* Orders Listing */}
            {filteredOrders.length === 0 ? (
              <div className="mt-12 rounded-3xl border-2 border-dashed border-[#eadfd1] bg-white p-12 text-center">
                <span className="text-6xl">🪔</span>
                <h3 className="mt-4 font-serif text-2xl font-bold text-[#34251e]">
                  {t('noOrdersTitle')}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#8b7a6d]">
                  {language === 'KN'
                    ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಪೂಜಾ ಸೇವೆಗಳನ್ನು ಕಾಯ್ದಿರಿಸಿಲ್ಲ. ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳ ಸೇವೆಗಳನ್ನು ಈಗಲೇ ಅನ್ವೇಷಿಸಿ.'
                    : 'You have not booked any temple sevas yet. Explore sacred sanctuaries and offerings to receive divine priest blessings.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/sevas')}
                  className="btn-primary mt-6 px-6 py-3 text-sm font-bold cursor-pointer"
                >
                  <span className="mr-2">🪔</span>
                  <span>{t('backToSevas')}</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {filteredOrders.map((order) => {
                  const localizedTemple = translateTemple(order.temple)
                  const isTimelineOpen = !!expandedTimelines[order.id]

                  return (
                    <article
                      key={order.id}
                      className="rounded-3xl border border-[#eadfd1] bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      {/* Top Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3eae0] pb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={localizedTemple.image}
                            alt={localizedTemple.name}
                            className="h-14 w-14 rounded-2xl object-cover shadow-xs"
                          />
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c1440e]">
                              {order.id}
                            </span>
                            <h3 className="font-serif text-xl font-bold text-[#34251e]">
                              {localizedTemple.name}
                            </h3>
                            <p className="text-xs text-[#8b7a6d]">
                              📍 {localizedTemple.location} · 📅 {order.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              statusColor[order.status] ?? 'bg-gray-100'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items & Devotee Recipient */}
                      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
                            Booked Ritual Offerings:
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item) => {
                              const localizedSeva = translateSeva(item.seva)
                              return (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-xl bg-[#faf6f0] p-3 text-sm"
                                >
                                  <div>
                                    <p className="font-bold text-[#34251e]">
                                      {localizedSeva.name} × {item.quantity}
                                    </p>
                                    <p className="text-xs text-[#8b7a6d]">
                                      {localizedSeva.category.toUpperCase()} · {localizedSeva.duration}
                                    </p>
                                  </div>
                                  <span className="font-serif font-bold text-[#c1440e]">
                                    {formatPrice(item.seva.price * item.quantity)}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Sankalpa Recipient Box */}
                        <div className="rounded-2xl border border-[#eedecb] bg-[#fdf9f4] p-4 text-xs">
                          <div className="flex items-center gap-2 text-[#8a6842] font-bold">
                            <span>🕉️</span>
                            <span>Sankalpa Devotee Details</span>
                          </div>
                          <div className="mt-2.5 space-y-1.5 text-[#5e4b3c]">
                            <p>
                              <strong className="text-[#34251e]">Name:</strong>{' '}
                              {order.items[0]?.devotee?.name || user?.name || 'Devotee Family'}
                            </p>
                            <p>
                              <strong className="text-[#34251e]">Nakshatra:</strong>{' '}
                              {order.items[0]?.devotee?.nakshatra || 'Ashwini'}
                            </p>
                            <p>
                              <strong className="text-[#34251e]">Rashi:</strong>{' '}
                              {order.items[0]?.devotee?.rashi || 'Mesha'}
                            </p>
                            {order.items[0]?.devotee?.gotram && (
                              <p>
                                <strong className="text-[#34251e]">Gotram:</strong>{' '}
                                {order.items[0].devotee.gotram}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timeline (Collapsible) */}
                      {isTimelineOpen && (
                        <div className="mt-5 rounded-2xl border border-[#e8ded3] bg-[#fbf8f3] p-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e] mb-4">
                            Sacred Ritual Progress Timeline:
                          </p>
                          <div className="space-y-4">
                            {order.timeline.map((event, i) => (
                              <div key={event.label} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                                      event.completed
                                        ? 'bg-[#28724d] text-white'
                                        : 'border-2 border-[#d8c8b8] text-[#d8c8b8]'
                                    }`}
                                  >
                                    {event.completed ? '✓' : i + 1}
                                  </div>
                                  {i < order.timeline.length - 1 && (
                                    <div
                                      className={`w-0.5 flex-1 min-h-[30px] ${
                                        event.completed ? 'bg-[#28724d]' : 'bg-[#e3d7ca]'
                                      }`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`text-sm font-bold ${
                                      event.completed ? 'text-[#34251e]' : 'text-[#a39384]'
                                    }`}
                                  >
                                    {event.label}
                                  </p>
                                  <p className="text-xs text-[#8b7a6d]">{event.description}</p>
                                  {event.time && (
                                    <p className="mt-0.5 text-[10px] font-mono text-[#a39384]">
                                      {event.time}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Footer Actions */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#f3eae0] pt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8b7a6d]">{t('totalLabel')}:</span>
                          <span className="font-serif text-xl font-bold text-[#c1440e]">
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Toggle Timeline */}
                          <button
                            type="button"
                            onClick={() => toggleTimeline(order.id)}
                            className="rounded-xl border border-[#d8c8b8] bg-white px-3.5 py-1.5 text-xs font-bold text-[#674f40] transition hover:bg-[#f5ede2] cursor-pointer"
                          >
                            {isTimelineOpen ? t('hideTimeline') : t('viewTimeline')}
                          </button>

                          {/* View QR Pass */}
                          <button
                            type="button"
                            onClick={onOpenQrPass}
                            className="rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] px-3.5 py-1.5 text-xs font-bold text-[#16a34a] transition hover:bg-[#dcfce7] cursor-pointer"
                          >
                            📱 {t('viewPass')}
                          </button>

                          {/* Reorder */}
                          {order.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => onReorder(order)}
                              className="rounded-xl bg-[#c1440e] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#a5370a] shadow-xs cursor-pointer"
                            >
                              {t('reorderBtn')}
                            </button>
                          )}

                          {/* Cancel */}
                          {order.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => onCancelOrder(order.id)}
                              className="rounded-xl border border-[#d94444] px-3.5 py-1.5 text-xs font-bold text-[#d94444] transition hover:bg-[#fde8e8] cursor-pointer"
                            >
                              {t('cancelOrderBtn')}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: DEVOTEES LIST & ADD DEVOTEE DETAILS ── */}
        {activeTab === 'devotees' && (
          <div className="mt-6">
            {/* Devotee Section Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#eedecb] bg-gradient-to-r from-[#fff9f3] to-[#fffdf9] p-6 shadow-xs">
              <div>
                <span className="rounded-full bg-[#f5ede2] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c1440e]">
                  🕉️ Sacred Sankalpa
                </span>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#34251e]">
                  {t('familySankalpaTitle')}
                </h2>
                <p className="mt-1 max-w-xl text-xs sm:text-sm text-[#806f61]">
                  {t('familySankalpaSub')}
                </p>
              </div>

              {/* Add Devotee Details Primary Button */}
              <button
                type="button"
                onClick={openAddDevotee}
                className="btn-primary sheen-card flex items-center gap-2 px-5 py-3 text-sm font-bold shadow-md cursor-pointer shrink-0"
              >
                <span className="text-lg">📿</span>
                <span>{t('addDevoteeBtn')}</span>
              </button>
            </div>

            {/* Devotees Grid */}
            {devotees.length === 0 ? (
              <div className="mt-8 rounded-3xl border-2 border-dashed border-[#eadfd1] bg-white p-12 text-center">
                <span className="text-5xl">📿</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#34251e]">
                  {t('noDevoteesYet')}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#8b7a6d]">
                  {language === 'KN'
                    ? 'ಕುಟುಂಬ ಸದಸ್ಯರ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರವನ್ನು ಸೇರಿಸಿ. ಇದರಿಂದ ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ನೇರವಾಗಿ ಸಂಕಲ್ಪ ಮಾಡಲು ಸುಲಭವಾಗುತ್ತದೆ.'
                    : 'Save your family devotee names, birth stars (nakshatras), and gotras to easily attach individual or family sankalpas whenever you book sacred sevas.'}
                </p>
                <button
                  type="button"
                  onClick={openAddDevotee}
                  className="btn-primary mt-6 px-6 py-3 text-sm font-bold cursor-pointer"
                >
                  <span className="mr-2">📿</span>
                  <span>{t('addDevoteeBtn')}</span>
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {devotees.map((dev) => (
                  <div
                    key={dev.id}
                    className="relative flex flex-col justify-between rounded-3xl border border-[#eadfd1] bg-white p-5 shadow-xs transition hover:border-[#c1440e] hover:shadow-md"
                  >
                    <div>
                      {/* Relationship Pill & Avatar */}
                      <div className="flex items-center justify-between">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-xl text-white shadow-xs">
                          🙏
                        </span>
                        <span className="rounded-full bg-[#fdf2ea] px-3 py-1 text-xs font-bold text-[#c1440e] border border-[#fbd3b6]">
                          {dev.relationship || 'Devotee'}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="mt-4 font-serif text-xl font-bold text-[#34251e]">
                        {dev.name}
                      </h3>

                      {/* Nakshatra, Rashi, Gotram Chips */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-xl bg-[#faf6f0] px-3 py-1.5">
                          <span className="font-semibold text-[#8b7a6d]">🌟 {t('nakshatraLabel')}:</span>
                          <span className="font-bold text-[#34251e]">{dev.nakshatra}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-[#faf6f0] px-3 py-1.5">
                          <span className="font-semibold text-[#8b7a6d]">🌙 {t('rashiLabel')}:</span>
                          <span className="font-bold text-[#34251e]">{dev.rashi}</span>
                        </div>
                        {dev.gotram && (
                          <div className="flex items-center justify-between rounded-xl bg-[#faf6f0] px-3 py-1.5">
                            <span className="font-semibold text-[#8b7a6d]">🕉️ {t('gotramLabel')}:</span>
                            <span className="font-bold text-[#34251e]">{dev.gotram}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit / Remove */}
                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#f3eae0] pt-3">
                      <button
                        type="button"
                        onClick={() => openEditDevotee(dev)}
                        className="rounded-xl bg-[#f5ede2] px-3 py-1.5 text-xs font-bold text-[#674f40] transition hover:bg-[#ebdcc9] cursor-pointer"
                      >
                        ✏️ {t('editDevoteeTitle')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDevotee(dev.id)}
                        className="rounded-xl border border-[#eed7d7] px-3 py-1.5 text-xs font-bold text-[#d94444] transition hover:bg-[#fde8e8] cursor-pointer"
                      >
                        🗑️ {language === 'KN' ? 'ತೆಗೆದುಹಾಕಿ' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Devotee Card */}
                <button
                  type="button"
                  onClick={openAddDevotee}
                  className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#c1440e]/40 bg-[#fdfaf5] p-6 text-center transition hover:border-[#c1440e] hover:bg-[#fdf2e9]/50 hover:shadow-sm cursor-pointer group"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl text-[#c1440e] shadow-xs transition group-hover:scale-110">
                    +
                  </span>
                  <span className="mt-3 block font-serif text-base font-bold text-[#c1440e]">
                    {t('addDevoteeBtn')}
                  </span>
                  <span className="mt-1 block text-xs text-[#8b7a6d]">
                    {t('addDevoteeModalSub')}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── ADD / EDIT DEVOTEE DETAILS MODAL ── */}
      {isDevoteeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDevoteeModalOpen(false)}>
          <div
            className="modal-container w-full max-w-lg bg-[#fffdf9] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#eadfd1] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-xl text-white shadow-sm">
                  📿
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#34251e]">
                    {editingDevoteeId ? t('editDevoteeTitle') : t('addDevoteeModalTitle')}
                  </h3>
                  <p className="text-xs text-[#8b7a6d]">{t('addDevoteeModalSub')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDevoteeModalOpen(false)}
                className="modal-close cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Devotee Input Form */}
            <form onSubmit={handleSaveDevotee} className="mt-5 space-y-4">
              {/* Relationship */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1">
                  {t('relationshipLabel')}
                </label>
                <select
                  value={devoteeForm.relationship || 'Family Member'}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, relationship: e.target.value })}
                  className="input-field w-full rounded-xl border px-3.5 py-2.5 text-sm"
                >
                  {relationships.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Devotee Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1">
                  {t('devoteeNameLabel')} <span className="text-[#c1440e]">*</span>
                </label>
                <input
                  type="text"
                  value={devoteeForm.name}
                  onChange={(e) => {
                    setDevoteeForm({ ...devoteeForm, name: e.target.value })
                    if (formErrors.name) setFormErrors({ ...formErrors, name: false })
                  }}
                  placeholder={t('devoteeNamePlaceholder')}
                  className={`input-field w-full rounded-xl border px-3.5 py-2.5 text-sm ${
                    formErrors.name ? 'border-[#dc2626] bg-red-50' : 'border-[#e3d7ca]'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-[#dc2626]">{t('nameRequired')}</p>
                )}
              </div>

              {/* Nakshatra (Birth Star) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1">
                  {t('nakshatraLabel')} <span className="text-[#c1440e]">*</span>
                </label>
                <select
                  value={devoteeForm.nakshatra}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, nakshatra: e.target.value })}
                  className="input-field w-full rounded-xl border px-3.5 py-2.5 text-sm"
                >
                  {nakshatras.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rashi (Moon Sign) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1">
                  {t('rashiLabel')} <span className="text-[#c1440e]">*</span>
                </label>
                <select
                  value={devoteeForm.rashi}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, rashi: e.target.value })}
                  className="input-field w-full rounded-xl border px-3.5 py-2.5 text-sm"
                >
                  {rashis.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gotram */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1">
                  {t('gotramLabel')}
                </label>
                <input
                  type="text"
                  value={devoteeForm.gotram || ''}
                  onChange={(e) => setDevoteeForm({ ...devoteeForm, gotram: e.target.value })}
                  placeholder={t('gotramPlaceholder')}
                  className="input-field w-full rounded-xl border border-[#e3d7ca] px-3.5 py-2.5 text-sm"
                />
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex gap-3 border-t border-[#eadfd1] pt-4">
                <button
                  type="button"
                  onClick={() => setIsDevoteeModalOpen(false)}
                  className="flex-1 rounded-xl border border-[#d8c8b8] py-2.5 text-xs font-bold text-[#674f40] hover:bg-[#f5ede2] cursor-pointer"
                >
                  {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'KN' ? 'ಉಳಿಸಿ (Save Devotee)' : 'Save Devotee Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MySevasPage
