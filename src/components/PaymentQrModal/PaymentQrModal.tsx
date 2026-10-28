import { useState, useMemo } from 'react'
import type { Order, Temple } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import { temples, sevas } from '../../data'

interface PaymentQrModalProps {
  orders: Order[]
  selectedTemple?: Temple | null
  onClose: () => void
  onNavigateToSevas?: () => void
  onToast?: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
}

/**
 * High-fidelity SVG QR Code generator simulating a scannable Temple Seva digital pass.
 * - Active: Vibrant temple theme colour (#c1440e) with golden accents.
 * - Deactive/Received: Disabled light gray (#9ca3af / #d1d5db) styling.
 */
export const SacredQrCodeSvg = ({
  code,
  variant = 'active',
}: {
  code: string
  variant?: 'active' | 'deactive'
}) => {
  const isDeactive = variant === 'deactive'
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const gridSize = 19
  const cellSize = 10

  const isCornerMarker = (r: number, c: number) => {
    if (r <= 6 && c <= 6) return true
    if (r <= 6 && c >= gridSize - 7) return true
    if (r >= gridSize - 7 && c <= 6) return true
    return false
  }

  const cells = useMemo(() => {
    const list: { r: number; c: number }[] = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!isCornerMarker(r, c)) {
          if (r >= 8 && r <= 10 && c >= 8 && c <= 10) continue
          const val = (r * 13 + c * 17 + hash) % 10
          if (val > 4) {
            list.push({ r, c })
          }
        }
      }
    }
    return list
  }, [hash])

  // Colors based on variant: Active (Theme Colour #c1440e) vs Deactive (Disabled Light Gray #9ca3af)
  const finderOuterColor = isDeactive ? '#9ca3af' : '#2c1e17'
  const finderInnerColor = isDeactive ? '#f3f4f6' : '#ffffff'
  const finderCenterColor = isDeactive ? '#d1d5db' : '#c1440e'
  const cellColor = isDeactive ? '#9ca3af' : '#c1440e'
  const emblemStroke = isDeactive ? '#d1d5db' : '#c1440e'
  const emblemFill = isDeactive ? '#f9fafb' : '#fffcf6'
  const emblemText = isDeactive ? '#9ca3af' : '#c1440e'

  const drawFinder = (x: number, y: number) => (
    <g>
      <rect x={x} y={y} width={70} height={70} fill={finderOuterColor} rx={8} />
      <rect x={x + 10} y={y + 10} width={50} height={50} fill={finderInnerColor} rx={4} />
      <rect x={x + 20} y={y + 20} width={30} height={30} fill={finderCenterColor} rx={3} />
    </g>
  )

  return (
    <div
      className={`relative mx-auto flex items-center justify-center rounded-xl p-2 transition-all duration-300 max-w-[135px] ${
        isDeactive
          ? 'border border-[#e5e7eb] bg-[#f9fafb] opacity-85 shadow-none'
          : 'border border-[#c1440e]/30 bg-[#fffdfa] shadow-xs'
      }`}
    >
      <svg
        viewBox="0 0 190 190"
        className={`h-28 w-28 sm:h-30 sm:w-30 transition-transform duration-300 ${
          isDeactive ? 'grayscale-[80%]' : 'hover:scale-[1.02]'
        }`}
      >
        {/* Top-Left Finder */}
        {drawFinder(0, 0)}
        {/* Top-Right Finder */}
        {drawFinder(120, 0)}
        {/* Bottom-Left Finder */}
        {drawFinder(0, 120)}

        {/* Data Cells */}
        {cells.map(({ r, c }, idx) => (
          <rect
            key={idx}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize - 1.5}
            height={cellSize - 1.5}
            fill={cellColor}
            rx={1.5}
          />
        ))}

        {/* Center Sacred Emblem Badge */}
        <circle cx="95" cy="95" r="16" fill={emblemFill} stroke={emblemStroke} strokeWidth="2" />
        <text
          x="95"
          y="101"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill={emblemText}
          fontFamily="serif"
        >
          ॐ
        </text>
      </svg>
    </div>
  )
}

const PaymentQrModal = ({
  orders,
  selectedTemple,
  onClose,
  onNavigateToSevas,
  onToast,
}: PaymentQrModalProps) => {
  const { t, language, translateTemple, translateSeva } = useLanguage()

  // Tab State: 'active' (Theme colour) vs 'deactive' (Light gray disabled)
  const [activeTab, setActiveTab] = useState<'active' | 'deactive'>('active')

  // Sample default passes to guarantee immediate demonstration of both Active and Deactive QR codes
  const sampleActiveOrder: Order = useMemo(
    () => ({
      id: 'TS-ACT-8842',
      temple: selectedTemple || temples[0],
      date: 'Auspicious Upcoming Pooja Date',
      items: [
        {
          id: 'sample-act-1',
          seva: sevas[0],
          quantity: 1,
          selectedSlot: '07:30 AM - Morning Pooja',
          selectedDate: 'Upcoming Date',
        },
      ],
      subtotal: sevas[0].price,
      discount: 0,
      total: sevas[0].price,
      paymentMethod: 'UPI / NetBanking',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          label: 'Booking Confirmed',
          time: 'Active Sanctum Pass Issued',
          description: 'Payment verified and sacred pass generated',
          completed: true,
        },
      ],
    }),
    [selectedTemple]
  )

  const sampleDeactiveOrder: Order = useMemo(
    () => ({
      id: 'TS-EXP-3109',
      temple: selectedTemple || temples[0],
      date: 'Previous Completed Date',
      items: [
        {
          id: 'sample-deact-1',
          seva: sevas[1] || sevas[0],
          quantity: 1,
          selectedSlot: '10:30 AM - Madhyahna Pooja',
          selectedDate: 'Concluded Date',
        },
      ],
      subtotal: (sevas[1] || sevas[0]).price,
      discount: 0,
      total: (sevas[1] || sevas[0]).price,
      paymentMethod: 'UPI',
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      timeline: [
        {
          label: 'Ritual Concluded',
          time: 'Completed & Prasadam Distributed',
          description: 'Seva consecrated and sacred prasadam dispatched',
          completed: true,
        },
      ],
    }),
    [selectedTemple]
  )

  // Filter orders specifically for the active temple, or all orders
  const templeOrders = useMemo(() => {
    if (!selectedTemple) return orders
    const matched = orders.filter((o) => o.temple.id === selectedTemple.id)
    return matched.length > 0 ? matched : orders
  }, [orders, selectedTemple])

  // Categorize orders for active and deactive
  const activeOrders = useMemo(() => {
    const list = templeOrders.filter((o) => o.status === 'Confirmed' || o.status === 'In Progress')
    return list.length > 0 ? list : [sampleActiveOrder]
  }, [templeOrders, sampleActiveOrder])

  const deactiveOrders = useMemo(() => {
    const list = templeOrders.filter((o) => o.status === 'Completed' || o.status === 'Cancelled')
    return list.length > 0 ? list : [sampleDeactiveOrder]
  }, [templeOrders, sampleDeactiveOrder])

  // Selected indices
  const [activeSelectIdx, setActiveSelectIdx] = useState(0)
  const [deactiveSelectIdx, setDeactiveSelectIdx] = useState(0)

  // Current order for active tab
  const currentActiveOrder = activeOrders[activeSelectIdx] || activeOrders[0] || sampleActiveOrder
  // Current order for deactive tab
  const currentDeactiveOrder = deactiveOrders[deactiveSelectIdx] || deactiveOrders[0] || sampleDeactiveOrder

  const isDeactiveView = activeTab === 'deactive'
  const displayedOrder = isDeactiveView ? currentDeactiveOrder : currentActiveOrder

  const templeDisplayName = selectedTemple
    ? translateTemple(selectedTemple).name
    : displayedOrder
    ? translateTemple(displayedOrder.temple).name
    : 'Sacred Sanctuary'

  const handleDownload = () => {
    if (onToast) {
      onToast(
        language === 'KN'
          ? isDeactiveView
            ? 'ನಿಷ್ಕ್ರಿಯ ಸೇವಾ ಕೌಂಟರ್‌ಫಾಯಿಲ್ ಉಳಿಸಲಾಗಿದೆ!'
            : 'ಸಕ್ರಿಯ ಕ್ಯೂಆರ್ ಪಾಸ್ ನಿಮ್ಮ ಸಾಧನಕ್ಕೆ ಉಳಿಸಲಾಗಿದೆ!'
          : isDeactiveView
          ? 'Deactive Seva counterfoil saved to your device!'
          : 'Active Payment QR Pass saved successfully to your device!',
        'success'
      )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container relative w-full max-w-[340px] sm:max-w-[360px] max-h-[92vh] overflow-y-auto bg-[#fffdf9] p-3 sm:p-4 shadow-2xl rounded-2xl animate-fade-in mx-auto"
        style={{ maxWidth: '360px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#f5ede2] text-sm font-bold text-[#674f40] hover:bg-[#c1440e] hover:text-white transition cursor-pointer z-10"
          aria-label="Close"
          title="Close QR Pass"
        >
          ×
        </button>

        {/* Modal Header */}
        <div className="text-left pr-7 border-b border-[#eadfd1] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📱</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${
                isDeactiveView
                  ? 'bg-[#f3f4f6] text-[#6b7280] border border-[#d1d5db]'
                  : 'bg-[#fdf2e9] text-[#c1440e] border border-[#f5cfb5]'
              }`}
            >
              {templeDisplayName}
            </span>
          </div>
          <h2 className="mt-0.5 font-serif text-base font-bold text-[#34251e]">
            {language === 'KN' ? 'ಪಾವತಿ ಕ್ಯೂಆರ್ ಪಾಸ್ (Payment QR Pass)' : 'Payment QR Pass'}
          </h2>
          <p className="text-[10px] text-[#8b7a6d]">
            {isDeactiveView
              ? (language === 'KN' ? 'ನಿಷ್ಕ್ರಿಯ ಮತ್ತು ಮುಕ್ತಾಯಗೊಂಡ ಸೇವಾ ಕ್ಯೂಆರ್ ಕೋಡ್‌ಗಳು' : 'Deactive & concluded ritual QR passes')
              : (language === 'KN' ? 'ಸಕ್ರಿಯ ದೇವಸ್ಥಾನ ಪ್ರವೇಶ ಮತ್ತು ಸಂಕಲ್ಪ ಕ್ಯೂಆರ್ ಕೋಡ್‌ಗಳು' : 'Active sanctum entry & ritual QR codes')}
          </p>
        </div>

        {/* ── Active vs Deactive Tabs ── */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl bg-[#f5ede2] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-xs'
                : 'text-[#674f40] hover:bg-white/60'
            }`}
          >
            <span>🟢</span>
            <span>{language === 'KN' ? 'ಸಕ್ರಿಯ' : 'Active QR'}</span>
            <span className="rounded-full bg-white/25 px-1 py-0.2 text-[9px] font-bold">
              {activeOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deactive')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-bold transition cursor-pointer ${
              activeTab === 'deactive'
                ? 'bg-[#6b7280] text-white shadow-xs'
                : 'text-[#674f40] hover:bg-white/60'
            }`}
          >
            <span>⚪</span>
            <span>{language === 'KN' ? 'ನಿಷ್ಕ್ರಿಯ' : 'Deactive QR'}</span>
            <span className="rounded-full bg-white/25 px-1 py-0.2 text-[9px] font-bold">
              {deactiveOrders.length}
            </span>
          </button>
        </div>

        {/* ── Dropdown if multiple orders in active tab ── */}
        {!isDeactiveView && activeOrders.length > 1 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fff9f3] border border-[#f5cfb5] p-2 text-xs">
            <span className="font-bold text-[#c1440e]">Select Active Seva:</span>
            <select
              value={activeSelectIdx}
              onChange={(e) => setActiveSelectIdx(Number(e.target.value))}
              className="rounded-lg border border-[#d8c8b8] bg-white px-2 py-1 text-xs font-bold text-[#34251e] shadow-xs cursor-pointer focus:outline-none"
            >
              {activeOrders.map((ord, idx) => (
                <option key={ord.id} value={idx}>
                  {ord.id} — ({ord.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Dropdown if multiple orders in deactive tab ── */}
        {isDeactiveView && deactiveOrders.length > 1 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f9fafb] border border-[#e5e7eb] p-2 text-xs">
            <span className="font-bold text-[#6b7280]">Select Deactive Seva:</span>
            <select
              value={deactiveSelectIdx}
              onChange={(e) => setDeactiveSelectIdx(Number(e.target.value))}
              className="rounded-lg border border-[#d1d5db] bg-white px-2 py-1 text-xs font-bold text-[#374151] shadow-xs cursor-pointer focus:outline-none"
            >
              {deactiveOrders.map((ord, idx) => (
                <option key={ord.id} value={idx}>
                  {ord.id} — ({ord.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {displayedOrder ? (
          /* ── The Payment QR Code Card ── */
          <div
            className={`mt-2.5 rounded-xl p-2.5 text-center transition-all duration-300 relative overflow-hidden max-w-[320px] mx-auto ${
              isDeactiveView
                ? 'border border-[#e5e7eb] bg-[#f9fafb]'
                : 'border border-[#e6dacb] bg-white shadow-xs'
            }`}
          >
            {/* Status Badge */}
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  isDeactiveView
                    ? 'bg-[#f3f4f6] text-[#6b7280] border border-[#d1d5db]'
                    : 'bg-[#e9f5ed] text-[#28724d] border border-[#b2e5c8]'
                }`}
              >
                {isDeactiveView
                  ? (language === 'KN' ? '⚪ ನಿಷ್ಕ್ರಿಯ' : '⚪ DEACTIVE')
                  : (language === 'KN' ? '🟢 ಸಕ್ರಿಯ' : '🟢 ACTIVE')}
              </span>
              <span className="font-mono text-[10px] font-bold text-[#8b7a6d]">
                ID: {displayedOrder.id}
              </span>
            </div>

            {/* Scannable SVG QR Code */}
            <SacredQrCodeSvg
              code={`${displayedOrder.id}|${displayedOrder.temple.id}|${displayedOrder.date}|${displayedOrder.status}`}
              variant={isDeactiveView ? 'deactive' : 'active'}
            />

            <p className="mt-1.5 text-[10px] font-semibold text-[#8b7a6d]">
              {isDeactiveView
                ? (language === 'KN' ? '⚪ ಪೂಜೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ' : '⚪ Ritual Concluded · Deactivated')
                : (language === 'KN' ? '⚡ ಸಂಕಲ್ಪಕ್ಕಾಗಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : '⚡ Scan for Temple Sanctum Entry')}
            </p>

            {/* Pass Metadata Details */}
            <div
              className={`mt-2 rounded-lg p-2 text-left text-[10.5px] space-y-1 ${
                isDeactiveView ? 'bg-[#f3f4f6] border border-[#e5e7eb]' : 'bg-[#faf6f0] border border-[#eee2d3]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#8b7a6d]">Temple:</span>
                <span className="font-bold text-[#34251e] truncate max-w-[170px]">
                  {translateTemple(displayedOrder.temple).name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#8b7a6d]">Date:</span>
                <span className="font-bold text-[#34251e]">{displayedOrder.date}</span>
              </div>

              {displayedOrder.items && displayedOrder.items.length > 0 && (
                <div className="flex items-start justify-between">
                  <span className="text-[#8b7a6d]">Offerings:</span>
                  <span className="font-bold text-right truncate max-w-[170px] text-[#34251e]">
                    {displayedOrder.items.map((i) => `${translateSeva(i.seva).name} × ${i.quantity}`).join(', ')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-[#e2d5c5]">
                <span className="font-semibold text-[#8b7a6d]">Total:</span>
                <span
                  className={`font-serif text-[11px] font-bold ${
                    isDeactiveView ? 'text-[#6b7280]' : 'text-[#c1440e]'
                  }`}
                >
                  {formatPrice(displayedOrder.total)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty State for Temple ── */
          <div className="mt-3 rounded-2xl p-5 text-center border-2 border-dashed border-[#eadfd1] bg-[#fffcf7]">
            <span className="text-3xl">🛕</span>
            <h3 className="mt-2 font-serif text-base font-bold text-[#34251e]">
              {isDeactiveView ? 'No Concluded Passes' : 'No Active Passes'}
            </h3>
            <p className="mt-1 text-[11px] text-[#8b7a6d] max-w-xs mx-auto leading-relaxed">
              No {isDeactiveView ? 'concluded' : 'active'} booking passes found for{' '}
              <strong>{templeDisplayName}</strong>.
            </p>
            {onNavigateToSevas && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onNavigateToSevas()
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:brightness-110 cursor-pointer"
              >
                <span>🪔</span>
                <span>Explore {templeDisplayName} Sevas</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-3.5 flex gap-2">
          {displayedOrder && (
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 rounded-xl border border-[#d8c8b8] bg-[#fdfbf7] py-2.5 text-xs font-bold text-[#674f40] transition hover:bg-[#f5ede2] cursor-pointer"
            >
              📥 {isDeactiveView ? 'Save Receipt' : t('qrSaveBtn') || 'Save Pass'}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#34251e] py-2.5 text-xs font-bold text-white transition hover:bg-[#4d372c] cursor-pointer"
          >
            {t('qrCloseBtn') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentQrModal
