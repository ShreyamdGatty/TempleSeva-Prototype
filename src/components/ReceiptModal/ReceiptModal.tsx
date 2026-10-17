import type { Order } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import { SacredQrCodeSvg } from '../PaymentQrModal/PaymentQrModal'

interface ReceiptModalProps {
  order: Order
  onClose: () => void
  onTrack: () => void
}

const ReceiptModal = ({ order, onClose, onTrack }: ReceiptModalProps) => {
  const { t, translateTemple, translateSeva } = useLanguage()
  const localizedTemple = translateTemple(order.temple)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container relative w-full max-w-md max-h-[92vh] overflow-y-auto text-center mx-auto my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Top Right Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#f5ede2] text-base font-bold text-[#674f40] hover:bg-[#c1440e] hover:text-white transition cursor-pointer z-10"
          aria-label="Close"
          title="Close Receipt"
        >
          ×
        </button>

        {/* Success Animation */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f5ed]">
          <span className="receipt-check text-4xl text-[#28724d]">✓</span>
        </div>

        <h2 className="mt-5 font-serif text-3xl font-bold">{t('bookingConfirmedTitle')}</h2>
        <p className="mt-2 text-sm text-[#8b7a6d]">
          {t('bookingConfirmedSub')}
        </p>

        {/* Order Summary Card */}
        <div className="mt-6 rounded-2xl bg-[#f9f4ee] p-5 text-left">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('orderIdLabel')}</p>
            <span className="rounded-full bg-[#e9f5ed] px-3 py-1 text-xs font-bold text-[#28724d]">{order.status}</span>
          </div>
          <p className="mt-1 font-mono text-lg font-bold">{order.id}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[#8b7a6d]">{t('templeLabel')}</p>
              <p className="font-semibold">{localizedTemple.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#8b7a6d]">{t('dateLabel')}</p>
              <p className="font-semibold">{order.date}</p>
            </div>
            <div>
              <p className="text-xs text-[#8b7a6d]">{t('paymentLabel')}</p>
              <p className="font-semibold capitalize">{order.paymentMethod || 'Online'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8b7a6d]">{t('itemsLabel')}</p>
              <p className="font-semibold">{order.items.length} {t('itemsLabel').toLowerCase()}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#e3d7ca] pt-3">
            {order.items.map((item) => {
              const localizedSeva = translateSeva(item.seva)
              return (
                <div key={item.id} className="flex justify-between py-1 text-sm">
                  <span>{localizedSeva.name} × {item.quantity}{item.devotee ? ` (${item.devotee.name})` : ''}</span>
                  <span className="font-semibold">{formatPrice(item.seva.price * item.quantity)}</span>
                </div>
              )
            })}
            {order.discount > 0 && (
              <div className="flex justify-between py-1 text-sm text-[#28724d]">
                <span>{t('discountLabel')}</span><span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-[#e3d7ca] pt-2 font-bold text-lg">
              <span>{t('totalPaidLabel')}</span>
              <span className="text-[#c1440e]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Scannable Sacred QR Code Pass */}
        <div className="mt-5 text-center">
          <SacredQrCodeSvg code={order.id} />
          <p className="mt-2 text-xs text-[#8b7a6d] font-semibold">{t('showAtEntrance')}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          <button onClick={onTrack} className="flex-1 rounded-xl border border-[#d8c8b8] py-3 text-sm font-bold cursor-pointer hover:bg-[#f5ede2]">
            {t('trackOrderBtn')}
          </button>
          <button onClick={onClose} className="btn-primary flex-1 cursor-pointer">
            {t('continueBookingBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceiptModal
