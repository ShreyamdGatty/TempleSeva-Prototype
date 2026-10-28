import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Order, User, Devotee, Temple } from '../../types'
import { temples } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../../components/IonIcon'

interface MySevasPageProps {
  user: User | null
  orders: Order[]
  selectedTemple?: Temple | null
  switchTemple?: () => void
  devotees?: Devotee[]
  onAddDevotee?: (devotee: Omit<Devotee, 'id'>) => void
  onUpdateDevotee?: (id: string, updated: Partial<Devotee>) => void
  onRemoveDevotee?: (id: string) => void
  onCancelOrder: (orderId: string) => void
  onReorder: (order: Order) => void
  onOpenQrPass?: () => void
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
  selectedTemple,
  onCancelOrder,
  onReorder,
  onWishlist,
  wishlistCount = 0,
}: MySevasPageProps) => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t, translateTemple, translateSeva } = useLanguage()

  const activeTemple = selectedTemple || temples[0]
  const localizedActiveTemple = translateTemple(activeTemple)

  // Strictly filter orders for the currently selected/switched temple only
  const templeOrders = useMemo(() => {
    return orders.filter((o) => o.temple.id === activeTemple.id)
  }, [orders, activeTemple.id])

  // Filter by status within this selected temple
  const [orderFilter, setOrderFilter] = useState<'all' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'>('all')

  // Expanded tracking timeline IDs
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({})

  const toggleTimeline = (orderId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const filteredOrders = useMemo(() => {
    return templeOrders.filter((o) => orderFilter === 'all' || o.status === orderFilter)
  }, [templeOrders, orderFilter])

  return (
    <div className="min-h-screen bg-[#fffcf6] text-[#34251e]">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-2xs">
        <div className="flex h-[74px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4">
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
            >
              <span>{t('navHome')}</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Wishlist quick link */}
            {onWishlist && (
              <button
                type="button"
                onClick={onWishlist}
                className="relative flex items-center justify-center rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] p-2 text-xs font-semibold text-[#5c4d41] hover:text-[#c1440e] shadow-2xs transition cursor-pointer"
                title={language === 'KN' ? 'ಮೆಚ್ಚಿನವುಗಳು' : 'Wishlist'}
              >
                <IonIcon name="heart-outline" className="text-base text-[#c1440e]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#c1440e] px-1 text-[10px] font-bold text-white shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Statistics Summary Cards (For Selected Temple Only) ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase text-[#8b7a6d]">Total Sevas</p>
            <p className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#c1440e]">
              {templeOrders.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase text-[#8b7a6d]">Confirmed</p>
            <p className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#2b5a9e]">
              {templeOrders.filter((o) => o.status === 'Confirmed').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase text-[#8b7a6d]">In Progress</p>
            <p className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#9a6700]">
              {templeOrders.filter((o) => o.status === 'In Progress').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase text-[#8b7a6d]">Cancelled</p>
            <p className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#d94444]">
              {templeOrders.filter((o) => o.status === 'Cancelled').length}
            </p>
          </div>
          <div className="rounded-2xl border border-[#eadfd1] bg-white p-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase text-[#8b7a6d]">Completed</p>
            <p className="mt-0.5 font-serif text-2xl sm:text-3xl font-bold text-[#28724d]">
              {templeOrders.filter((o) => o.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* ── Status Filter Buttons ── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setOrderFilter(filterKey)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  orderFilter === filterKey
                    ? 'bg-[#34251e] text-white shadow-xs'
                    : 'bg-white border border-[#eadfd1] text-[#674f40] hover:bg-[#f5ede2]'
                }`}
              >
                {filterKey === 'all'
                  ? t('filterAll')
                  : filterKey === 'Confirmed'
                  ? t('filterConfirmed')
                  : filterKey === 'In Progress'
                  ? (t('filterInProgress') || 'In Progress')
                  : filterKey === 'Completed'
                  ? t('filterCompleted')
                  : t('filterCancelled')}
                {filterKey !== 'all' && (
                  <span className="ml-1 opacity-75 font-mono text-[10px]">
                    ({templeOrders.filter((o) => o.status === filterKey).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-[#8b7a6d]">
            {filteredOrders.length} {t('itemsLabel').toLowerCase()}
          </p>
        </div>

        {/* ── Empty State ── */}
        {filteredOrders.length === 0 ? (
          <div className="mt-10 rounded-3xl border-2 border-dashed border-[#eadfd1] bg-white p-10 text-center">
            <span className="text-5xl">🪔</span>
            <h3 className="mt-3 font-serif text-xl font-bold text-[#34251e]">
              {t('noOrdersTitle')}
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-[#8b7a6d]">
              {language === 'KN'
                ? `${localizedActiveTemple.name} ಕ್ಷೇತ್ರಕ್ಕೆ ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಪೂಜಾ ಸೇವೆಗಳನ್ನು ಕಾಯ್ದಿರಿಸಿಲ್ಲ. ಸೇವೆಗಳನ್ನು ಈಗಲೇ ಅನ್ವೇಷಿಸಿ.`
                : `You have not booked any seva receipts for ${localizedActiveTemple.name} yet. Explore sacred offerings to receive divine blessings.`}
            </p>
            <button
              type="button"
              onClick={() => navigate('/sevas')}
              className="btn-primary mt-5 px-5 py-2.5 text-xs font-bold cursor-pointer"
            >
              <span className="mr-1.5">🪔</span>
              <span>{t('backToSevas')}</span>
            </button>
          </div>
        ) : (
          /* ── Creative Small Tearing Receipt Cards Grid ── */
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const localizedTemple = translateTemple(order.temple)
              const isTimelineOpen = !!expandedTimelines[order.id]
              const devoteeItems = order.items.filter((item) => item.seva.requiresDevotee || item.devotee)
              const hasDevoteeRequiredSeva = devoteeItems.length > 0

              return (
                <article
                  key={order.id}
                  className="tearing-receipt rounded-2xl p-5 border border-[#e3d5c4] bg-[#fffdfa] text-[#34251e] shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between max-w-md w-full mx-auto"
                >
                  {/* Authentic Red/Gold Consecration Watermark Stamp */}
                  <div className="absolute top-4 right-4 pointer-events-none select-none z-10">
                    {order.status === 'Cancelled' ? (
                      <span className="receipt-stamp border-[#d94444] text-[#d94444] bg-[#fff5f5]/80">
                        ⚠️ CANCELLED
                      </span>
                    ) : order.status === 'In Progress' ? (
                      <span className="receipt-stamp border-[#9a6700] text-[#9a6700] bg-[#fffaf0]/80">
                        ⏳ IN SANCTUM
                      </span>
                    ) : order.status === 'Completed' ? (
                      <span className="receipt-stamp border-[#28724d] text-[#28724d] bg-[#f0fdf4]/80">
                        ✓ BLESSED
                      </span>
                    ) : (
                      <span className="receipt-stamp border-[#c1440e] text-[#c1440e] bg-[#fff8f2]/80">
                        ✓ CONSECRATED
                      </span>
                    )}
                  </div>

                  {/* ── TOP SECTION: TEMPLE & SANCTUM RECEIPT HEADER ── */}
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center gap-2 border-b border-[#f0e4d7] pb-2 text-[10px] uppercase tracking-widest font-bold text-[#8b7a6d]">
                      <span>ॐ</span>
                      <span>Temple Seva Receipt · ಸೇವಾ ರಶೀದಿ</span>
                    </div>

                    {/* Temple Identity */}
                    <div className="mt-3 flex items-start gap-3">
                      <img
                        src={localizedTemple.image}
                        alt={localizedTemple.name}
                        className="h-11 w-11 rounded-xl object-cover border border-[#eadfd1] shadow-2xs shrink-0"
                      />
                      <div className="pr-16">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c1440e]">
                          📍 {localizedTemple.location}
                        </span>
                        <h2 className="font-serif text-base font-bold text-[#34251e] leading-snug">
                          {localizedTemple.name}
                        </h2>
                      </div>
                    </div>

                    {/* Receipt Token ID & Date in Crisp Vintage Style */}
                    <div className="mt-2.5 flex items-center justify-between rounded-lg bg-[#faf5ee] border border-[#eee2d3] px-3 py-1.5 text-[11px]">
                      <div>
                        <span className="text-[#8b7a6d]">Token: </span>
                        <span className="font-mono font-bold text-[#34251e]">{order.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#8b7a6d]">Date: </span>
                        <span className="font-bold text-[#34251e]">{order.date}</span>
                      </div>
                    </div>

                    {/* Itemized Offerings List */}
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                        Consecrated Offerings:
                      </p>
                      <div className="divide-y divide-[#f2e7db] rounded-xl border border-[#eee2d3] bg-white text-xs">
                        {order.items.map((item) => {
                          const localizedSeva = translateSeva(item.seva)
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 hover:bg-[#fffdfa] transition-colors"
                            >
                              <div className="pr-2">
                                <p className="font-bold text-[#34251e]">
                                  {localizedSeva.name} <span className="text-[#c1440e]">× {item.quantity}</span>
                                </p>
                                <p className="text-[10px] text-[#8b7a6d]">
                                  {localizedSeva.category.toUpperCase()} · {localizedSeva.duration}
                                </p>
                              </div>
                              <span className="font-serif font-bold text-[#c1440e] shrink-0 text-xs">
                                {formatPrice(item.seva.price * item.quantity)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Devotee Sankalpa Details (Compact Box) */}
                    {hasDevoteeRequiredSeva && (
                      <div className="mt-2.5 rounded-xl border border-[#eedecb] bg-[#fbf7f0] p-2.5 text-[11px]">
                        <p className="font-bold text-[#8a6842] flex items-center gap-1 text-[10px] uppercase tracking-wide">
                          <span>🕉️</span>
                          <span>Sankalpa Devotee Details</span>
                        </p>
                        <div className="mt-1 space-y-1 text-[#5e4b3c]">
                          {devoteeItems.map((item, idx) => {
                            const dev = item.devotee || (user ? { name: user.name, nakshatra: '', rashi: '', gotram: '' } : null)
                            return (
                              <div key={idx} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
                                <span className="font-bold text-[#34251e]">
                                  {dev ? dev.name : 'Recorded at Sanctum'}
                                </span>
                                {dev?.gotram && <span className="text-[10px] text-[#8b7a6d]">Gotra: {dev.gotram}</span>}
                                {dev?.nakshatra && <span className="text-[10px] text-[#8b7a6d]">Nakshatra: {dev.nakshatra}</span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── THE TEARING PERFORATION SEPARATOR (TEAR HERE) ── */}
                  <div className="relative my-4 flex items-center justify-center">
                    {/* Left circular cutout notch */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#fffcf6] border border-[#e3d5c4] shadow-inner" />
                    
                    {/* Perforated dashed tear line with Scissors */}
                    <div className="w-full border-t-2 border-dashed border-[#d8c8b8] flex items-center justify-between px-2 text-[10px] text-[#a3907e] font-mono select-none">
                      <span className="tracking-tighter">✂ TEAR HERE</span>
                      <span className="text-[9px] uppercase tracking-widest font-semibold text-[#8b7a6d]">
                        Temple Counterfoil
                      </span>
                      <span className="tracking-tighter">✂</span>
                    </div>

                    {/* Right circular cutout notch */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#fffcf6] border border-[#e3d5c4] shadow-inner" />
                  </div>

                  {/* ── BOTTOM SECTION: DEVOTEE COUNTERFOIL STUB ── */}
                  <div>
                    {/* Total & Status Row */}
                    <div className="flex items-center justify-between bg-[#faf6f0] rounded-xl p-2.5 border border-[#eee2d3]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#8b7a6d]">Amount Paid:</span>
                        <p className="font-serif text-lg font-bold text-[#c1440e] leading-none mt-0.5">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            statusColor[order.status] ?? 'bg-gray-100'
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="text-[9px] font-mono text-[#8b7a6d] mt-0.5 capitalize">
                          Via {order.paymentMethod || 'Online'}
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Timeline */}
                    {isTimelineOpen && (
                      <div className="mt-3 rounded-xl border border-[#e8ded3] bg-white p-3 text-xs animate-fade-in">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#c1440e] mb-2.5">
                          Ritual Progress:
                        </p>
                        <div className="space-y-2">
                          {order.timeline.map((event, i) => (
                            <div key={event.label} className="flex items-start gap-2 text-[11px]">
                              <div
                                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
                                  event.completed
                                    ? 'bg-[#28724d] text-white'
                                    : 'border border-[#d8c8b8] text-[#d8c8b8]'
                                }`}
                              >
                                {event.completed ? '✓' : i + 1}
                              </div>
                              <div>
                                <p className={`font-bold ${event.completed ? 'text-[#34251e]' : 'text-[#a39384]'}`}>
                                  {event.label}
                                </p>
                                <p className="text-[10px] text-[#8b7a6d]">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons (Clean & Compact) */}
                    <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#f2e7db]">
                      <button
                        type="button"
                        onClick={() => toggleTimeline(order.id)}
                        className="rounded-lg border border-[#d8c8b8] bg-white hover:bg-[#f5ede2] px-2.5 py-1 text-[11px] font-semibold text-[#674f40] transition cursor-pointer"
                      >
                        {isTimelineOpen ? 'Hide Steps' : 'Tracking'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        {order.status === 'Cancelled' ? (
                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:brightness-110 cursor-pointer"
                          >
                            <span>🔄</span>
                            <span>{t('retryBtn') || 'Retry'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="rounded-lg bg-[#c1440e] hover:bg-[#a5370a] px-3 py-1 text-[11px] font-bold text-white shadow-2xs cursor-pointer"
                          >
                            {t('reorderBtn')}
                          </button>
                        )}

                        {order.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => onCancelOrder(order.id)}
                            className="rounded-lg border border-[#d94444] hover:bg-[#fde8e8] px-2 py-1 text-[11px] font-bold text-[#d94444] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Counterfoil Notice */}
                    <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-wider text-[#a3907e] select-none">
                      ★ OFFICIAL TEMPLE COUNTERFOIL · VALID FOR PRASADAM ★
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default MySevasPage
