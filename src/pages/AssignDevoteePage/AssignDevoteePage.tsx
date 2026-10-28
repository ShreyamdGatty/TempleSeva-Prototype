import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CartItem, Devotee, Temple, User, Order } from '../../types'
import { nakshatras, rashis, sevas } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'
import { readJson } from '../../utils/storage'
import { formatPrice } from '../../utils/helpers'

interface AssignDevoteePageProps {
  selectedTemple: Temple | null
  selectedDate: string
  cart: CartItem[]
  subtotal: number
  discount: number
  total: number
  devotees: Devotee[]
  onAddDevotee: (devotee: Omit<Devotee, 'id'>) => Devotee
  onCompleteOrder: (paymentMethod: string, addressOrAllocations?: Record<string, Devotee[]>) => Order | null
  user: User | null
  onLogin: () => void
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void
  onNavigateToMySevas?: () => void
  onBackToCart?: () => void
}

/* Helper to render a sacred decorative QR code */
const SacredQrCodeSvg = ({ code }: { code: string }) => {
  return (
    <div className="relative inline-block rounded-2xl border-2 border-[#ebd8c6] bg-white p-3.5 shadow-sm">
      <div className="grid grid-cols-7 gap-1 w-36 h-36 sm:w-44 sm:h-44 bg-white p-1">
        {Array.from({ length: 49 }).map((_, i) => {
          const isCorner =
            (i % 7 < 2 && Math.floor(i / 7) < 2) ||
            (i % 7 > 4 && Math.floor(i / 7) < 2) ||
            (i % 7 < 2 && Math.floor(i / 7) > 4)
          const isCenter = i === 24
          const isPattern = (i * 13 + 7) % 3 === 0 || isCorner || isCenter
          return (
            <div
              key={i}
              className={`rounded-xs transition ${
                isPattern ? (isCorner ? 'bg-[#c1440e]' : 'bg-[#34251e]') : 'bg-transparent'
              }`}
            />
          )
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#c1440e] shadow-xs border border-[#ebd8c6]">
          🕉️ PASS
        </span>
      </div>
      <p className="mt-1 font-mono text-[9px] text-[#8b7a6d] tracking-wider text-center">{code}</p>
    </div>
  )
}

export default function AssignDevoteePage({
  selectedTemple,
  selectedDate,
  cart,
  discount: _discount,
  total,
  devotees,
  onAddDevotee,
  onCompleteOrder,
  user,
  onLogin,
  showToast,
  onNavigateToMySevas,
  onBackToCart,
}: AssignDevoteePageProps) {
  const navigate = useNavigate()
  const { language, translateSeva, translateTemple } = useLanguage()

  // Ensure there are always default devotees displayed so Saved Family Members is never empty
  const defaultSampleDevotees: Devotee[] = useMemo(
    () => [
      {
        id: 'dev-sample-1',
        name: user?.name || 'Srinivasan Iyer',
        relationship: 'Self',
        nakshatra: 'Rohini',
        rashi: 'Vrishabha (Taurus)',
        gotram: 'Kashyapa',
      },
      {
        id: 'dev-sample-2',
        name: 'Ananya Sharma',
        relationship: 'Spouse',
        nakshatra: 'Ashwini',
        rashi: 'Mesha (Aries)',
        gotram: 'Bharadwaja',
      },
      {
        id: 'dev-sample-3',
        name: 'Aditya Iyer',
        relationship: 'Son',
        nakshatra: 'Magha',
        rashi: 'Simha (Leo)',
        gotram: 'Kashyapa',
      },
    ],
    [user?.name]
  )

  const activeDevotees = useMemo(() => {
    return devotees && devotees.length > 0 ? devotees : defaultSampleDevotees
  }, [devotees, defaultSampleDevotees])

  // Guaranteed cart items from props, localStorage, or sanctuary fallback
  const effectiveCart = useMemo(() => {
    if (cart && cart.length > 0) return cart
    const saved = readJson<CartItem[]>('temple-seva.cart', [])
    if (saved && saved.length > 0) return saved
    const fallbackTempleSevas = selectedTemple
      ? sevas.filter((s) => s.templeId === selectedTemple.id)
      : sevas
    const firstSeva = fallbackTempleSevas[0] || sevas[0]
    return [
      {
        id: `item-${firstSeva.id}`,
        seva: firstSeva,
        quantity: 1,
        date: selectedDate || '28 Oct',
        slot: '07:00 AM - Morning Pooja',
      },
    ]
  }, [cart, selectedDate, selectedTemple])

  const effectiveTotal = useMemo(() => {
    if (total > 0) return total
    return effectiveCart.reduce((sum, item) => sum + item.seva.price * item.quantity, 0)
  }, [total, effectiveCart])

  // Track devotee assigned to each ticket: { [itemId]: { [ticketIndex]: Devotee } }
  const [ticketAssignments, setTicketAssignments] = useState<Record<string, Record<number, Devotee | null>>>(() => {
    const initial: Record<string, Record<number, Devotee | null>> = {}
    effectiveCart.forEach((item) => {
      initial[item.id] = {}
      for (let i = 0; i < item.quantity; i++) {
        initial[item.id][i] = item.ticketDevotees?.[i] || item.devotee || (activeDevotees.length > 0 ? activeDevotees[0] : null)
      }
    })
    return initial
  })

  // Currently selected devotee for quick assignment
  const [selectedDevoteeId, setSelectedDevoteeId] = useState<string>(activeDevotees[0]?.id || '')

  // Prompt state when a devotee card is clicked: "Apply to all tickets?"
  const [applyPromptDevotee, setApplyPromptDevotee] = useState<Devotee | null>(null)

  // Add Family Member form state
  const [showAddDevoteeModal, setShowAddDevoteeModal] = useState(false)
  const [newDevoteeForm, setNewDevoteeForm] = useState<Omit<Devotee, 'id'>>({
    name: '',
    relationship: 'Family Member',
    nakshatra: nakshatras[0] || 'Rohini',
    rashi: rashis[0] || 'Mesha',
    gotram: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})

  // Target ticket if adding devotee specifically for one ticket
  const [targetTicketForNewDevotee, setTargetTicketForNewDevotee] = useState<{ itemId: string; ticketIdx: number } | null>(null)

  // Step state: 'assign' | 'payment' | 'qr-pass'
  const [pageStep, setPageStep] = useState<'assign' | 'payment' | 'qr-pass'>('assign')
  const [selectedPayment, setSelectedPayment] = useState<string>('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  // Keep ticket assignments in sync if cart changes
  useEffect(() => {
    setTicketAssignments((prev) => {
      const next = { ...prev }
      effectiveCart.forEach((item) => {
        next[item.id] = next[item.id] || {}
        for (let i = 0; i < item.quantity; i++) {
          if (!next[item.id][i]) {
            next[item.id][i] = item.ticketDevotees?.[i] || item.devotee || (activeDevotees.length > 0 ? activeDevotees[0] : null)
          }
        }
      })
      return next
    })
  }, [effectiveCart, activeDevotees])

  useEffect(() => {
    if (!selectedDevoteeId && activeDevotees.length > 0 && activeDevotees[0].id) {
      setSelectedDevoteeId(activeDevotees[0].id)
    }
  }, [activeDevotees, selectedDevoteeId])

  const localizedTemple = selectedTemple ? translateTemple(selectedTemple) : null

  // Assign a devotee to a specific ticket
  const handleAssignDevoteeToTicket = (itemId: string, ticketIdx: number, dev: Devotee | null) => {
    setTicketAssignments((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [ticketIdx]: dev,
      },
    }))
  }

  // Apply a devotee to all tickets
  const handleApplyDevoteeToAll = (dev: Devotee) => {
    setSelectedDevoteeId(dev.id || '')
    setTicketAssignments((prev) => {
      const updated = { ...prev }
      effectiveCart.forEach((item) => {
        updated[item.id] = {}
        for (let i = 0; i < item.quantity; i++) {
          updated[item.id][i] = dev
        }
      })
      return updated
    })
    setApplyPromptDevotee(null)
    showToast(
      language === 'KN'
        ? `${dev.name} ಅವರನ್ನು ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸಲಾಗಿದೆ`
        : `Applied ${dev.name} to all seva tickets`,
      'success'
    )
  }

  // Handle clicking a saved devotee card: ask "Apply to all tickets?"
  const handleDevoteeCardClick = (dev: Devotee) => {
    setSelectedDevoteeId(dev.id || '')
    setApplyPromptDevotee(dev)
  }

  // Save new family member from form
  const handleSaveNewDevotee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDevoteeForm.name.trim()) {
      setFormErrors({ name: true })
      return
    }

    const created = onAddDevotee(newDevoteeForm)
    showToast(
      language === 'KN' ? `${created.name} ಅವರನ್ನು ಕುಟುಂಬ ಸದಸ್ಯರಾಗಿ ಸೇರಿಸಲಾಗಿದೆ` : `${created.name} added to family members`,
      'success'
    )

    if (targetTicketForNewDevotee) {
      handleAssignDevoteeToTicket(targetTicketForNewDevotee.itemId, targetTicketForNewDevotee.ticketIdx, created)
      setTargetTicketForNewDevotee(null)
    }

    setSelectedDevoteeId(created.id || '')
    setShowAddDevoteeModal(false)
    setNewDevoteeForm({
      name: '',
      relationship: 'Family Member',
      nakshatra: nakshatras[0] || 'Rohini',
      rashi: rashis[0] || 'Mesha',
      gotram: '',
    })
    setFormErrors({})

    // Prompt if user wants to apply newly added devotee to all tickets
    setApplyPromptDevotee(created)
  }

  // Proceed to payment validation
  const handleProceedToPayment = () => {
    if (!user) {
      onLogin()
      return
    }

    for (const item of effectiveCart) {
      for (let idx = 0; idx < item.quantity; idx++) {
        const assigned = ticketAssignments[item.id]?.[idx]
        if (!assigned || !assigned.name) {
          showToast(
            language === 'KN'
              ? `ದಯವಿಟ್ಟು ${item.seva.name} ಟಿಕೆಟ್ #${idx + 1} ಗೆ ಭಕ್ತರನ್ನು ನಿಯೋಜಿಸಿ`
              : `Please assign a devotee to Ticket #${idx + 1} for ${item.seva.name}`,
            'warning'
          )
          return
        }
      }
    }

    setPageStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Execute Payment
  const handleExecutePayment = () => {
    setIsProcessing(true)

    setTimeout(() => {
      const finalAllocations: Record<string, Devotee[]> = {}
      effectiveCart.forEach((item) => {
        const devs: Devotee[] = []
        for (let i = 0; i < item.quantity; i++) {
          const dev = ticketAssignments[item.id]?.[i] || activeDevotees[0]
          if (dev) devs.push(dev)
        }
        finalAllocations[item.id] = devs
      })

      const newOrder = onCompleteOrder(selectedPayment, finalAllocations)
      setConfirmedOrder(newOrder)
      setIsProcessing(false)
      setPageStep('qr-pass')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      showToast(
        language === 'KN' ? 'ಸೇವಾ ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Offering booked successfully!',
        'success'
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#fffcf6] text-[#34251e] pb-16">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-30 bg-[#fffcf6]/95 backdrop-blur-md border-b border-[#eadfd1] shadow-2xs">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (onBackToCart) {
                  onBackToCart()
                } else {
                  navigate('/sevas', { state: { openCart: true } })
                }
              }}
              className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-[#eadfd1] bg-white text-xs font-bold text-[#674f40] hover:border-[#c1440e] hover:bg-[#fff9f3] transition cursor-pointer shadow-2xs shrink-0"
              title="Back to Cart"
            >
              ←
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg">🕉️</span>
                <h1 className="font-serif text-sm sm:text-xl font-bold text-[#34251e] leading-tight truncate">
                  {pageStep === 'assign'
                    ? language === 'KN'
                      ? 'ಸಂಕಲ್ಪ ಮತ್ತು ಭಕ್ತರ ನಿಯೋಜನೆ'
                      : 'Sankalpam & Assign Devotees'
                    : pageStep === 'payment'
                    ? language === 'KN'
                      ? 'ದೈವಿಕ ಪಾವತಿ'
                      : 'Devotional Payment'
                    : language === 'KN'
                    ? 'ಡಿಜಿಟಲ್ ಸೇವಾ ಪಾಸ್'
                    : 'Digital Seva Pass'}
                </h1>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8b7a6d] truncate">
                {localizedTemple?.name || 'Sanctuary'} · {selectedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-[#fdf2ea] border border-[#f5cfb5] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#c1440e]">
              {effectiveCart.reduce((s, i) => s + i.quantity, 0)} {language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        {/* ── STEP 1: ASSIGN DEVOTEES PAGE ── */}
        {pageStep === 'assign' && (
          <>
            {/* 1. SEVA CART SUMMARY */}
            <section className="rounded-2xl sm:rounded-3xl border border-[#eadfd1] bg-white p-4 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fdf2ea] text-sm text-[#c1440e]">
                    📋
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#34251e]">
                      {language === 'KN' ? 'ಸೇವಾ ಕಾರ್ಟ್ ಸಾರಾಂಶ' : 'Seva Cart Summary'}
                    </h2>
                    <p className="text-[11px] text-[#8b7a6d]">
                      {language === 'KN' ? 'ಆಯ್ಕೆಮಾಡಿದ ಸೇವೆಗಳು ಮತ್ತು ಶುಭ ದಿನಾಂಕ' : 'Review your chosen rituals and auspicious booking date'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faf5ef] border border-[#ebd8c6] px-3 py-1 text-xs font-bold text-[#674f40]">
                    <span>📅</span>
                    <span>{selectedDate}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {effectiveCart.map((item) => {
                  const locSeva = translateSeva(item.seva)
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-[#f3eae0] bg-[#fffdfa] p-2.5 sm:p-3 transition hover:border-[#c1440e]/40"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-sm sm:text-base font-bold text-[#34251e]">
                            {locSeva.name}
                          </h3>
                          <span className="rounded-full bg-[#fdf2ea] border border-[#fbd3b6] px-2 py-0.2 text-[9px] font-bold text-[#c1440e]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] text-[#75685d] flex-wrap pt-0.5">
                          <span>⏰ Slot: <strong className="text-[#34251e]">{item.slot || '07:00 AM - Morning Pooja'}</strong></span>
                          <span>·</span>
                          <span>📅 Date: <strong className="text-[#34251e]">{selectedDate || item.date}</strong></span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="font-serif text-sm sm:text-base font-bold text-[#c1440e]">
                          {formatPrice(item.seva.price * item.quantity)}
                        </span>
                        <p className="text-[9px] text-[#8b7a6d]">
                          {formatPrice(item.seva.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Total Row */}
              <div className="mt-4 pt-3.5 border-t border-[#f0e4d7] flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#75685d] font-semibold">
                  {language === 'KN' ? 'ಒಟ್ಟು ಪಾವತಿ ಮೊತ್ತ:' : 'Total Payable Amount:'}
                </span>
                <span className="font-serif text-lg font-bold text-[#c1440e]">
                  {formatPrice(effectiveTotal)}
                </span>
              </div>
            </section>

            {/* 2. SAVED FAMILY MEMBERS */}
            <section className="rounded-2xl sm:rounded-3xl border border-[#eadfd1] bg-white p-4 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0e4d7] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fdf2ea] text-sm text-[#c1440e]">
                    👨‍👩‍👧‍👦
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#34251e]">
                      {language === 'KN' ? 'ಉಳಿಸಲಾದ ಕುಟುಂಬ ಸದಸ್ಯರು' : 'Saved Family Members'}
                    </h2>
                    <p className="text-[11px] text-[#8b7a6d]">
                      {language === 'KN'
                        ? 'ಕ್ಲಿಕ್ ಮಾಡಿ ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸಿ ಅಥವಾ ಪ್ರತಿ ಟಿಕೆಟ್‌ಗೆ ನಿಯೋಜಿಸಿ'
                        : 'Click any family member card to apply across all tickets, or assign individually below'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#8b7a6d]">
                  {activeDevotees.length} {activeDevotees.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              {/* Devotees Grid including the "+ Add Family Member" card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Saved Family Member Cards */}
                {activeDevotees.map((dev) => {
                  const isSelected = selectedDevoteeId === dev.id
                  return (
                    <div
                      key={dev.id || dev.name}
                      onClick={() => handleDevoteeCardClick(dev)}
                      className={`relative flex flex-col justify-between rounded-2xl border p-4 text-xs transition cursor-pointer group ${
                        isSelected
                          ? 'border-[#c1440e] bg-[#fffaf5] shadow-xs ring-2 ring-[#c1440e]/20'
                          : 'border-[#eadfd1] bg-white hover:border-[#c1440e]/60 hover:bg-[#fffdfa]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-base font-bold text-[#34251e] group-hover:text-[#c1440e] transition">
                            {dev.name}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isSelected ? 'bg-[#c1440e] text-white' : 'bg-[#f5ede2] text-[#c1440e]'
                            }`}
                          >
                            {dev.relationship || 'Self'}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-[11px] text-[#75685d]">
                          <p className="flex items-center gap-1.5">
                            <span>⭐</span>
                            <span>Nakshatra: <strong>{dev.nakshatra}</strong></span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span>🌙</span>
                            <span>Rashi: <strong>{dev.rashi}</strong></span>
                          </p>
                          {dev.gotram && (
                            <p className="flex items-center gap-1.5">
                              <span>🕉️</span>
                              <span>Gotram: <strong>{dev.gotram}</strong></span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-[#f3eae0] flex items-center justify-between text-[11px]">
                        <span className="text-[#c1440e] font-bold flex items-center gap-1">
                          ⚡ Tap to Apply to All
                        </span>
                        <span className="text-[10px] font-semibold text-[#8b7a6d]">
                          {isSelected ? '✓ Selected' : 'Click to select'}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {/* "+ Add Family Member" Card */}
                <div
                  onClick={() => setShowAddDevoteeModal(true)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8c8b8] hover:border-[#c1440e] bg-[#faf6f0]/60 hover:bg-[#fff9f3] p-5 text-center transition cursor-pointer min-h-[160px] group"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white group-hover:bg-[#c1440e] text-[#c1440e] group-hover:text-white border border-[#ebd8c6] text-xl font-bold shadow-2xs transition">
                    +
                  </span>
                  <h3 className="mt-3 font-serif text-sm font-bold text-[#34251e] group-hover:text-[#c1440e] transition">
                    {language === 'KN' ? '+ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ' : '+ Add Family Member'}
                  </h3>
                  <p className="mt-1 text-[11px] text-[#8b7a6d]">
                    {language === 'KN' ? 'ಹೊಸ ಭಕ್ತರ ಹೆಸರು ಮತ್ತು ಗೋತ್ರ ಸೇರಿಸಿ' : 'Add new devotee for Vedic sankalpa'}
                  </p>
                </div>
              </div>
            </section>

            {/* 3. DEVOTEE DETAILS (WITH TICKET CARDS FOR EVERY BOOKED SEVA TICKET) */}
            <section className="rounded-2xl sm:rounded-3xl border border-[#eadfd1] bg-white p-4 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-[#f0e4d7] pb-3 mb-4">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fdf2ea] text-sm text-[#c1440e]">
                  🎟️
                </span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#34251e]">
                    {language === 'KN' ? 'ಟಿಕೆಟ್ ಕಾರ್ಡ್‌ಗಳು (ಭಕ್ತರ ವಿವರಗಳು)' : 'Ticket Cards (Devotee Details)'}
                  </h2>
                  <p className="text-[11px] text-[#8b7a6d]">
                    {language === 'KN'
                      ? 'ಪ್ರತಿ ಸೇವಾ ಟಿಕೆಟ್‌ಗೆ ನಿಯೋಜಿಸಲಾದ ಭಕ್ತರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ'
                      : 'Assigned family members for each booked seva ticket'}
                  </p>
                </div>
              </div>

              {/* Ticket Cards list for ALL items in cart */}
              <div className="space-y-4">
                {effectiveCart.map((item) => {
                  const locSeva = translateSeva(item.seva)

                  return (
                    <div key={item.id} className="space-y-3">
                      {Array.from({ length: item.quantity }).map((_, ticketIdx) => {
                        const assignedDev = ticketAssignments[item.id]?.[ticketIdx] || activeDevotees[0]

                        return (
                          <div
                            key={ticketIdx}
                            className="rounded-2xl border border-[#eadfd1] bg-[#fffdfa] p-4 sm:p-5 shadow-2xs transition hover:border-[#c1440e]/50"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* Left: Ticket Info with Seva Name, Date, Slot */}
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="rounded-full bg-[#f5ede2] px-2.5 py-0.5 text-[10px] font-bold text-[#c1440e]">
                                    Ticket #{ticketIdx + 1}
                                  </span>
                                  <h3 className="font-serif text-base font-bold text-[#34251e]">
                                    {locSeva.name}
                                  </h3>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-[#75685d] flex-wrap pt-0.5">
                                  <span className="inline-flex items-center gap-1 bg-white border border-[#ebd8c6] px-2.5 py-1 rounded-lg">
                                    <span>📅</span>
                                    <span className="font-semibold text-[#8b7a6d]">Date:</span>
                                    <strong className="text-[#34251e]">{selectedDate || item.date}</strong>
                                  </span>
                                  <span className="inline-flex items-center gap-1 bg-white border border-[#ebd8c6] px-2.5 py-1 rounded-lg">
                                    <span>⏰</span>
                                    <span className="font-semibold text-[#8b7a6d]">Slot:</span>
                                    <strong className="text-[#34251e]">{item.slot || '07:00 AM - Morning Pooja'}</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Right: Quick Devotee Selector */}
                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#674f40]">
                                    {language === 'KN' ? 'ಭಕ್ತರು:' : 'Devotee:'}
                                  </span>
                                  <select
                                    value={assignedDev?.id || ''}
                                    onChange={(e) => {
                                      const matched = activeDevotees.find((d) => d.id === e.target.value) || null
                                      handleAssignDevoteeToTicket(item.id, ticketIdx, matched)
                                    }}
                                    className="rounded-xl border border-[#d8c8b8] bg-white px-3 py-1.5 text-xs font-semibold text-[#34251e] hover:border-[#c1440e] transition"
                                  >
                                    {activeDevotees.map((d) => (
                                      <option key={d.id} value={d.id}>
                                        {d.name} ({d.relationship || 'Self'} - {d.nakshatra})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetTicketForNewDevotee({ itemId: item.id, ticketIdx })
                                    setShowAddDevoteeModal(true)
                                  }}
                                  className="rounded-xl border border-dashed border-[#c1440e] bg-[#fdfaf5] px-2.5 py-1.5 text-xs font-bold text-[#c1440e] hover:bg-[#faefe2] transition cursor-pointer"
                                  title="Add new devotee for this ticket"
                                >
                                  + Add New
                                </button>
                              </div>
                            </div>

                            {/* Devotee who was added preview card */}
                            {assignedDev ? (
                              <div className="mt-3.5 rounded-xl border border-[#e8dbc9] bg-white p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif font-bold text-[#34251e] text-sm">
                                      👤 {assignedDev.name}
                                    </span>
                                    <span className="rounded-full bg-[#fdf2ea] px-2 py-0.2 text-[10px] font-bold text-[#c1440e]">
                                      {assignedDev.relationship || 'Family'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#75685d]">
                                    ⭐ Nakshatra: <strong>{assignedDev.nakshatra}</strong> · 🌙 Rashi: <strong>{assignedDev.rashi}</strong> {assignedDev.gotram ? `· 🕉️ Gotram: ${assignedDev.gotram}` : ''}
                                  </p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-lg shrink-0">
                                  <span>✓</span>
                                  <span>Devotee Assigned</span>
                                </span>
                              </div>
                            ) : (
                              <div className="mt-3.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-3 text-xs text-amber-800 flex items-center justify-between">
                                <span>⚠️ No devotee assigned yet for this ticket.</span>
                                <span className="font-bold underline cursor-pointer" onClick={() => handleAssignDevoteeToTicket(item.id, ticketIdx, activeDevotees[0] || null)}>
                                  Assign Default
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-2 sm:bottom-4 z-20 rounded-2xl sm:rounded-3xl border border-[#eadfd1] bg-white/95 backdrop-blur-md p-3.5 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-xs text-[#8b7a6d] font-semibold">
                  {effectiveCart.reduce((s, i) => s + i.quantity, 0)} {language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'} · {selectedDate}
                </span>
                <p className="font-serif text-2xl font-bold text-[#c1440e]">
                  {formatPrice(effectiveTotal)}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (onBackToCart) {
                      onBackToCart()
                    } else {
                      navigate('/sevas', { state: { openCart: true } })
                    }
                  }}
                  className="flex-1 sm:flex-none rounded-2xl border border-[#d8c8b8] px-5 py-3 text-xs sm:text-sm font-bold text-[#674f40] hover:bg-[#f5ede2] transition cursor-pointer"
                >
                  ← {language === 'KN' ? 'ಕಾರ್ಟ್‌ಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Cart'}
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="btn-primary flex-1 sm:flex-none px-7 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{language === 'KN' ? 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Pay'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: PAYMENT SCREEN ── */}
        {pageStep === 'payment' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 border-b border-[#eadfd1] pb-4">
              <button
                type="button"
                onClick={() => setPageStep('assign')}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#eadfd1] bg-white text-xs font-bold text-[#674f40] hover:border-[#c1440e] cursor-pointer"
              >
                ←
              </button>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#34251e]">
                  💳 {language === 'KN' ? 'ಸುರಕ್ಷಿತ ದೈವಿಕ ಪಾವತಿ' : 'Secure Devotional Payment'}
                </h2>
                <p className="text-xs text-[#8b7a6d]">
                  {language === 'KN' ? 'ದೇವಸ್ಥಾನದ ಸೇವಾ ರಸೀದಿ ಮತ್ತು ಕ್ಯೂಆರ್ ಪಾಸ್ ತಕ್ಷಣವೇ ನೀಡಲಾಗುತ್ತದೆ' : 'Instant temple confirmation & digital scannable QR pass'}
                </p>
              </div>
            </div>

            {/* Total banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#34251e] to-[#453127] p-6 text-white flex items-center justify-between shadow-md">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#d4a64a]">Total Amount Payable</p>
                <p className="mt-1 font-serif text-3xl font-bold text-white">{formatPrice(effectiveTotal)}</p>
              </div>
              <div className="text-right text-xs text-[#ebdcc9]">
                <p>{effectiveCart.reduce((s, i) => s + i.quantity, 0)} Seva Tickets</p>
                <p>{selectedDate}</p>
              </div>
            </div>

            {/* Payment Modes */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#75685d]">
                Select Payment Mode:
              </p>

              {[
                { id: 'upi', title: 'UPI Instant (GPay / PhonePe / Paytm / BHIM)', icon: '📱', badge: 'Zero Convenience Fee' },
                { id: 'card', title: 'Credit / Debit Card (Visa, MasterCard, RuPay)', icon: '💳' },
                { id: 'netbanking', title: 'Net Banking (All Indian Major Banks)', icon: '🏛️' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    selectedPayment === m.id
                      ? 'border-[#c1440e] bg-[#fff9f3] shadow-xs'
                      : 'border-[#eadfd1] bg-white hover:border-[#c1440e]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={selectedPayment === m.id}
                      onChange={() => setSelectedPayment(m.id)}
                      className="accent-[#c1440e]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#34251e] flex items-center gap-1.5">
                        <span>{m.icon}</span>
                        <span>{m.title}</span>
                      </p>
                      {m.badge && <span className="text-[10px] text-[#28724d] font-semibold">{m.badge}</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Pay Button */}
            <div className="pt-4">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Confirming Seva with Temple Sanctum...</span>
                  </>
                ) : (
                  <>
                    <span>🔒 Pay {formatPrice(effectiveTotal)} & Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: QR PASS SCREEN ── */}
        {pageStep === 'qr-pass' && confirmedOrder && (
          <div className="max-w-lg mx-auto text-center py-4 space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f5ed]">
              <span className="text-3xl text-[#28724d]">✓</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#34251e]">
                🙏 {language === 'KN' ? 'ಸೇವಾ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!' : 'Seva Booking Confirmed!'}
              </h2>
              <p className="mt-1 text-xs text-[#8b7a6d]">
                {language === 'KN'
                  ? 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸೇವಾ ಕ್ಯೂಆರ್ ಪಾಸ್ ಸಿದ್ಧವಾಗಿದೆ. ದೇವಸ್ಥಾನದ ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿ ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ತೋರಿಸಿ.'
                  : 'Your sacred digital pass is ready. Show this QR code at temple entrance for sanctum entry and sankalpa.'}
              </p>
            </div>

            {/* QR Card */}
            <div className="rounded-3xl border-2 border-[#e6dacb] bg-white p-5 sm:p-6 text-left shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#f3eae0] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c1440e]">
                    Digital Seva Pass
                  </span>
                  <p className="font-mono text-base font-bold text-[#34251e]">
                    ID: {confirmedOrder.id}
                  </p>
                </div>
                <span className="rounded-full bg-[#e9f5ed] px-3 py-1 text-xs font-bold text-[#28724d]">
                  {confirmedOrder.status}
                </span>
              </div>

              <div className="py-2 flex flex-col items-center justify-center text-center">
                <SacredQrCodeSvg code={confirmedOrder.id} />
                <p className="mt-2 text-[11px] font-semibold text-[#8b7a6d]">
                  Scan for Temple Sanctum Entry & Priest Sankalpa
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf6f0] p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8b7a6d]">Temple:</span>
                  <span className="font-bold text-[#34251e]">{translateTemple(confirmedOrder.temple).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b7a6d]">Date:</span>
                  <span className="font-bold text-[#34251e]">{confirmedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b7a6d]">Rituals:</span>
                  <span className="font-bold text-[#c1440e]">
                    {confirmedOrder.items.map((it) => `${it.seva.name} × ${it.quantity}`).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#eedecb] pt-2">
                  <span className="text-[#8b7a6d]">Total Paid:</span>
                  <span className="font-serif font-bold text-sm text-[#c1440e]">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {onNavigateToMySevas && (
                <button
                  type="button"
                  onClick={onNavigateToMySevas}
                  className="flex-1 rounded-2xl bg-[#f5ede2] hover:bg-[#ebdcc9] py-3 text-xs sm:text-sm font-bold text-[#674f40] transition cursor-pointer"
                >
                  📱 View in My Sevas
                </button>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-2xl border border-[#d8c8b8] py-3 text-xs sm:text-sm font-bold text-[#34251e] hover:bg-white transition cursor-pointer"
              >
                🖨️ Download / Print Pass
              </button>
              <button
                type="button"
                onClick={() => navigate('/sevas')}
                className="btn-primary flex-1 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: "Apply to All Tickets?" Prompt ── */}
      {applyPromptDevotee && (
        <div className="modal-overlay" onClick={() => setApplyPromptDevotee(null)}>
          <div
            className="modal-container w-full max-w-md bg-[#fffdfa] p-6 shadow-2xl rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fdf2ea] text-[#c1440e] text-2xl mx-auto">
                ⚡
              </span>

              <h3 className="font-serif text-xl font-bold text-[#34251e]">
                {language === 'KN'
                  ? `${applyPromptDevotee.name} ಅವರನ್ನು ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸುವುದೇ?`
                  : `Apply ${applyPromptDevotee.name} to all tickets?`}
              </h3>

              <p className="text-xs text-[#75685d] leading-relaxed">
                {language === 'KN'
                  ? `ನೀವು "${applyPromptDevotee.name}" (${applyPromptDevotee.relationship || 'Self'} - ${applyPromptDevotee.nakshatra}) ಅವರನ್ನು ನಿಮ್ಮ ಕಾರ್ಟ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ಸೇವಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಏಕಕಾಲದಲ್ಲಿ ಅನ್ವಯಿಸಲು ಬಯಸುವಿರಾ?`
                  : `Would you like to assign "${applyPromptDevotee.name}" (${applyPromptDevotee.relationship || 'Self'} - ${applyPromptDevotee.nakshatra}) across all booked seva tickets in your cart?`}
              </p>

              <div className="rounded-2xl bg-[#faf6f0] p-3 text-xs text-left text-[#5c4d41] space-y-1">
                <p>⭐ Nakshatra: <strong>{applyPromptDevotee.nakshatra}</strong></p>
                <p>🌙 Rashi: <strong>{applyPromptDevotee.rashi}</strong></p>
                {applyPromptDevotee.gotram && <p>🕉️ Gotram: <strong>{applyPromptDevotee.gotram}</strong></p>}
              </div>

              <div className="mt-5 flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyPromptDevotee(null)}
                  className="flex-1 rounded-xl border border-[#d8c8b8] py-2.5 text-xs font-bold text-[#674f40] hover:bg-[#f5ede2] transition cursor-pointer"
                >
                  {language === 'KN' ? 'ಬೇಡ (ರದ್ದು)' : 'No, Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyDevoteeToAll(applyPromptDevotee)}
                  className="btn-primary flex-1 py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'KN' ? 'ಹೌದು, ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸಿ' : 'Yes, Apply to All Tickets'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: "+ Add Family Member" Form Modal ── */}
      {showAddDevoteeModal && (
        <div className="modal-overlay" onClick={() => setShowAddDevoteeModal(false)}>
          <div
            className="modal-container w-full max-w-lg bg-[#fffdfa] p-6 shadow-2xl rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-serif text-lg font-bold text-[#34251e]">
                  {language === 'KN' ? 'ಹೊಸ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ' : 'Add Family Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDevoteeModal(false)}
                className="modal-close cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveNewDevotee} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newDevoteeForm.name}
                  onChange={(e) => {
                    setNewDevoteeForm({ ...newDevoteeForm, name: e.target.value })
                    if (formErrors.name) setFormErrors({ ...formErrors, name: false })
                  }}
                  placeholder="e.g. Ananya Sharma"
                  className={`w-full rounded-xl border p-2.5 text-xs ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-[#d8c8b8] bg-white'
                  }`}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                    Relationship
                  </label>
                  <select
                    value={newDevoteeForm.relationship || 'Self'}
                    onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, relationship: e.target.value })}
                    className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2.5 text-xs"
                  >
                    {['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Family Member'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                    Gotram (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDevoteeForm.gotram || ''}
                    onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, gotram: e.target.value })}
                    placeholder="e.g. Kashyapa"
                    className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                    Nakshatra (Birth Star)
                  </label>
                  <select
                    value={newDevoteeForm.nakshatra}
                    onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, nakshatra: e.target.value })}
                    className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2.5 text-xs"
                  >
                    {nakshatras.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                    Rashi (Moon Sign)
                  </label>
                  <select
                    value={newDevoteeForm.rashi}
                    onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, rashi: e.target.value })}
                    className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2.5 text-xs"
                  >
                    {rashis.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#f0e4d7]">
                <button
                  type="button"
                  onClick={() => setShowAddDevoteeModal(false)}
                  className="rounded-xl border border-[#d8c8b8] px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary rounded-xl px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Family Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
