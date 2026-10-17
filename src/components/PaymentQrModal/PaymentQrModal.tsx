import { useState, useMemo } from 'react'
import type { Order } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface PaymentQrModalProps {
  orders: Order[]
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
      className={`relative mx-auto flex items-center justify-center rounded-2xl p-4 transition-all duration-300 ${
        isDeactive
          ? 'border-2 border-[#e5e7eb] bg-[#f9fafb] opacity-85 shadow-none'
          : 'border-2 border-[#c1440e]/40 bg-[#fffdfa] shadow-md'
      }`}
    >
      <svg
        viewBox="0 0 190 190"
        className={`h-48 w-48 transition-transform duration-300 ${
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
  onClose,
  onNavigateToSevas,
  onToast,
}: PaymentQrModalProps) => {
  const { t, language, translateTemple, translateSeva } = useLanguage()

  // Tab State: 'active' (Theme colour) vs 'received' (Light gray disabled)
  const [activeTab, setActiveTab] = useState<'active' | 'received'>('active')

  // Categorize orders
  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Confirmed' || o.status === 'In Progress')
  }, [orders])

  const receivedOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Completed' || o.status === 'Cancelled')
  }, [orders])

  // Selected indices
  const [activeSelectIdx, setActiveSelectIdx] = useState(0)
  const [receivedSelectIdx, setReceivedSelectIdx] = useState(0)

  // Current order for active tab
  const currentActiveOrder = activeOrders[activeSelectIdx] || activeOrders[0] || null
  // Current order for received tab
  const currentReceivedOrder = receivedOrders[receivedSelectIdx] || receivedOrders[0] || null

  const isDeactiveView = activeTab === 'received'
  const displayedOrder = isDeactiveView ? currentReceivedOrder : currentActiveOrder

  const handleDownload = () => {
    if (onToast) {
      onToast(
        language === 'KN'
          ? isDeactiveView
            ? 'ಸ್ವೀಕರಿಸಿದ ಸೇವಾ ಕೌಂಟರ್‌ಫಾಯಿಲ್ ಉಳಿಸಲಾಗಿದೆ!'
            : 'ಸಕ್ರಿಯ ಕ್ಯೂಆರ್ ಪಾಸ್ ನಿಮ್ಮ ಸಾಧನಕ್ಕೆ ಉಳಿಸಲಾಗಿದೆ!'
          : isDeactiveView
          ? 'Completed Seva counterfoil saved to your device!'
          : 'Active Payment QR Pass saved successfully to your device!',
        'success'
      )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#fffdf9] p-5 sm:p-7 shadow-2xl rounded-3xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#f5ede2] text-lg font-bold text-[#674f40] hover:bg-[#c1440e] hover:text-white transition cursor-pointer z-10"
          aria-label="Close"
          title="Close QR Pass"
        >
          ×
        </button>

        {/* Modal Header */}
        <div className="text-left pr-8 border-b border-[#eadfd1] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isDeactiveView
                  ? 'bg-[#f3f4f6] text-[#6b7280] border border-[#d1d5db]'
                  : 'bg-[#fdf2e9] text-[#c1440e] border border-[#f5cfb5]'
              }`}
            >
              {isDeactiveView ? 'Received / Deactivated Pass' : 'Active Sanctum Entry Pass'}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-[#34251e]">
            {t('qrModalTitle') || 'Payment QR Pass'}
          </h2>
          <p className="text-xs text-[#8b7a6d]">
            {isDeactiveView
              ? 'Concluded and received ritual bookings (Archana completed / Prasadam dispatched)'
              : 'Active scannable passes valid for temple entrance and live priest sankalpa'}
          </p>
        </div>

        {/* ── Active vs Received Tabs ── */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#f5ede2] p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-md'
                : 'text-[#674f40] hover:bg-white/60'
            }`}
          >
            <span>🟢</span>
            <span>{language === 'KN' ? 'ಸಕ್ರಿಯ ಪಾಸ್‌ಗಳು' : 'Active Passes'}</span>
            <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[10px] font-bold">
              {activeOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'received'
                ? 'bg-[#6b7280] text-white shadow-md'
                : 'text-[#674f40] hover:bg-white/60'
            }`}
          >
            <span>⚪</span>
            <span>{language === 'KN' ? 'ಸ್ವೀಕರಿಸಿದ / ಮುಕ್ತಾಯ' : 'Received / Deactive'}</span>
            <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[10px] font-bold">
              {receivedOrders.length}
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
                  {ord.id} — {translateTemple(ord.temple).name} ({ord.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── Dropdown if multiple orders in received tab ── */}
        {isDeactiveView && receivedOrders.length > 1 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f9fafb] border border-[#e5e7eb] p-2 text-xs">
            <span className="font-bold text-[#6b7280]">Select Concluded Seva:</span>
            <select
              value={receivedSelectIdx}
              onChange={(e) => setReceivedSelectIdx(Number(e.target.value))}
              className="rounded-lg border border-[#d1d5db] bg-white px-2 py-1 text-xs font-bold text-[#374151] shadow-xs cursor-pointer focus:outline-none"
            >
              {receivedOrders.map((ord, idx) => (
                <option key={ord.id} value={idx}>
                  {ord.id} — {translateTemple(ord.temple).name} ({ord.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── The Digital QR Code Card ── */}
        <div
          className={`mt-4 rounded-3xl p-5 text-center transition-all duration-300 relative overflow-hidden ${
            isDeactiveView
              ? 'border-2 border-[#e5e7eb] bg-[#f9fafb]'
              : 'border-2 border-[#e6dacb] bg-white shadow-md'
          }`}
        >
          {/* Status Badge */}
          <div className="mb-3 flex items-center justify-between">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                isDeactiveView
                  ? 'bg-[#f3f4f6] text-[#6b7280] border border-[#d1d5db]'
                  : 'bg-[#e9f5ed] text-[#28724d] border border-[#b2e5c8]'
              }`}
            >
              {isDeactiveView ? '⚪ DEACTIVATED' : '🟢 ACTIVE ENTRY PASS'}
            </span>
            <span className="font-mono text-xs font-bold text-[#8b7a6d]">
              ID: {displayedOrder ? displayedOrder.id : isDeactiveView ? 'TS-COMPLETED-SAMPLE' : 'TS-ACTIVE-SAMPLE'}
            </span>
          </div>

          {/* Scannable SVG QR Code:
              - Active: Theme colour (#c1440e)
              - Deactive: Disabled light gray (#9ca3af)
          */}
          <SacredQrCodeSvg
            code={displayedOrder ? displayedOrder.id : isDeactiveView ? 'TS-DEACTIVE-99' : 'TS-ACTIVE-99'}
            variant={isDeactiveView ? 'deactive' : 'active'}
          />

          <p className="mt-2.5 text-[11px] font-semibold text-[#8b7a6d]">
            {isDeactiveView
              ? '⚪ Ritual Concluded · Prasadam Received / Dispatched'
              : '⚡ Scan for Temple Sanctum Entry & Priest Sankalpa'}
          </p>

          {/* Pass Metadata Details */}
          <div
            className={`mt-4 rounded-2xl p-3.5 text-left text-xs space-y-1.5 ${
              isDeactiveView ? 'bg-[#f3f4f6] border border-[#e5e7eb]' : 'bg-[#faf6f0] border border-[#eee2d3]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[#8b7a6d]">Temple:</span>
              <span className="font-bold text-[#34251e]">
                {displayedOrder
                  ? translateTemple(displayedOrder.temple).name
                  : isDeactiveView
                  ? 'Kashi Vishwanath'
                  : 'Shree Meenakshi Temple'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b7a6d]">Date:</span>
              <span className="font-bold text-[#34251e]">
                {displayedOrder ? displayedOrder.date : 'Today'}
              </span>
            </div>

            {displayedOrder && displayedOrder.items.length > 0 && (
              <div className="flex items-start justify-between">
                <span className="text-[#8b7a6d]">Offerings:</span>
                <span className="font-bold text-right truncate max-w-[220px] text-[#34251e]">
                  {displayedOrder.items.map((i) => `${translateSeva(i.seva).name} × ${i.quantity}`).join(', ')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1.5 border-t border-[#e2d5c5]">
              <span className="font-semibold text-[#8b7a6d]">Total Consecration:</span>
              <span
                className={`font-serif text-sm font-bold ${
                  isDeactiveView ? 'text-[#6b7280]' : 'text-[#c1440e]'
                }`}
              >
                {displayedOrder ? formatPrice(displayedOrder.total) : '₹1,001'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 flex gap-2">
          {!displayedOrder && onNavigateToSevas && (
            <button
              onClick={() => {
                onClose()
                onNavigateToSevas()
              }}
              className="btn-primary flex-1 py-2.5 text-xs font-bold cursor-pointer"
            >
              {language === 'KN' ? 'ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ' : 'Book a Seva'}
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 rounded-xl border border-[#d8c8b8] bg-[#fdfbf7] py-2.5 text-xs font-bold text-[#674f40] transition hover:bg-[#f5ede2] cursor-pointer"
          >
            📥 {isDeactiveView ? 'Save Receipt' : t('qrSaveBtn') || 'Save Pass'}
          </button>

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
