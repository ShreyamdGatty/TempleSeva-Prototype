import { useMemo, useState, useEffect } from 'react'
import type { Temple, Seva, CartItem, User, Coupon } from '../../types'
import { sevas, categories } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import CalendarModal, { isBeforeToday, isSameDay } from '../../components/CalendarModal/CalendarModal'
import SideMenuDrawer from '../../components/SideMenuDrawer/SideMenuDrawer'

interface SevasPageProps {
  selectedTemple: Temple | null
  pickerOpen: boolean
  switchTemple: () => void
  onSelectTemple: (temple: Temple) => void
  dates: string[]
  selectedDate: string
  setSelectedDate: (value: string) => void
  addSeva: (seva: Seva, selectedDate: string, onNotice: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void) => void
  cart: CartItem[]
  subtotal: number
  discount: number
  total: number
  appliedCoupon: Coupon | null
  changeQty: (id: string, amount: number) => void
  removeItem: (id: string) => void
  onPay: () => void
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
}

const StarDisplay = ({ rating }: { rating: number }) => (
  <span className="flex items-center text-xs text-[#d4a64a]">
    {'★'.repeat(Math.round(rating))}
    <span className="opacity-30">{'★'.repeat(5 - Math.round(rating))}</span>
  </span>
)

interface DateCardItem {
  id: string
  label: string
  dateObj: Date
  isPast: boolean
  isToday: boolean
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
  appliedCoupon,
  changeQty,
  removeItem,
  onPay,
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
}: SevasPageProps) => {
  const { language, t, translateTemple, translateSeva, translateCategory, formatDateLocalized } = useLanguage()

  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const [cartExpanded, setCartExpanded] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [customDates, setCustomDates] = useState<Date[]>([])

  // Generate dynamic date options starting from today (first 7 days)
  const dynamicDateCards: DateCardItem[] = useMemo(() => {
    const list: DateCardItem[] = []
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      const label = formatDateLocalized(d)
      list.push({
        id: `d-${i}`,
        label,
        dateObj: d,
        isPast: isBeforeToday(d),
        isToday: isSameDay(d, now),
      })
    }
    return list
  }, [formatDateLocalized])

  // Combine dynamic date cards with any custom calendar-picked dates positioned on the right
  const allDateCards: DateCardItem[] = useMemo(() => {
    const list: DateCardItem[] = [...dynamicDateCards]
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    customDates.forEach((d) => {
      // Check if already in dynamicDateCards
      const existsInDynamic = dynamicDateCards.some((card) => isSameDay(card.dateObj, d))
      if (!existsInDynamic) {
        list.push({
          id: `custom-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
          label: formatDateLocalized(d),
          dateObj: d,
          isPast: isBeforeToday(d),
          isToday: isSameDay(d, now),
        })
      }
    })
    return list
  }, [dynamicDateCards, customDates, formatDateLocalized])

  // Automatically select today's date if no date is set yet
  useEffect(() => {
    if (!selectedDate && dynamicDateCards.length > 0) {
      setSelectedDate(dynamicDateCards[0].label)
    }
  }, [selectedDate, dynamicDateCards, setSelectedDate])

  const localizedTemple = selectedTemple ? translateTemple(selectedTemple) : null

  const filteredAndSortedSevas = useMemo(() => {
    return sevas
      .map(translateSeva)
      .filter((seva) => {
        const matchesSearch =
          seva.name.toLowerCase().includes(search.toLowerCase()) ||
          seva.description.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || seva.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
      })
  }, [search, selectedCategory, sortBy, translateSeva])

  const handleAddSeva = (e: React.MouseEvent, seva: Seva) => {
    e.stopPropagation()
    addSeva(seva, selectedDate, showToast)
  }

  const handleHeartClick = (e: React.MouseEvent, sevaId: string) => {
    e.stopPropagation()
    onToggleWish(sevaId)
    showToast(isWished(sevaId) ? (language === 'KN' ? 'ಮೆಚ್ಚಿನ ಪಟ್ಟಿಯಿಂದ ತೆಗೆಯಲಾಗಿದೆ' : 'Removed from wishlist') : (language === 'KN' ? 'ಮೆಚ್ಚಿನ ಪಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ' : 'Added to wishlist'), 'info')
  }

  return (
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
            onClick={switchTemple}
            className="rounded-full border border-[#d8c8b8] bg-white px-4 py-2 text-sm font-bold transition hover:border-[#c1440e] cursor-pointer"
          >
            {t('switchTemple')}
          </button>
          <button
            onClick={onWishlist}
            className="relative flex items-center gap-1.5 rounded-full border border-[#d8c8b8] bg-[#fffdfa] px-4 py-2 text-sm font-bold text-[#34251e] shadow-xs transition hover:border-[#c1440e] hover:bg-[#fdf7f2] cursor-pointer"
            title={t('navFavorites')}
          >
            <span className="text-base text-[#c1440e]">🤍</span>
            <span>{t('navFavorites')}</span>
            {wishlistCount > 0 && (
              <span className="ml-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-[#c1440e] px-1.5 text-xs font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>
          {user ? (
            <>
              <button
                onClick={onOrders}
                className="rounded-full bg-[#f5ede2] px-4 py-2 text-sm font-bold transition hover:bg-[#ebdcc9] cursor-pointer"
              >
                {t('navMySevas')}
              </button>
              <button
                onClick={onProfile}
                className="rounded-full bg-[#f5ede2] px-4 py-2 text-sm font-bold transition hover:bg-[#ebdcc9] cursor-pointer"
              >
                {t('navProfile')}
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-[#d8c8b8] px-4 py-2 text-sm font-bold hover:bg-[#fde8e8] hover:text-[#d94444] cursor-pointer"
              >
                {t('navLogout')}
              </button>

              {/* Menu Trigger: Profile Icon in Desktop View, Hamburger in Mobile View */}
              <button
                type="button"
                onClick={() => setSideMenuOpen(true)}
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
                    onClick={() => setSelectedDate(card.label)}
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
                        className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm ${
                          isSelected ? 'bg-[#d4a64a] text-[#34251e]' : 'bg-[#d4a64a] text-white'
                        }`}
                      >
                        {t('todayBadge')}
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

                          <div className="mt-1.5 flex items-center gap-1.5">
                            <StarDisplay rating={seva.rating} />
                            <span className="text-xs font-bold text-[#34251e]">{seva.rating}</span>
                            <span className="text-[11px] text-[#8b7a6d]">
                              ({seva.reviewCount})
                            </span>
                          </div>

                          <p className="mt-2 text-xs leading-5 text-[#75685d] line-clamp-2">
                            {seva.description}
                          </p>
                        </div>

                        {/* Footer / Price & Quick Add */}
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
                            <button
                              onClick={(e) => handleAddSeva(e, seva)}
                              className="rounded-xl bg-[#c1440e] px-3.5 py-1.5 text-xs font-bold text-white shadow transition hover:bg-[#a5370a] cursor-pointer"
                            >
                              {t('addBtn')}
                            </button>
                          </div>
                          {seva.requiresDevotee && (
                            <p className="mt-2 text-[10px] text-[#b0782a]">
                              ℹ {t('devoteeRequired')}
                            </p>
                          )}
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

      {/* ── Floating Modern E-Commerce Cart Drawer Bar ── */}
      {cart.length > 0 && (
        <aside className="fixed bottom-5 left-5 right-5 z-40 mx-auto max-w-2xl rounded-2xl bg-[#2e1d15] p-4 text-white shadow-2xl transition-all">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setCartExpanded(!cartExpanded)}
              className="flex cursor-pointer items-center gap-3"
            >
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#c1440e] text-lg font-bold">
                🛒
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f2c778] text-[10px] font-bold text-[#34251e]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">
                  {cart.length} {t('cartTitle')}
                </p>
                <p className="text-xs text-[#eadfd1]">
                  {selectedDate} · {localizedTemple?.name}{' '}
                  {cartExpanded ? t('hideItems') : t('viewItems')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-serif text-2xl font-bold text-[#f2c778]">
                  {formatPrice(cartTotal)}
                </p>
                {discount > 0 && (
                  <p className="text-[10px] text-[#5cb85c]">
                    {t('savedPromo')} {formatPrice(discount)}
                  </p>
                )}
              </div>
              <button
                onClick={onPay}
                className="rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 cursor-pointer"
              >
                {t('checkoutBtn')}
              </button>
            </div>
          </div>

          {/* Collapsible item list */}
          {cartExpanded && (
            <div className="mt-4 max-h-56 space-y-2.5 overflow-y-auto border-t border-white/15 pt-3">
              {cart.map((item) => {
                const localizedItemSeva = translateSeva(item.seva)
                return (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold">{localizedItemSeva.name}</p>
                      {item.devotee && (
                        <p className="text-xs text-[#e0cfbe]">
                          {t('forDevotee')}: {item.devotee.name} ({item.devotee.nakshatra})
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">
                        {formatPrice(item.seva.price * item.quantity)}
                      </span>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 p-1">
                        <button
                          onClick={() => changeQty(item.id, -1)}
                          className="grid h-5 w-5 place-items-center rounded bg-white/20 text-xs font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-1 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => changeQty(item.id, 1)}
                          className="grid h-5 w-5 place-items-center rounded bg-white/20 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
              {appliedCoupon && (
                <p className="text-xs text-[#5cb85c]">
                  {t('promoApplied')}: {appliedCoupon.code}
                </p>
              )}
            </div>
          )}
        </aside>
      )}

      {/* ── Calendar Modal ── */}
      {calendarOpen && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={(newDate, dateObj) => {
            // Check if the selected date already exists in the initial 7 date cards
            const existsInCards = dynamicDateCards.some((card) => isSameDay(card.dateObj, dateObj))
            if (!existsInCards) {
              setCustomDates((prev) => {
                const alreadyInCustom = prev.some((d) => isSameDay(d, dateObj))
                if (!alreadyInCustom) {
                  return [...prev, dateObj]
                }
                return prev
              })
            }
            setSelectedDate(newDate)
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
        onLogin={onLogin || (() => {})}
        onRegister={onRegister || (() => {})}
      />
    </main>
  )
}

export default SevasPage
