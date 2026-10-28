import { useState, useEffect } from 'react'
import type { CartItem, Temple, Devotee, Order, User } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { nakshatras, rashis } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'
import { SacredQrCodeSvg } from '../PaymentQrModal/PaymentQrModal'
import { IonIcon } from '../IonIcon'

interface SankalpamModalProps {
  isOpen: boolean
  initialStep?: 'cart' | 'sankalpam'
  onClose: () => void
  cart: CartItem[]
  selectedTemple: Temple | null
  selectedDate: string
  subtotal: number
  discount: number
  total: number
  changeQty: (id: string, amount: number, onNotice?: any) => void
  removeItem: (id: string) => void
  devotees: Devotee[]
  onAddDevotee: (devotee: Omit<Devotee, 'id'>) => Devotee
  onCompleteOrder: (paymentMethod: string, ticketAllocations: Record<string, Devotee[]>) => Order | null
  user: User | null
  onLogin: () => void
  showToast: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
  onNavigateToMySevas?: () => void
  onNavigateToAssignDevotee?: () => void
}

type ModalStep = 'cart' | 'sankalpam' | 'payment' | 'qr-pass'

const SankalpamModal = ({
  isOpen,
  initialStep = 'cart',
  onClose,
  cart,
  selectedTemple,
  selectedDate,
  subtotal,
  discount,
  total,
  changeQty,
  removeItem,
  devotees,
  onAddDevotee,
  onCompleteOrder,
  user,
  onLogin,
  showToast,
  onNavigateToMySevas,
  onNavigateToAssignDevotee,
}: SankalpamModalProps) => {
  const { language, t, translateSeva, translateTemple } = useLanguage()
  const [step, setStep] = useState<ModalStep>(initialStep)
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  // Devotee ticket assignments map: itemId -> array of Devotee for each quantity index
  const [ticketAssignments, setTicketAssignments] = useState<Record<string, Record<number, Devotee | null>>>(() => {
    const initial: Record<string, Record<number, Devotee | null>> = {}
    cart.forEach((item) => {
      initial[item.id] = {}
      for (let i = 0; i < item.quantity; i++) {
        initial[item.id][i] = item.ticketDevotees?.[i] || item.devotee || (devotees.length > 0 ? devotees[0] : null)
      }
    })
    return initial
  })

  // Selected devotee for "Apply to All"
  const [applyAllDevoteeId, setApplyAllDevoteeId] = useState<string>(devotees[0]?.id || '')

  // Keep ticketAssignments and default devotee in sync whenever cart items or devotees change
  useEffect(() => {
    setTicketAssignments((prev) => {
      const next = { ...prev }
      cart.forEach((item) => {
        next[item.id] = next[item.id] || {}
        for (let i = 0; i < item.quantity; i++) {
          if (!next[item.id][i]) {
            next[item.id][i] = item.ticketDevotees?.[i] || item.devotee || (devotees.length > 0 ? devotees[0] : null)
          }
        }
      })
      return next
    })
  }, [cart, devotees])

  useEffect(() => {
    if (!applyAllDevoteeId && devotees.length > 0 && devotees[0].id) {
      setApplyAllDevoteeId(devotees[0].id)
    }
  }, [devotees, applyAllDevoteeId])

  // Inline Add Devotee form state
  const [showAddDevoteeForm, setShowAddDevoteeForm] = useState(false)
  const [targetTicketForNewDevotee, setTargetTicketForNewDevotee] = useState<{ itemId: string; ticketIdx: number } | null>(null)
  const [newDevoteeForm, setNewDevoteeForm] = useState<Omit<Devotee, 'id'>>({
    name: '',
    relationship: 'Self',
    nakshatra: nakshatras[0] || 'Rohini',
    rashi: rashis[0] || 'Mesha',
    gotram: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})

  if (!isOpen) return null

  const localizedTemple = selectedTemple ? translateTemple(selectedTemple) : null
  const itemsRequiringDevotee = cart.filter((i) => i.seva.requiresDevotee)
  const hasDevoteeSeva = itemsRequiringDevotee.length > 0

  // Handle single ticket devotee assignment
  const handleAssignDevoteeToTicket = (itemId: string, ticketIdx: number, devotee: Devotee | null) => {
    setTicketAssignments((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [ticketIdx]: devotee,
      },
    }))
  }

  // Handle Apply specific devotee to all tickets
  const handleApplyDevoteeToAll = (dev: Devotee) => {
    if (dev.id) setApplyAllDevoteeId(dev.id)
    setTicketAssignments((prev) => {
      const next = { ...prev }
      cart.forEach((item) => {
        if (item.seva.requiresDevotee) {
          next[item.id] = next[item.id] || {}
          for (let i = 0; i < item.quantity; i++) {
            next[item.id][i] = dev
          }
        }
      })
      return next
    })
    showToast(
      language === 'KN'
        ? `${dev.name} ಅವರನ್ನು ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸಲಾಗಿದೆ`
        : `Applied ${dev.name} to all seva tickets`,
      'success'
    )
  }

  // Handle Apply to All via selected ID
  const handleApplyToAllTickets = () => {
    const selectedDev = devotees.find((d) => d.id === applyAllDevoteeId) || devotees[0]
    if (!selectedDev) {
      showToast(language === 'KN' ? 'ದಯವಿಟ್ಟು ಭಕ್ತರನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Please select a family member first', 'warning')
      return
    }
    handleApplyDevoteeToAll(selectedDev)
  }

  // Save newly added devotee from inline form
  const handleSaveNewDevotee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDevoteeForm.name.trim()) {
      setFormErrors({ name: true })
      return
    }

    const created = onAddDevotee(newDevoteeForm)
    showToast(
      language === 'KN' ? `${created.name} ಭಕ್ತರನ್ನು ಸೇರಿಸಲಾಗಿದೆ` : `${created.name} added to family members`,
      'success'
    )

    // If targeted at a specific ticket, immediately assign
    if (targetTicketForNewDevotee) {
      handleAssignDevoteeToTicket(
        targetTicketForNewDevotee.itemId,
        targetTicketForNewDevotee.ticketIdx,
        created
      )
      setTargetTicketForNewDevotee(null)
    }

    setApplyAllDevoteeId(created.id || '')
    setShowAddDevoteeForm(false)
    setNewDevoteeForm({
      name: '',
      relationship: 'Family Member',
      nakshatra: nakshatras[0] || 'Rohini',
      rashi: rashis[0] || 'Mesha',
      gotram: '',
    })
    setFormErrors({})
  }

  // Proceed to payment handler
  const handleProceedToPayment = () => {
    if (!user) {
      onLogin()
      return
    }

    // Verify all tickets have a devotee assigned if seva requires devotee
    if (hasDevoteeSeva) {
      for (const item of itemsRequiringDevotee) {
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
    }

    setStep('payment')
  }

  // Complete Payment and generate QR code
  const handleExecutePayment = () => {
    setIsProcessing(true)

    setTimeout(() => {
      // Build final ticket allocations
      const finalAllocations: Record<string, Devotee[]> = {}
      cart.forEach((item) => {
        const devs: Devotee[] = []
        for (let i = 0; i < item.quantity; i++) {
          const dev = ticketAssignments[item.id]?.[i] || devotees[0]
          if (dev) devs.push(dev)
        }
        finalAllocations[item.id] = devs
      })

      const newOrder = onCompleteOrder(selectedPayment, finalAllocations)
      setConfirmedOrder(newOrder)
      setIsProcessing(false)
      setStep('qr-pass')
      showToast(t('bookingConfirmedTitle'), 'success')
    }, 1500)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-[#fffdfa] p-3.5 sm:p-5 shadow-2xl rounded-2xl sm:rounded-3xl mx-auto"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── STEP 1: MY CART ── */}
        {step === 'cart' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfd1] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-base text-white shadow-sm shrink-0">
                  🛒
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#34251e]">
                      {language === 'KN' ? 'ನನ್ನ ಕಾರ್ಟ್ (My Cart)' : 'My Cart'}
                    </h2>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          cart.forEach((item) => removeItem(item.id))
                          showToast(language === 'KN' ? 'ಕಾರ್ಟ್ ಖಾಲಿ ಮಾಡಲಾಗಿದೆ' : 'Cart cleared', 'info')
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-bold transition cursor-pointer shadow-2xs"
                        title={language === 'KN' ? 'ಎಲ್ಲಾ ಸೇವೆಗಳನ್ನು ಅಳಿಸಿ' : 'Delete all sevas'}
                      >
                        <IonIcon name="trash-outline" className="text-xs" />
                        <span>{language === 'KN' ? 'ಅಳಿಸಿ' : 'Delete'}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-[#8b7a6d]">
                    {cart.reduce((s, i) => s + i.quantity, 0)} {language === 'KN' ? 'ಸೇವೆಗಳು' : cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'Seva' : 'Sevas'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="modal-close cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-10 text-center">
                <span className="text-4xl">🪔</span>
                <p className="mt-2 font-serif text-base font-bold text-[#34251e]">
                  {language === 'KN' ? 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ' : 'Your cart is empty'}
                </p>
                <p className="mt-1 text-xs text-[#8b7a6d]">
                  {language === 'KN' ? 'ಪೂಜಾ ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಸೇರಿಸಿ' : 'Explore sevas and pick your auspicious ritual slot.'}
                </p>
              </div>
            ) : (
              <div className="mt-3.5 space-y-2.5">
                {cart.map((item) => {
                  const localizedSeva = translateSeva(item.seva)
                  const maxQty = item.seva.maxQuantity || 5
                  const isMax = item.quantity >= maxQty
                  const requiresDev = item.seva.requiresDevotee

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl sm:rounded-2xl border border-[#eadfd1] bg-white p-3 sm:p-3.5 shadow-2xs transition hover:border-[#c1440e]/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {/* Seva details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif text-sm sm:text-base font-bold text-[#34251e]">
                              {localizedSeva.name}
                            </h4>
                            {requiresDev ? (
                              <span className="rounded-full bg-[#fdf2ea] border border-[#fbd3b6] px-2 py-0.2 text-[9px] font-bold text-[#c1440e]">
                                🕉️ Sankalpa Required
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.2 text-[9px] font-bold text-[#16a34a]">
                                🌿 Devotee Not Required
                              </span>
                            )}
                          </div>

                          {/* Date, Slot, and Amount Badges */}
                          <div className="flex items-center gap-1.5 text-[11px] text-[#75685d] flex-wrap">
                            {/* Amount Badge */}
                            <span className="inline-flex items-center gap-1 font-medium bg-[#fdf5f0] border border-[#f5cfb5] px-2 py-0.5 rounded-md">
                              <span>🪙</span>
                              <span className="font-bold text-[#8b7a6d]">{language === 'KN' ? 'ಮೊತ್ತ:' : 'Amount:'}</span>
                              <span className="font-bold text-[#c1440e]">{formatPrice(item.seva.price * item.quantity)}</span>
                            </span>

                            {/* Date Badge */}
                            <span className="inline-flex items-center gap-1 font-medium bg-[#faf5ef] border border-[#ebd8c6] px-2 py-0.5 rounded-md">
                              <span>📅</span>
                              <span className="font-bold text-[#8b7a6d]">{language === 'KN' ? 'ದಿನಾಂಕ:' : 'Date:'}</span>
                              <span className="font-bold text-[#34251e]">{selectedDate || item.date}</span>
                            </span>

                            {/* Slot Badge */}
                            <span className="inline-flex items-center gap-1 font-medium bg-[#faf5ef] border border-[#ebd8c6] px-2 py-0.5 rounded-md">
                              <span>⏰</span>
                              <span className="font-bold text-[#8b7a6d]">{language === 'KN' ? 'ಸ್ಲಾಟ್:' : 'Slot:'}</span>
                              <span className="font-bold text-[#34251e]">{item.slot || '07:00 AM - Morning Pooja'}</span>
                            </span>
                          </div>

                          {/* Reminder if present */}
                          {item.seva.reminder && (
                            <p className="text-[10px] text-[#8a6842] leading-tight">
                              {item.seva.reminder}
                            </p>
                          )}
                        </div>

                        {/* Stepper with - [qty] + and delete item */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-[#f3eae0] pt-1.5 sm:pt-0">
                          {/* Stepper with - [qty] + */}
                          <div className="flex items-center gap-1 rounded-lg border border-[#e0d3c5] bg-[#fffaf5] p-0.5">
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, -1, showToast)}
                              className="grid h-6 w-6 place-items-center rounded-md bg-white hover:bg-[#c1440e] hover:text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                              title="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#34251e]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isMax}
                              onClick={() => changeQty(item.id, 1, showToast)}
                              className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold transition shadow-2xs ${
                                isMax
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white hover:bg-[#c1440e] hover:text-white cursor-pointer'
                              }`}
                              title={isMax ? `Max limit (${maxQty}) reached` : 'Increase quantity'}
                            >
                              +
                            </button>
                          </div>

                          {/* Delete Item */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-red-200 bg-red-50 text-[#c1440e] hover:bg-red-600 hover:text-white transition cursor-pointer shadow-2xs"
                            title="Remove Seva"
                          >
                            <IonIcon name="trash-outline" className="text-sm" />
                          </button>
                        </div>
                      </div>

                      {isMax && (
                        <p className="mt-1.5 text-[9px] text-[#b45309] font-medium">
                          ⚠️ Maximum limit of {maxQty} tickets reached for this ritual.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bill Summary */}
            {cart.length > 0 && (
              <div className="mt-6 rounded-2xl border border-[#eadfd1] bg-[#fbf8f3] p-4 text-xs space-y-2">
                <div className="flex justify-between text-[#75685d]">
                  <span>{t('subtotalLabel')}</span>
                  <span className="font-semibold text-[#34251e]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#28724d]">
                    <span>{t('discountLabel')}</span>
                    <span className="font-semibold">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#eadfd1] pt-2 text-sm font-bold text-[#34251e]">
                  <span>{t('totalLabel')}</span>
                  <span className="font-serif text-lg font-bold text-[#c1440e]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            {cart.length > 0 && (
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-[#d8c8b8] py-3 text-xs sm:text-sm font-bold text-[#674f40] hover:bg-[#f5ede2] transition cursor-pointer"
                >
                  {language === 'KN' ? 'ಇನ್ನಷ್ಟು ಸೇರಿಸಿ' : 'Add More Sevas'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onNavigateToAssignDevotee) {
                      onNavigateToAssignDevotee()
                    }
                  }}
                  className="btn-primary flex-1 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {language === 'KN' ? 'ಭಕ್ತರನ್ನು ನಿಯೋಜಿಸಿ (ಸಂಕಲ್ಪ) →' : 'Assign Devotee (Sankalpam) →'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: SANKALPAM & DEVOTEE ASSIGNMENT ── */}
        {step === 'sankalpam' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfd1] pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#eadfd1] bg-white text-xs font-bold text-[#674f40] hover:border-[#c1440e] cursor-pointer"
                  title="Back to Cart"
                >
                  ←
                </button>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#34251e]">
                    🕉️ {language === 'KN' ? 'ಪವಿತ್ರ ಸಂಕಲ್ಪ ವಿವರಗಳು' : 'Sacred Sankalpa Assignment'}
                  </h2>
                  <p className="text-xs text-[#8b7a6d]">
                    {language === 'KN' ? 'ಅಗತ್ಯವಿರುವ ಸೇವೆಗಳಿಗೆ ಮಾತ್ರ ಭಕ್ತರನ್ನು ನಿಯೋಜಿಸಿ' : 'Assign family members only for sevas requiring personal Vedic sankalpa.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="modal-close cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Devotee Requirement Guidance Banner */}
            <div className="mt-4 rounded-2xl border border-[#ebdcc9] bg-[#fffaf5] p-3.5 text-xs text-[#6e5849] flex items-start gap-2.5">
              <span className="text-base text-[#c1440e] shrink-0">ℹ️</span>
              <div>
                <p className="font-bold text-[#34251e]">
                  {language === 'KN' ? 'ಕೆಲವು ಸೇವೆಗಳಿಗೆ ಮಾತ್ರ ಭಕ್ತರ ವಿವರ ಅಗತ್ಯ' : 'Devotee assignment is only needed for specific sevas'}
                </p>
                <p className="mt-0.5 text-[11px] text-[#75685d] leading-relaxed">
                  {language === 'KN'
                    ? 'ಅಭಿಷೇಕ, ಅರ್ಚನೆ ಮತ್ತು ಹೋಮಗಳಿಗೆ ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಭಕ್ತರ ಹೆಸರು, ಗೋತ್ರ ಅಗತ್ಯ. ದೀಪಾರಾಧನೆ, ಆರತಿ ದರ್ಶನ ಮತ್ತು ಅನ್ನದಾನ ಮುಂತಾದ ಮುಕ್ತ ಸೇವೆಗಳಿಗೆ ಭಕ್ತರ ವಿವರ ಅಗತ್ಯವಿಲ್ಲ.'
                    : 'Personal rituals (Abhishekam, Archana, Homam) require devotee details for gotram chanting. General offerings (Deepam, Aarti Darshan, Anna Prasadam) do not require assigning a devotee.'}
                </p>
              </div>
            </div>

            {/* 1. Cart Summary (Top) */}
            <div className="mt-5 rounded-2xl border border-[#eadfd1] bg-[#faf6f0] p-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-2 font-bold text-[#c1440e]">
                <span>📋 Cart Summary</span>
                <span>{selectedDate} · {localizedTemple?.name}</span>
              </div>
              <div className="mt-2.5 space-y-1.5">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[#5c4d41]">
                    <span>
                      {translateSeva(item.seva).name} × {item.quantity} ({item.slot || 'Default Slot'})
                    </span>
                    <span className="font-bold text-[#34251e]">
                      {formatPrice(item.seva.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Added Family Members (Devotees) */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#34251e]">
                    👨‍👩‍👧‍👦 {language === 'KN' ? 'ಸೇರಿಸಲಾದ ಕುಟುಂಬ ಸದಸ್ಯರು' : 'Added Family Members / Devotees'}
                  </h3>
                  <p className="text-[11px] text-[#8b7a6d]">
                    {language === 'KN' ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ನಿಂದ ಲಭ್ಯವಿರುವ ಭಕ್ತರು' : 'Devotees registered in your profile'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDevoteeForm(!showAddDevoteeForm)}
                  className="flex items-center gap-1.5 rounded-full bg-[#fdf2ea] border border-[#f5cfb5] px-3.5 py-1.5 text-xs font-bold text-[#c1440e] hover:bg-[#c1440e] hover:text-white transition cursor-pointer"
                >
                  <span>+</span>
                  <span>{language === 'KN' ? 'ಹೊಸ ಭಕ್ತರನ್ನು ಸೇರಿಸಿ' : 'Add Devotee'}</span>
                </button>
              </div>

              {/* Devotees Card List with Direct Select & Apply to All Tickets */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {devotees.map((dev) => {
                  const isSelected = applyAllDevoteeId === dev.id
                  return (
                    <div
                      key={dev.id || dev.name}
                      onClick={() => {
                        if (dev.id) setApplyAllDevoteeId(dev.id)
                      }}
                      className={`flex flex-col justify-between rounded-2xl border p-3.5 text-xs transition cursor-pointer ${
                        isSelected
                          ? 'border-[#c1440e] bg-[#fffaf5] shadow-sm ring-2 ring-[#c1440e]/20'
                          : 'border-[#eadfd1] bg-white hover:border-[#c1440e]/60 hover:bg-[#fffdfa]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#34251e] truncate">{dev.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isSelected ? 'bg-[#c1440e] text-white' : 'bg-[#f5ede2] text-[#c1440e]'
                            }`}
                          >
                            {dev.relationship || 'Self'}
                          </span>
                        </div>
                        <div className="mt-1 space-y-0.5 text-[11px] text-[#75685d]">
                          <p>⭐ {dev.nakshatra} · 🌙 {dev.rashi}</p>
                          {dev.gotram && <p>🕉️ {dev.gotram}</p>}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#f3eae0] flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${isSelected ? 'text-[#c1440e]' : 'text-[#8b7a6d]'}`}>
                          {isSelected ? '✓ Selected' : 'Tap to select'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApplyDevoteeToAll(dev)
                          }}
                          className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition shadow-2xs cursor-pointer ${
                            isSelected
                              ? 'bg-[#c1440e] text-white hover:bg-[#a5370a]'
                              : 'bg-[#f5ede2] text-[#674f40] hover:bg-[#c1440e] hover:text-white'
                          }`}
                          title="Apply this devotee to all seva tickets"
                        >
                          ⚡ Apply to All Tickets
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Inline Add Devotee Form if triggered */}
              {showAddDevoteeForm && (
                <form
                  onSubmit={handleSaveNewDevotee}
                  className="mt-4 rounded-2xl border border-[#c1440e]/30 bg-[#fffdfa] p-4 text-xs shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#f3eae0] pb-2">
                    <span className="font-bold text-[#c1440e]">
                      ✨ {language === 'KN' ? 'ಹೊಸ ಕುಟುಂಬ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ' : 'Add New Family Member'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddDevoteeForm(false)}
                      className="text-[#8b7a6d] hover:text-[#d94444] cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className={`w-full rounded-xl border p-2 text-xs ${
                          formErrors.name ? 'border-red-500 bg-red-50' : 'border-[#d8c8b8] bg-white'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                        Relationship
                      </label>
                      <select
                        value={newDevoteeForm.relationship || 'Self'}
                        onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, relationship: e.target.value })}
                        className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2 text-xs"
                      >
                        {['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Family Member'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                        Nakshatra (Birth Star)
                      </label>
                      <select
                        value={newDevoteeForm.nakshatra}
                        onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, nakshatra: e.target.value })}
                        className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2 text-xs"
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
                        className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2 text-xs"
                      >
                        {rashis.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#5c4d41] mb-1">
                        Gotram (Optional)
                      </label>
                      <input
                        type="text"
                        value={newDevoteeForm.gotram || ''}
                        onChange={(e) => setNewDevoteeForm({ ...newDevoteeForm, gotram: e.target.value })}
                        placeholder="e.g. Kashyapa / Vishwamitra"
                        className="w-full rounded-xl border border-[#d8c8b8] bg-white p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#f3eae0]">
                    <button
                      type="button"
                      onClick={() => setShowAddDevoteeForm(false)}
                      className="rounded-xl border border-[#d8c8b8] px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary rounded-xl px-4 py-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Save Devotee
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 3. Apply to All Tickets Action Bar */}
            <div className="mt-6 rounded-2xl border border-[#eedecb] bg-gradient-to-r from-[#fdf7f0] to-[#fffdfa] p-4 text-xs shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#34251e]">
                    ⚡ {language === 'KN' ? 'ಎಲ್ಲಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಅನ್ವಯಿಸಿ' : 'Apply to All Tickets'}
                  </p>
                  <p className="text-[#8b7a6d]">
                    {language === 'KN'
                      ? 'ಆಯ್ಕೆಮಾಡಿದ ಭಕ್ತರನ್ನು ಎಲ್ಲಾ ಸೇವಾ ಟಿಕೆಟ್‌ಗಳಿಗೆ ಏಕಕಾಲದಲ್ಲಿ ನಿಯೋಜಿಸಿ'
                      : 'Assign one family member across all booked seva tickets in 1 click'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={applyAllDevoteeId}
                    onChange={(e) => setApplyAllDevoteeId(e.target.value)}
                    className="rounded-xl border border-[#d8c8b8] bg-white px-3 py-2 text-xs font-semibold text-[#34251e]"
                  >
                    {devotees.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.relationship || 'Self'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleApplyToAllTickets}
                    className="rounded-xl bg-[#c1440e] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#a5370a] transition cursor-pointer"
                  >
                    {language === 'KN' ? 'ಅನ್ವಯಿಸಿ' : 'Apply to All'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Assign a Family Member to Each Seva Ticket */}
            <div className="mt-7 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#34251e]">
                🎟️ {language === 'KN' ? 'ಪ್ರತಿ ಟಿಕೆಟ್‌ಗೆ ಭಕ್ತರ ನಿಯೋಜನೆ' : 'Assign a Family Member to Each Seva Ticket'}
              </h3>

              {itemsRequiringDevotee.map((item) => {
                const localizedSeva = translateSeva(item.seva)

                return (
                  <div key={item.id} className="space-y-3">
                    {Array.from({ length: item.quantity }).map((_, ticketIdx) => {
                      const currentDev = ticketAssignments[item.id]?.[ticketIdx]

                      return (
                        <div
                          key={ticketIdx}
                          className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-2xs transition hover:border-[#c1440e]/50"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Ticket header */}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#f5ede2] px-2.5 py-0.5 text-[10px] font-bold text-[#c1440e]">
                                  Ticket #{ticketIdx + 1}
                                </span>
                                <h4 className="font-serif text-sm font-bold text-[#34251e]">
                                  {localizedSeva.name}
                                </h4>
                              </div>
                              <p className="mt-1 text-xs text-[#75685d]">
                                Slot: <span className="font-medium text-[#34251e]">{item.slot || '07:00 AM - Morning Pooja'}</span> · {selectedDate || item.date}
                              </p>
                            </div>

                            {/* Devotee quick select dropdown & + Add */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <select
                                value={currentDev?.id || ''}
                                onChange={(e) => {
                                  const selected = devotees.find((d) => d.id === e.target.value) || null
                                  handleAssignDevoteeToTicket(item.id, ticketIdx, selected)
                                }}
                                className="rounded-xl border border-[#d8c8b8] bg-[#fffcf7] px-3 py-1.5 text-xs font-semibold text-[#34251e] hover:border-[#c1440e] transition"
                              >
                                <option value="">-- Quick Select Devotee --</option>
                                {devotees.map((d) => (
                                  <option key={d.id} value={d.id}>
                                    {d.name} ({d.relationship || 'Self'} - {d.nakshatra})
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => {
                                  setTargetTicketForNewDevotee({ itemId: item.id, ticketIdx })
                                  setShowAddDevoteeForm(true)
                                }}
                                className="rounded-xl border border-dashed border-[#c1440e] bg-[#fdfaf5] px-2.5 py-1.5 text-xs font-bold text-[#c1440e] hover:bg-[#faefe2] transition cursor-pointer"
                                title="Add a new devotee for this ticket"
                              >
                                + Add
                              </button>
                            </div>
                          </div>

                          {/* Selected Devotee Preview Tag */}
                          {currentDev && (
                            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#faf6f0] px-3 py-1.5 text-[11px] text-[#5e4b3c]">
                              <span>
                                Recipient: <strong>{currentDev.name}</strong> ({currentDev.relationship || 'Family'}) · Gotram: {currentDev.gotram || 'Kashyapa'}
                              </span>
                              <span className="text-[#28724d] font-bold">✓ Assigned</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}

              {/* General Ritual Offerings (Devotee details not required for these offerings) */}
              {cart.filter((i) => !i.seva.requiresDevotee).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#f0e3d5]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
                    🌿 General Ritual Offerings (Community Offering / Devotee Details Not Required):
                  </p>
                  {cart
                    .filter((i) => !i.seva.requiresDevotee)
                    .map((item) => {
                      const locSeva = translateSeva(item.seva)
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-xs shadow-2xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-bold text-[#166534]">
                                {locSeva.name} × {item.quantity}
                              </span>
                              <span className="rounded-full bg-[#dcfce7] border border-[#86efac] px-2.5 py-0.5 text-[10px] font-bold text-[#15803d]">
                                General Offering
                              </span>
                            </div>
                            <p className="text-[11px] text-[#166534]">
                              Slot: <span className="font-semibold">{item.slot || '07:00 AM - Morning Pooja'}</span> · {selectedDate || item.date} — Directly offered by temple archakas.
                            </p>
                          </div>
                          <span className="font-serif font-bold text-[#166534] shrink-0 text-sm">
                            {formatPrice(item.seva.price * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex gap-3 border-t border-[#eadfd1] pt-4">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="flex-1 rounded-2xl border border-[#d8c8b8] py-3 text-xs sm:text-sm font-bold text-[#674f40] hover:bg-[#f5ede2] transition cursor-pointer"
              >
                ← Back to Cart
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="btn-primary flex-1 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{language === 'KN' ? 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Proceed to Pay'}</span>
                <span>({formatPrice(total)})</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT SCREEN ── */}
        {step === 'payment' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfd1] pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(hasDevoteeSeva ? 'sankalpam' : 'cart')}
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
              <button
                type="button"
                onClick={onClose}
                className="modal-close cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Amount Banner */}
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#34251e] to-[#453127] p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#d4a64a]">Total Amount Payable</p>
                <p className="mt-1 font-serif text-3xl font-bold text-white">{formatPrice(total)}</p>
              </div>
              <div className="text-right text-xs text-[#ebdcc9]">
                <p>{cart.reduce((s, i) => s + i.quantity, 0)} Seva Tickets</p>
                <p>{selectedDate}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-6 space-y-3">
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

            {/* Bottom Actions */}
            <div className="mt-8 flex gap-3">
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
                    <span>🔒 Pay {formatPrice(total)} & Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: SACRED QR PASS SCREEN (AFTER PAYMENT) ── */}
        {step === 'qr-pass' && confirmedOrder && (
          <div className="relative text-center py-2 max-w-lg mx-auto">
            {/* Top Right Close Icon */}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-[#f5ede2] text-xl font-bold text-[#674f40] hover:bg-[#c1440e] hover:text-white transition cursor-pointer z-20 shadow-xs"
              aria-label="Close"
              title="Close QR Pass"
            >
              ×
            </button>

            {/* Success icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f5ed]">
              <span className="text-3xl text-[#28724d]">✓</span>
            </div>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#34251e]">
              🙏 {language === 'KN' ? 'ಸೇವಾ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!' : 'Seva Booking Confirmed!'}
            </h2>
            <p className="mt-1 text-xs text-[#8b7a6d] max-w-md mx-auto">
              {language === 'KN'
                ? 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸೇವಾ ಕ್ಯೂಆರ್ ಪಾಸ್ ಸಿದ್ಧವಾಗಿದೆ. ದೇವಸ್ಥಾನದ ಪ್ರವೇಶದ್ವಾರದಲ್ಲಿ ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ತೋರಿಸಿ.'
                : 'Your sacred digital pass is ready. Show this QR code at temple entrance for sanctum entry and sankalpa.'}
            </p>

            {/* QR Code Pass Card - perfectly centered */}
            <div className="mt-5 mx-auto max-w-md rounded-3xl border-2 border-[#e6dacb] bg-[#fffdfa] p-5 text-left shadow-md space-y-4">
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

              {/* QR Code - centered */}
              <div className="py-2 flex flex-col items-center justify-center text-center">
                <SacredQrCodeSvg code={confirmedOrder.id} />
                <p className="mt-2.5 text-[11px] font-semibold text-[#8b7a6d]">
                  Scan for Temple Sanctum Entry & Priest Sankalpa
                </p>
              </div>

              {/* Details grid */}
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
                {confirmedOrder.items[0]?.devotee && (
                  <div className="flex justify-between border-t border-[#eedecb] pt-2">
                    <span className="text-[#8b7a6d]">Sankalpa Devotees:</span>
                    <span className="font-bold text-[#34251e]">
                      {confirmedOrder.items.map((it) => it.devotee?.name).filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#eedecb] pt-2">
                  <span className="text-[#8b7a6d]">Total Paid:</span>
                  <span className="font-serif font-bold text-sm text-[#c1440e]">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              {onNavigateToMySevas && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onNavigateToMySevas()
                  }}
                  className="flex-1 rounded-2xl bg-[#f5ede2] hover:bg-[#ebdcc9] py-3 text-xs sm:text-sm font-bold text-[#674f40] transition cursor-pointer"
                >
                  📱 View in My Sevas
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  window.print()
                }}
                className="flex-1 rounded-2xl border border-[#d8c8b8] py-3 text-xs sm:text-sm font-bold text-[#34251e] hover:bg-white transition cursor-pointer"
              >
                🖨️ Download / Print Pass
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary flex-1 py-3 text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SankalpamModal
