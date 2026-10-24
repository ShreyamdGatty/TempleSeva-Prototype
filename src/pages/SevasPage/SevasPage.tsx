import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Temple, Seva, CartItem, User, Coupon } from '../../types'
import { sevas, categories, temples } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import CalendarModal, { isBeforeToday, isSameDay } from '../../components/CalendarModal/CalendarModal'
import SideMenuDrawer from '../../components/SideMenuDrawer/SideMenuDrawer'
import SankalpamModal from '../../components/SankalpamModal/SankalpamModal'
import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown'
import type { Devotee, Order } from '../../types'

interface SevasPageProps {
  selectedTemple: Temple | null
  pickerOpen: boolean
  switchTemple: () => void
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
  switchTemple,
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
}: SevasPageProps) => {
  const { language, toggleLanguage, t, translateTemple, translateSeva, translateCategory, formatDateLocalized } = useLanguage()
  const navigate = useNavigate()

  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [sankalpamOpen, setSankalpamOpen] = useState(false)

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
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
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
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
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
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-2xs">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-left shrink-0 cursor-pointer"
            >
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

            {/* Home link */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center rounded-full border border-[#eadfd1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#674f40] transition hover:border-[#c1440e] hover:text-[#c1440e] cursor-pointer"
              title="Home"
            >
              <span>{t('navHome')}</span>
            </button>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Switch Sanctuary Pill */}
            <button
              onClick={switchTemple}
              className="hidden sm:flex items-center rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] px-3.5 py-1.5 text-xs font-semibold text-[#5c4d41] hover:text-[#c1440e] shadow-2xs transition cursor-pointer"
            >
              <span>{t('switchTemple')}</span>
            </button>

            {/* Language Dropdown (Globe Icon Only) */}
            <LanguageDropdown />

            {user ? (
              <>
                <button
                  type="button"
                  onClick={onOrders}
                  className="flex items-center rounded-full bg-[#f5ede2] hover:bg-[#ebdcc9] px-3.5 py-1.5 text-xs font-bold text-[#5c4d41] transition cursor-pointer"
                >
                  <span className="hidden sm:inline">{t('navMySevas')}</span>
                </button>

                {/* Standard neat User Account / Profile button */}
                <button
                  type="button"
                  onClick={() => setSideMenuOpen(true)}
                  className="group flex items-center gap-2 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] pl-1 pr-3 py-1 text-xs font-bold text-[#34251e] shadow-2xs transition cursor-pointer"
                  aria-label="Open profile menu"
                  title={`${user.name} - Profile & Menu`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-[11px] font-bold text-white shadow-2xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-[#34251e] group-hover:text-[#c1440e] transition-colors max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogin}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={onRegister}
                  className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm whitespace-nowrap transition hover:shadow-md cursor-pointer"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* ── Top Header Navigation ── */}
        <div className="flex flex-col justify-between gap-5 border-b border-[#eadfd1] pb-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {t('sevaStudioHeader')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{t('sevaStudioTitle')}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 rounded-full border border-[#eadfd1] bg-white px-3.5 py-2 text-xs font-bold text-[#5c4d41] transition hover:border-[#c1440e] hover:text-[#c1440e] cursor-pointer"
            >
              <span>🏠</span>
              <span>{t('navHome')}</span>
            </button>
            {user && (
              <button
                onClick={switchTemple}
                className="rounded-full border border-[#d8c8b8] bg-white px-4 py-2 text-sm font-bold transition hover:border-[#c1440e] cursor-pointer"
              >
                {t('switchTemple')}
              </button>
            )}
          {user ? (
            <>
              <button
                type="button"
                onClick={onOrders}
                className="flex items-center gap-1.5 rounded-full bg-[#f5ede2] hover:bg-[#ebdcc9] px-3.5 py-2 text-xs font-bold text-[#5c4d41] transition cursor-pointer"
              >
                <span>📿</span>
                <span>{t('navMySevas')}</span>
              </button>

              {/* Standard neat User Account / Profile button */}
              <button
                type="button"
                onClick={() => setSideMenuOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] pl-1 pr-3 py-1 text-xs font-bold text-[#34251e] shadow-2xs transition cursor-pointer"
                aria-label="Open profile menu"
                title={`${user.name} - Profile & Menu`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-[11px] font-bold text-white shadow-2xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-[#34251e] group-hover:text-[#c1440e] transition-colors max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                className="rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
              >
                {t('navLogin')}
              </button>
              <button
                onClick={onRegister}
                className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-4 py-2 text-sm font-bold text-white shadow-sm whitespace-nowrap transition hover:shadow-md cursor-pointer"
              >
                {t('navRegister')}
              </button>
            </div>
          )}
        </div>
      </div>


      {localizedTemple ? (
        <>
          {/* ── Selected Temple Banner ── */}
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#eadfd1] bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src={localizedTemple.image}
                alt={localizedTemple.name}
                className="h-20 w-20 rounded-2xl object-cover shadow-sm"
              />
              <div>
                <span className="rounded-full bg-[#f5ede2] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#c1440e]">
                  {t('activeSanctuary')}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {localizedTemple.name}
                </h2>
                <p className="text-sm text-[#8b7a6d]">📍 {localizedTemple.location}</p>
              </div>
            </div>
            <button
              onClick={switchTemple}
              className="text-xs font-bold uppercase tracking-wider text-[#c1440e] hover:underline cursor-pointer"
            >
              {t('changeLocation')}
            </button>
          </div>

          {/* ── Sacred Date Selector with "Select Date" Calendar Card ── */}
          <section className="mt-8">
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

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 items-center">
              {/* Dedicated "Select Date" Card which opens interactive Calendar */}
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="group relative flex min-w-[130px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c1440e] bg-[#fdfaf5] p-3 text-center transition-all hover:bg-[#faefe2] hover:shadow-md cursor-pointer"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">📅</span>
                <span className="mt-1 block font-serif text-sm font-bold text-[#c1440e]">
                  {t('selectDateCard')}
                </span>
                <span className="block text-[10px] font-semibold text-[#8b7a6d]">
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
                    className={`relative min-w-[92px] rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                      card.isPast
                        ? 'cursor-not-allowed border-[#e3d7ca] bg-[#f9f5f0] text-[#a8998c] opacity-40 line-through'
                        : isSelected
                        ? 'scale-105 border-[#c1440e] bg-[#c1440e] text-white shadow-lg font-bold'
                        : 'border-[#e3d7ca] bg-white text-[#34251e] hover:border-[#c1440e]/60 hover:bg-[#fff9f3]'
                    }`}
                  >
                    {/* Today Badge on Card */}
                    {card.isToday && (
                      <span
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${
                          isSelected ? 'bg-[#d4a64a] text-[#34251e]' : 'bg-[#d4a64a] text-white'
                        }`}
                      >
                        {t('todayBadge')}
                      </span>
                    )}

                    {/* Custom Chosen Date Badge on Card */}
                    {card.isCustom && !card.isToday && (
                      <span
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap ${
                          isSelected ? 'bg-[#d4a64a] text-[#34251e]' : 'bg-[#c1440e] text-white'
                        }`}
                      >
                        {language === 'KN' ? 'ಆಯ್ಕೆ ದಿನಾಂಕ' : 'Chosen Date'}
                      </span>
                    )}

                    <span className="block font-serif text-2xl font-bold">{datePart}</span>
                    <span className="mt-0.5 block text-xs font-bold uppercase tracking-wider opacity-85">
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#e3d7ca] bg-white px-3 py-2 shadow-sm">
                  <span className="text-[#c1440e]">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-48 bg-transparent text-sm outline-none"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="text-sm text-[#8b7a6d]">
                      ×
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort Sevas"
                  className="rounded-xl border border-[#e3d7ca] bg-white px-3 py-2 text-sm font-semibold text-[#34251e] outline-none shadow-sm cursor-pointer"
                >
                  <option value="featured">{t('sortFeatured')}</option>
                  <option value="price-asc">{t('sortPriceLowHigh')}</option>
                  <option value="price-desc">{t('sortPriceHighLow')}</option>
                  <option value="rating">{t('sortRating')}</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
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
                        <div className="absolute bottom-2 left-2 flex gap-1.5">
                          {seva.popular && (
                            <span className="rounded-full bg-[#c1440e] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                              {t('popularBadge')}
                            </span>
                          )}
                          {discountPct > 0 && (
                            <span className="rounded-full bg-[#28724d] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                              {discountPct}% {t('offBadge')}
                            </span>
                          )}
                        </div>
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

                          <div className="mt-2.5 pt-2 border-t border-[#f5ede2]">
                            {seva.requiresDevotee ? (
                              <p className="text-[11px] font-bold text-[#c1440e] flex items-center gap-1.5">
                                <span>🕉️</span>
                                <span>{language === 'KN' ? 'ಸಂಕಲ್ಪಕ್ಕೆ ಭಕ್ತರ ವಿವರ ಅಗತ್ಯ' : 'Devotee Required for Sankalpa'}</span>
                              </p>
                            ) : (
                              <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                                <span className="font-bold">✓</span>
                                <span>{language === 'KN' ? 'ಭಕ್ತರ ಅಗತ್ಯವಿಲ್ಲ (ಮುಕ್ತ ಸೇವೆ)' : 'Devotee Not Needed (Open Offering)'}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-[#d8c8b8] p-16 text-center">
          <p className="font-serif text-2xl font-bold">{t('chooseTemplePrompt')}</p>
          <button onClick={switchTemple} className="btn-primary mt-4">
            {t('chooseTempleBtn')}
          </button>
        </div>
      )}

      {/* ── Modern Curved Floating Cart Bar ── */}
      {cart.length > 0 && (
        <aside
          onClick={() => setSankalpamOpen(true)}
          className="fixed bottom-6 left-4 right-4 z-40 mx-auto max-w-xl rounded-full bg-gradient-to-r from-[#2c1d15] via-[#3a251b] to-[#2c1d15] px-5 py-3 text-white shadow-2xl border border-[#d4a64a]/40 backdrop-blur-md transition-all hover:scale-[1.01] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-[#c1440e] text-lg font-bold shadow-sm">
                🛒
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f2c778] text-[10px] font-black text-[#34251e]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#fbf6f0]">
                  {cart.length} {t('cartTitle')} · <span className="text-[#f2c778]">{formatPrice(cartTotal)}</span>
                </p>
                <p className="text-[11px] text-[#eadfd1]">
                  {selectedDate} · Tap to view & assign devotees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSankalpamOpen(true)
                }}
                className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110 cursor-pointer"
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
        onSwitchTemple={switchTemple}
        onLogin={onLogin || (() => {})}
        onRegister={onRegister || (() => {})}
      />
      </main>
    </>
  )
}

export default SevasPage
