import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Temple, Seva, CartItem, User, Coupon } from '../../types'
import { sevas, categories, temples } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import CalendarModal, { isBeforeToday, isSameDay } from '../../components/CalendarModal/CalendarModal'
import SideMenuDrawer from '../../components/SideMenuDrawer/SideMenuDrawer'
import SankalpamModal from '../../components/SankalpamModal/SankalpamModal'
import SearchModal from '../../components/SearchModal/SearchModal'
import { IonIcon } from '../../components/IonIcon'
import type { Devotee, Order } from '../../types'

interface SevasPageProps {
  selectedTemple: Temple | null
  pickerOpen: boolean
  switchTemple?: () => void
  onSelectTemple: (temple: Temple) => void
  dates: string[]
  selectedDate: string
  setSelectedDate: (value: string) => void
  addSeva: (seva: Seva, selectedDate: string, slotOrNotice?: any, maybeNotice?: any) => void
  cart: CartItem[]
  subtotal: number
  discount: number
  total: number
  appliedCoupon?: Coupon | null
  changeQty: (id: string, amount: number, onNotice?: any) => void
  removeItem: (id: string) => void
  onPay?: () => void
  user: User | null
  logout: () => void
  onOrders: () => void
  ordersCount?: number
  onProfile: () => void
  onWishlist: () => void
  wishlistCount: number
  isWished: (id: string) => boolean
  onToggleWish: (id: string) => void
  onViewSevaDetails: (seva: Seva) => void
  onDevoteeDetails?: () => void
  onOpenQrPass?: () => void
  onLogin?: () => void
  onRegister?: () => void
  showToast: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
  devotees?: Devotee[]
  onAddDevotee?: (devotee: Omit<Devotee, 'id'>) => Devotee
  onCompleteOrder?: (paymentMethod: string, ticketAllocations: Record<string, Devotee[]>) => Order | null
  updateCartDate?: (date: string) => void
  onNavigateToAssignDevotee?: () => void
}


interface DateCardItem {
  id: string
  label: string
  dateObj: Date
  isPast: boolean
  isToday: boolean
  isCustom?: boolean
}

const SevasPage = ({
  selectedTemple,
  pickerOpen,
  onSelectTemple,
  selectedDate,
  setSelectedDate,
  addSeva,
  cart,
  discount,
  total: cartTotal,
  changeQty,
  removeItem,
  user,
  logout,
  onOrders,
  onProfile,
  onWishlist,
  wishlistCount,
  isWished,
  onToggleWish,
  onViewSevaDetails,
  ordersCount = 0,
  onDevoteeDetails,
  onOpenQrPass,
  onLogin,
  onRegister,
  showToast,
  devotees = [],
  onAddDevotee,
  onCompleteOrder,
  updateCartDate,
  onNavigateToAssignDevotee,
}: SevasPageProps) => {
  const { language, toggleLanguage, t, translateTemple, translateSeva, translateCategory, formatDateLocalized } = useLanguage()
  const navigate = useNavigate()

  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [sankalpamOpen, setSankalpamOpen] = useState(false)

  const handleSelectTempleFromSearch = (temple: Temple) => {
    setIsSearchModalOpen(false)
    if (onSelectTemple) {
      onSelectTemple(temple)
      navigate('/sevas')
    }
  }

  // Listen to openCart state from navigation (e.g. Book Seva from Favorites)
  const location = useLocation()
  useEffect(() => {
    if (location.state && (location.state as any).openCart) {
      setSankalpamOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc'>('price-asc')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [customDate, setCustomDate] = useState<Date | null>(null)

  // Generate dynamic date options starting from today (first 4 date cards)
  const dynamicDateCards: DateCardItem[] = useMemo(() => {
    const list: DateCardItem[] = []
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    for (let i = 0; i < 4; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      const label = formatDateLocalized(d)
      list.push({
        id: `d-${i}`,
        label,
        dateObj: d,
        isPast: isBeforeToday(d),
        isToday: isSameDay(d, now),
        isCustom: false,
      })
    }
    return list
  }, [formatDateLocalized])

  // Combine dynamic 4 date cards with single custom calendar-picked date if chosen
  const allDateCards: DateCardItem[] = useMemo(() => {
    const list: DateCardItem[] = [...dynamicDateCards]
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    if (customDate) {
      const existsInDynamic = dynamicDateCards.some((card) => isSameDay(card.dateObj, customDate))
      if (!existsInDynamic) {
        list.push({
          id: 'custom-chosen-date-card',
          label: formatDateLocalized(customDate),
          dateObj: customDate,
          isPast: isBeforeToday(customDate),
          isToday: isSameDay(customDate, now),
          isCustom: true,
        })
      }
    }
    return list
  }, [dynamicDateCards, customDate, formatDateLocalized])

  // Automatically select today's date if no date is set yet
  useEffect(() => {
    if (!selectedDate && dynamicDateCards.length > 0) {
      setSelectedDate(dynamicDateCards[0].label)
    }
  }, [selectedDate, dynamicDateCards, setSelectedDate])

  const activeTemple = selectedTemple || temples[0]
  const localizedTemple = translateTemple(activeTemple)

  const filteredAndSortedSevas = useMemo(() => {
    return sevas
      .map(translateSeva)
      .filter((seva) => {
        const matchesTemple = !activeTemple || !seva.templeId || seva.templeId === activeTemple.id
        const matchesSearch =
          seva.name.toLowerCase().includes(search.toLowerCase()) ||
          seva.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || seva.category === selectedCategory
        return matchesTemple && matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.price - a.price
        return a.price - b.price
      })
  }, [activeTemple, search, selectedCategory, sortBy, translateSeva])

  const handleAddSeva = (e: React.MouseEvent, seva: Seva) => {
    e.stopPropagation()
    const chosenSlot = selectedSlots[seva.id] || (seva.availableSlots && seva.availableSlots[0]) || '07:00 AM - Morning Pooja'
    addSeva(seva, selectedDate, chosenSlot, showToast)
  }

  const handleHeartClick = (e: React.MouseEvent, sevaId: string) => {
    e.stopPropagation()
    onToggleWish(sevaId)
    showToast(isWished(sevaId) ? (language === 'KN' ? 'ಮೆಚ್ಚಿನ ಪಟ್ಟಿಯಿಂದ ತೆಗೆಯಲಾಗಿದೆ' : 'Removed from wishlist') : (language === 'KN' ? 'ಮೆಚ್ಚಿನ ಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ' : 'Added to wishlist'), 'info')
  }

  return (
    <>
      {/* ── Sevas Page Navbar with Active Sanctuary Banner ── */}
      <header className="sticky top-0 z-40 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-xs">
        <div className="w-full flex min-h-[60px] sm:h-[74px] items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-0 gap-2 sm:gap-4">
          {/* Active Sanctuary Info */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 text-left flex-1">
            <img
              src={localizedTemple.image}
              alt={localizedTemple.name}
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover shadow-2xs shrink-0"
            />
            <div className="min-w-0 text-left">
              <h2 className="font-serif text-base sm:text-2xl font-bold text-[#2c1d16] leading-tight truncate">
                {localizedTemple.name}
              </h2>
              <p className="text-[11px] sm:text-sm text-[#8b7a6d] flex items-center gap-1 mt-0.5 truncate">
                <span className="text-xs sm:text-sm leading-none">📍</span>
                <span>{localizedTemple.location}</span>
              </p>
            </div>
          </div>

          {/* Right Action Buttons: Home, My Sevas, Wishlist (with heart icon) & Switch Temple */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5c4d41] hover:text-[#c1440e] transition cursor-pointer py-1.5 px-2 sm:px-3 rounded-lg hover:bg-[#faefe2]"
            >
              <IonIcon name="home-outline" className="text-sm shrink-0" />
              <span className="hidden sm:inline">{t('navHome')}</span>
            </button>

            {/* 2. My Sevas */}
            {user ? (
              <button
                type="button"
                onClick={onOrders}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5c4d41] hover:text-[#c1440e] transition cursor-pointer py-1.5 px-2 sm:px-3 rounded-lg hover:bg-[#faefe2]"
              >
                <span className="hidden sm:inline">{t('navMySevas')}</span>
                <span className="sm:hidden">{language === 'KN' ? 'ಆರ್ಡರ್' : 'Orders'}</span>
              </button>
            ) : null}

            {/* 3. Wishlist icon button (exact style as in My Sevas page, no text) */}
            <button
              type="button"
              onClick={onWishlist}
              className="relative flex items-center justify-center rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] p-1.5 sm:p-2 text-xs font-semibold text-[#5c4d41] hover:text-[#c1440e] shadow-2xs transition cursor-pointer shrink-0"
              title={language === 'KN' ? 'ಮೆಚ್ಚಿನವುಗಳು' : 'Wishlist'}
              aria-label="Wishlist"
            >
              <IonIcon name="heart-outline" className="text-sm sm:text-base text-[#c1440e]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#c1440e] px-1 text-[10px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            <span className="hidden sm:inline-block h-4 w-px bg-[#eadfd1]" />

            {/* 4. Switch Temple */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-bold uppercase tracking-wider text-[#c1440e] hover:text-[#a0360a] transition cursor-pointer shrink-0"
            >
              <span className="hidden sm:inline">{t('switchTemple')}</span>
              <span className="sm:hidden">{language === 'KN' ? 'ಬದಲಾಯಿಸಿ' : 'Switch'}</span>
              <span className="text-xs sm:text-sm font-bold">➔</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Search Modal with Blurred Background and Temple Cards Grid ── */}
      <SearchModal
        isOpen={isSearchModalOpen || pickerOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTemple={handleSelectTempleFromSearch}
        selectedTemple={selectedTemple}
        user={user}
      />

      <main className="mx-auto max-w-7xl px-3 sm:px-5 pt-3 pb-8 lg:px-8">

          {/* ── Sacred Date Selector with "Select Date" Calendar Card ── */}
          <section className="mt-2 sm:mt-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl">{t('step1DateTitle')}</h3>
                <p className="text-sm text-[#8b7a6d]">{t('step1DateSub')}</p>
              </div>
              {selectedDate && (
                <span className="rounded-full bg-[#e9f5ed] px-3.5 py-1 text-xs font-bold text-[#28724d] shadow-sm">
                  {t('selectedBadge')}: {selectedDate}
                </span>
              )}
            </div>

            <div className="mt-2.5 flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-2 items-center no-scrollbar">
              {/* Dedicated "Select Date" Card which opens interactive Calendar */}
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="group relative flex h-[66px] sm:h-[70px] w-[80px] min-w-[80px] shrink-0 flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed border-[#b84218] bg-[#fdfbf7] p-1.5 text-center transition-all hover:bg-[#faefe2] hover:shadow-xs cursor-pointer"
              >
                {/* 3D-style Calendar Icon matching the theme */}
                <svg className="w-5 h-5 mb-0.5 transition-transform group-hover:scale-105" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="30" height="26" rx="6" fill="#818cf8" />
                  <rect x="5.5" y="13" width="25" height="18" rx="4" fill="#ffffff" />
                  <rect x="9.5" y="3.5" width="3.5" height="7" rx="1.75" fill="#4f46e5" />
                  <rect x="23" y="3.5" width="3.5" height="7" rx="1.75" fill="#4f46e5" />
                  <circle cx="11" cy="18" r="1.5" fill="#818cf8" />
                  <circle cx="18" cy="18" r="1.5" fill="#818cf8" />
                  <circle cx="25" cy="18" r="1.5" fill="#ef4444" />
                  <circle cx="11" cy="24" r="1.5" fill="#818cf8" />
                  <circle cx="18" cy="24" r="1.5" fill="#3b82f6" />
                  <circle cx="25" cy="24" r="1.5" fill="#818cf8" />
                </svg>
                <span className="block font-serif text-[11px] font-bold text-[#b84218] leading-tight">
                  {t('selectDateCard')}
                </span>
                <span className="block text-[8.5px] font-medium text-[#8c7d70] leading-tight mt-0.5">
                  {t('selectDateCardSub')}
                </span>
              </button>

              {/* Date Option Cards (Past dates disabled, today marked, plus any selected custom date on the right) */}
              {allDateCards.map((card) => {
                const isSelected = selectedDate === card.label
                const [datePart, ...monthParts] = card.label.split(' ')
                const monthPart = monthParts.join(' ')

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.isPast}
                    onClick={() => {
                      setSelectedDate(card.label)
                      if (updateCartDate) updateCartDate(card.label)
                    }}
                    className={`relative flex h-[66px] sm:h-[70px] w-[62px] min-w-[62px] shrink-0 flex-col items-center justify-center rounded-xl text-center transition-all cursor-pointer ${
                      card.isPast
                        ? 'cursor-not-allowed border border-[#e3d7ca] bg-[#f9f5f0] text-[#a8998c] opacity-40 line-through'
                        : isSelected
                        ? 'bg-[#b84218] text-white shadow-[0_4px_14px_-2px_rgba(184,66,24,0.4)] font-bold scale-[1.02]'
                        : 'border border-[#eadfd1] bg-white text-[#241b16] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:border-[#b84218]/60 hover:bg-[#fffdfa]'
                    }`}
                  >
                    {/* Today Badge on Card */}
                    {card.isToday && (
                      <span
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0 text-[7.5px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap bg-[#c58c2b] text-white"
                      >
                        {t('todayBadge')}
                      </span>
                    )}

                    {/* Chosen Date Badge on Selected Card */}
                    {isSelected && !card.isToday && (
                      <span
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0 text-[7.5px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap bg-[#c58c2b] text-white"
                      >
                        {language === 'KN' ? 'ಆಯ್ಕೆ ದಿನ' : 'Chosen'}
                      </span>
                    )}

                    <span className="block font-serif text-[18px] sm:text-[19px] font-bold leading-none mb-0.5">{datePart}</span>
                    <span className="block text-[9.5px] font-black uppercase tracking-wider leading-none opacity-90">
                      {monthPart}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Sevas Explorer ── */}
          <section className="mt-10">
            {/* Filter & Search Toolbar */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h3 className="font-serif text-2xl">{t('step2SevaTitle')}</h3>
                <p className="mt-1 text-sm text-[#8b7a6d]">
                  {selectedDate
                    ? `${t('step2SevaSubWithDate')} ${selectedDate}`
                    : t('step2SevaSubNoDate')}
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <div className="flex flex-1 sm:flex-none items-center gap-2 rounded-xl border border-[#e3d7ca] bg-white px-3 py-2 shadow-sm min-w-0">
                  <span className="text-[#c1440e] shrink-0">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full sm:w-48 bg-transparent text-xs sm:text-sm outline-none"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-sm text-[#8b7a6d] shrink-0">
                      ×
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort Sevas"
                  className="shrink-0 rounded-xl border border-[#e3d7ca] bg-white px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-[#34251e] outline-none shadow-sm cursor-pointer"
                >
                  <option value="price-asc">{t('sortPriceLowHigh')}</option>
                  <option value="price-desc">{t('sortPriceHighLow')}</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#34251e] text-white shadow'
                      : 'bg-[#f5ede2] text-[#674f40] hover:bg-[#ecd9c6]'
                  }`}
                >
                  {translateCategory(cat)}
                </button>
              ))}
            </div>

            {/* Sevas Grid */}
            {!selectedDate ? (
              <div className="mt-6 rounded-3xl border border-dashed border-[#d8c8b8] p-12 text-center text-[#8b7a6d]">
                <p className="font-serif text-xl">{t('noDatePromptTitle')}</p>
                <p className="mt-1 text-sm">{t('noDatePromptSub')}</p>
              </div>
            ) : filteredAndSortedSevas.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-[#d8c8b8] p-12 text-center text-[#8b7a6d]">
                <p className="font-serif text-xl">{t('noMatchTitle')}</p>
                <p className="mt-1 text-sm">{t('noMatchSub')}</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredAndSortedSevas.map((seva) => {
                  const wished = isWished(seva.id)
                  const discountPct = seva.originalPrice
                    ? Math.round(((seva.originalPrice - seva.price) / seva.originalPrice) * 100)
                    : 0

                  return (
                    <article
                      key={seva.id}
                      onClick={() => onViewSevaDetails(seva)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eadfd1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c1440e]/40 hover:shadow-xl cursor-pointer"
                    >
                      {/* Image + Badges */}
                      <div className="relative">
                        <img
                          src={seva.image}
                          alt={seva.name}
                          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/temple-hero.webp'
                          }}
                        />
                        <button
                          onClick={(e) => handleHeartClick(e, seva.id)}
                          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110"
                          title="Save to favorites"
                        >
                          {wished ? '❤️' : '🤍'}
                        </button>
                        {discountPct > 0 && (
                          <div className="absolute bottom-2 left-2 flex gap-1.5">
                            <span className="rounded-full bg-[#28724d] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                              {discountPct}% {t('offBadge')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold uppercase tracking-wider text-[#c1440e]">
                              {translateCategory(seva.category)}
                            </span>
                            <span className="text-[#8b7a6d]">⏱ {seva.duration}</span>
                          </div>

                          <h4 className="mt-2 font-serif text-lg font-bold leading-tight text-[#34251e] group-hover:text-[#c1440e]">
                            {seva.name}
                          </h4>

                          <p className="mt-2 text-xs leading-5 text-[#75685d] line-clamp-2">
                            {seva.description}
                          </p>

                          {/* Reminder (e.g. priest reminder, whatsapp notifications) */}
                          {seva.reminder && (
                            <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#fff8ee] border border-[#f5cfb5]/70 px-2.5 py-1 text-[11px] text-[#8a6842]">
                              <span>🔔</span>
                              <span className="font-medium line-clamp-1">{seva.reminder}</span>
                            </div>
                          )}

                          {/* Slot Selector */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#5c4d41] mb-1">
                              <span>Select Time Slot:</span>
                              <span className="text-[10px] text-[#c1440e] font-semibold">Available</span>
                            </div>
                            <select
                              value={
                                selectedSlots[seva.id] ||
                                (seva.availableSlots && seva.availableSlots[0]) ||
                                '07:00 AM - Morning Pooja'
                              }
                              onChange={(e) => {
                                setSelectedSlots((prev) => ({ ...prev, [seva.id]: e.target.value }))
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full rounded-xl border border-[#d8c8b8] bg-[#fffdfa] px-2.5 py-1.5 text-xs font-semibold text-[#34251e] hover:border-[#c1440e] transition cursor-pointer"
                            >
                              {(seva.availableSlots || [
                                '07:00 AM - Morning Pooja',
                                '09:30 AM - Sankalpa Batch',
                                '11:30 AM - Abhishekam',
                                '06:00 PM - Sandhya Deepotsava',
                              ]).map((slotOption) => (
                                <option key={slotOption} value={slotOption}>
                                  {slotOption}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Footer / Price & Stepper or Add button */}
                        <div className="mt-4 border-t border-[#f5ede2] pt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-serif text-lg font-bold text-[#34251e]">
                                {formatPrice(seva.price)}
                              </span>
                              {seva.originalPrice && (
                                <span className="ml-1.5 text-xs text-[#8b7a6d] line-through">
                                  {formatPrice(seva.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Stepper if in cart, or Add button without + sign */}
                            {(() => {
                              const chosenSlot =
                                selectedSlots[seva.id] ||
                                (seva.availableSlots && seva.availableSlots[0]) ||
                                '07:00 AM - Morning Pooja'
                              const itemInCart = cart.find(
                                (item) => item.seva.id === seva.id && (!item.slot || item.slot === chosenSlot)
                              )
                              const maxQty = seva.maxQuantity || 5

                              if (itemInCart) {
                                const isMax = itemInCart.quantity >= maxQty
                                return (
                                  <div className="flex items-center gap-1.5 rounded-xl border border-[#c1440e] bg-[#fffaf5] p-1 shadow-2xs">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        changeQty(itemInCart.id, -1, showToast)
                                      }}
                                      className="grid h-7 w-7 place-items-center rounded-lg bg-white text-xs font-bold text-[#c1440e] hover:bg-[#c1440e] hover:text-white transition shadow-2xs cursor-pointer"
                                      title="Decrease quantity"
                                    >
                                      −
                                    </button>
                                    <span className="w-6 text-center text-xs font-bold text-[#c1440e]">
                                      {itemInCart.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={isMax}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        changeQty(itemInCart.id, 1, showToast)
                                      }}
                                      className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold transition shadow-2xs ${
                                        isMax
                                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                          : 'bg-white text-[#c1440e] hover:bg-[#c1440e] hover:text-white cursor-pointer'
                                      }`}
                                      title={isMax ? `Max limit (${maxQty}) reached` : 'Increase quantity'}
                                    >
                                      +
                                    </button>
                                  </div>
                                )
                              }

                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addSeva(seva, selectedDate, chosenSlot, showToast)
                                  }}
                                  className="rounded-xl bg-[#c1440e] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#a5370a] cursor-pointer"
                                >
                                  {t('addBtn')}
                                </button>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

      {/* ── Modern Curved Floating Cart Bar ── */}
      {cart.length > 0 && (
        <aside
          onClick={() => setSankalpamOpen(true)}
          className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-full max-w-md rounded-2xl sm:rounded-full bg-gradient-to-r from-[#2c1d15] via-[#3a251b] to-[#2c1d15] px-3 sm:px-4 py-2 sm:py-2.5 text-white shadow-2xl border border-[#d4a64a]/40 backdrop-blur-md transition-all hover:scale-[1.01] cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
              <div className="relative grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#c1440e] text-sm sm:text-lg font-bold shadow-sm shrink-0">
                🛒
                <span className="absolute -right-1 -top-1 grid h-4 w-4 sm:h-5 sm:w-5 place-items-center rounded-full bg-[#f2c778] text-[9px] sm:text-[10px] font-black text-[#34251e]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-[#fbf6f0] truncate leading-tight">
                  {cart.length} {t('cartTitle')} · <span className="text-[#f2c778]">{formatPrice(cartTotal)}</span>
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#eadfd1] truncate leading-tight mt-0.5">
                  {selectedDate} · Tap to view & assign devotees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSankalpamOpen(true)
                }}
                className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-md transition hover:brightness-110 cursor-pointer whitespace-nowrap"
              >
                View Cart →
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Sankalpam & My Cart Modal ── */}
      {sankalpamOpen && (
        <SankalpamModal
          isOpen={sankalpamOpen}
          onClose={() => setSankalpamOpen(false)}
          cart={cart}
          selectedTemple={selectedTemple}
          selectedDate={selectedDate}
          subtotal={cartTotal + discount}
          discount={discount}
          total={cartTotal}
          changeQty={changeQty}
          removeItem={removeItem}
          devotees={devotees}
          onAddDevotee={onAddDevotee || ((d) => ({ ...d, id: `dev-${Date.now()}` }))}
          onCompleteOrder={onCompleteOrder || (() => null)}
          user={user}
          onLogin={onLogin || (() => {})}
          showToast={showToast}
          onNavigateToMySevas={onOrders}
          onNavigateToAssignDevotee={onNavigateToAssignDevotee || (() => navigate('/sankalpam'))}
        />
      )}

      {/* ── Calendar Modal ── */}
      {calendarOpen && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={(newDate, dateObj) => {
            // Check if the selected date already exists in the initial 4 date cards
            const existsInCards = dynamicDateCards.some((card) => isSameDay(card.dateObj, dateObj))
            if (!existsInCards) {
              // Updates the same custom card (e.g. if 28 was picked, then user picks 29, updates the same card)
              setCustomDate(dateObj)
            } else {
              setCustomDate(null)
            }
            setSelectedDate(newDate)
            if (updateCartDate) updateCartDate(newDate)
            showToast(`${t('selectedBadge')}: ${newDate}`, 'success')
          }}
          onClose={() => setCalendarOpen(false)}
        />
      )}

      {/* ── Slide-Out Side Modal / Drawer (Rendered via React Portal onto document.body) ── */}
      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        user={user}
        wishlistCount={wishlistCount}
        ordersCount={ordersCount}
        onWishlist={onWishlist}
        onDevoteeDetails={() => {
          if (onDevoteeDetails) onDevoteeDetails()
        }}
        onProfile={onProfile}
        onLogout={logout}
        onOrders={onOrders}
        onOpenQrPass={onOpenQrPass}
        onSwitchTemple={() => {
          setSideMenuOpen(false)
          setIsSearchModalOpen(true)
        }}
        onSevas={() => {
          setSideMenuOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onLogin={onLogin || (() => {})}
        onRegister={onRegister || (() => {})}
      />
      </main>
    </>
  )
}

export default SevasPage
