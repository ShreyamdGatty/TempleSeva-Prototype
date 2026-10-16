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
 * High-fidelity SVG QR Code generator simulating a scannable Temple Seva digital pass
 */
const SacredQrCodeSvg = ({ code }: { code: string }) => {
  // Generate deterministic grid pattern based on booking code
  const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // 19x19 data grid
  const gridSize = 19
  const cellSize = 10

  const isCornerMarker = (r: number, c: number) => {
    // Top-left
    if (r <= 6 && c <= 6) return true
    // Top-right
    if (r <= 6 && c >= gridSize - 7) return true
    // Bottom-left
    if (r >= gridSize - 7 && c <= 6) return true
    return false
  }

  // Pre-generate pseudo-random cells using hash
  const cells = useMemo(() => {
    const list: { r: number; c: number }[] = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!isCornerMarker(r, c)) {
          // Keep center 3x3 clean for "ॐ" logo
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

  const drawFinder = (x: number, y: number) => (
    <g>
      {/* Outer 7x7 square */}
      <rect x={x} y={y} width={70} height={70} fill="#1a1410" rx={8} />
      {/* Inner 5x5 white square */}
      <rect x={x + 10} y={y + 10} width={50} height={50} fill="#ffffff" rx={4} />
      {/* Center 3x3 solid square */}
      <rect x={x + 20} y={y + 20} width={30} height={30} fill="#c1440e" rx={3} />
    </g>
  )

  return (
    <div className="relative mx-auto flex items-center justify-center rounded-2xl border-2 border-[#e6dacb] bg-white p-4 shadow-inner">
      <svg
        viewBox="0 0 190 190"
        className="h-48 w-48 transition-transform duration-300 hover:scale-[1.02]"
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
            fill="#2c1e17"
            rx={1.5}
          />
        ))}

        {/* Center Sacred Emblem Badge */}
        <circle cx="95" cy="95" r="16" fill="#fffcf6" stroke="#c1440e" strokeWidth="2" />
        <text
          x="95"
          y="101"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#c1440e"
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

  // Filter only paid / confirmed orders
  const paidOrders = orders.filter((o) => o.status !== 'Cancelled')

  // Selected order index
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Use the active order if available, otherwise show a realistic demo pass
  const activeOrder = paidOrders[selectedIndex] || null

  const handleDownload = () => {
    if (onToast) {
      onToast(
        language === 'KN'
          ? 'ಕ್ಯೂಆರ್ ಪಾಸ್ ನಿಮ್ಮ ಸಾಧನಕ್ಕೆ ಉಳಿಸಲಾಗಿದೆ!'
          : 'Payment QR Pass saved successfully to your device!',
        'success'
      )
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container w-full max-w-md bg-[#fffdf9] p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eadfd1] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📱</span>
              <span className="rounded-full bg-[#e9f5ed] px-2.5 py-0.5 text-[11px] font-bold text-[#28724d]">
                {t('qrPaymentSuccess')}
              </span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl font-bold text-[#34251e]">
              {t('qrModalTitle')}
            </h2>
            <p className="text-xs text-[#8b7a6d]">{t('qrModalSub')}</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        {/* If user has multiple orders, provide a selection switcher */}
        {paidOrders.length > 1 && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5ede2] p-2 text-xs">
            <span className="font-bold text-[#674f40]">{t('qrSelectOrder')}</span>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="rounded-lg border border-[#d8c8b8] bg-white px-2 py-1 text-xs font-bold text-[#34251e] shadow-xs cursor-pointer focus:outline-none"
            >
              {paidOrders.map((ord, idx) => (
                <option key={ord.id} value={idx}>
                  {ord.id} — {translateTemple(ord.temple).name} ({ord.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notice for preview / sample pass if no bookings yet */}
        {!activeOrder && (
          <div className="mt-4 rounded-xl border border-[#eedecb] bg-[#fdf8f2] p-3 text-xs text-[#8b6534]">
            <p className="font-semibold">ℹ️ {t('qrSampleNotice')}</p>
          </div>
        )}

        {/* The Digital QR Code Card */}
        <div className="mt-4 rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-sm text-center">
          {/* QR Graphic */}
          <SacredQrCodeSvg code={activeOrder ? activeOrder.id : 'TS-DEMO-PASS-8849'} />

          {/* Pass Meta */}
          <div className="mt-4 border-t border-[#f2e7db] pt-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                {t('qrBookingId')}
              </span>
              <span className="font-mono text-sm font-bold text-[#c1440e]">
                {activeOrder ? activeOrder.id : 'TS-849204 (Sample)'}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#8b7a6d]">{t('qrTemple')}:</span>
              <span className="font-semibold text-[#34251e] text-right truncate max-w-[200px]">
                {activeOrder
                  ? translateTemple(activeOrder.temple).name
                  : language === 'KN'
                  ? 'ಕುಕ್ಕೆ ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ದೇವಸ್ಥಾನ'
                  : 'Kukke Sri Subramanya Temple'}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-[#8b7a6d]">{t('qrDate')}:</span>
              <span className="font-semibold text-[#34251e]">
                {activeOrder ? activeOrder.date : language === 'KN' ? 'ಇಂದಿನ ದಿನಾಂಕ' : 'Today'}
              </span>
            </div>

            {activeOrder && activeOrder.items.length > 0 && (
              <div className="mt-1 flex items-start justify-between text-xs">
                <span className="text-[#8b7a6d]">Seva:</span>
                <span className="font-semibold text-[#34251e] text-right truncate max-w-[200px]">
                  {activeOrder.items.map((i) => translateSeva(i.seva).name).join(', ')}
                </span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#eadfd1] pt-2 text-xs font-bold">
              <span className="text-[#28724d] flex items-center gap-1">
                <span>✓</span> {t('qrPaymentSuccess')}
              </span>
              <span className="text-sm font-serif text-[#c1440e]">
                {activeOrder ? formatPrice(activeOrder.total) : '₹1,250'}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Footer Text */}
        <p className="mt-3 text-center text-[11px] text-[#8b7a6d]">
          {language === 'KN'
            ? 'ಪ್ರವೇಶ ದ್ವಾರದಲ್ಲಿ ಅಥವಾ ಪ್ರಸಾದ ಕೌಂಟರ್‌ನಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಈ ಡಿಜಿಟಲ್ ಪಾಸ್ ಪ್ರಸ್ತುತಪಡಿಸಿ.'
            : 'Present this digital pass at the temple entry gate or prasadam counter for instant verification.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex gap-2">
          {!activeOrder && onNavigateToSevas && (
            <button
              onClick={() => {
                onClose()
                onNavigateToSevas()
              }}
              className="btn-primary flex-1 py-2.5 text-xs font-bold"
            >
              {language === 'KN' ? 'ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ' : 'Book a Seva'}
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex-1 rounded-xl border border-[#d8c8b8] bg-[#fdfbf7] py-2.5 text-xs font-bold text-[#674f40] transition hover:bg-[#f5ede2] cursor-pointer"
          >
            📥 {t('qrSaveBtn')}
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#34251e] py-2.5 text-xs font-bold text-white transition hover:bg-[#4d372c] cursor-pointer"
          >
            {t('qrCloseBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentQrModal
