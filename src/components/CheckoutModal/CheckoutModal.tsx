import { useState } from 'react'
import type { CartItem, Address, Coupon } from '../../types'
import { paymentMethods } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

type Step = 'review' | 'address' | 'payment' | 'processing'

interface CheckoutModalProps {
  cart: CartItem[]
  subtotal: number
  discount: number
  total: number
  appliedCoupon: Coupon | null
  couponError: string
  onApplyCoupon: (code: string) => boolean
  onRemoveCoupon: () => void
  addresses: Address[]
  defaultAddress: Address | null
  onAddAddress: (address: Omit<Address, 'id'>) => void
  onPay: (paymentMethod: string, address?: Address) => void
  onClose: () => void
}

const CheckoutModal = ({
  cart, subtotal, discount, total,
  appliedCoupon, couponError, onApplyCoupon, onRemoveCoupon,
  addresses, defaultAddress, onAddAddress,
  onPay, onClose,
}: CheckoutModalProps) => {
  const { language, t, translateSeva } = useLanguage()
  const [step, setStep] = useState<Step>('review')
  const [couponCode, setCouponCode] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(defaultAddress)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [skipAddress, setSkipAddress] = useState(false)

  // New address form state
  const [addrForm, setAddrForm] = useState({
    label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })

  const steps = [t('stepReview'), t('stepAddress'), t('stepPayment')]
  const stepIndex = step === 'review' ? 0 : step === 'address' ? 1 : 2

  const handleApplyCoupon = () => {
    if (onApplyCoupon(couponCode)) setCouponCode('')
  }

  const handleSaveAddress = () => {
    if (!addrForm.name || !addrForm.phone || !addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) return
    const addr: Omit<Address, 'id'> = { ...addrForm, isDefault: addresses.length === 0 }
    onAddAddress(addr)
    setShowAddressForm(false)
  }

  const handlePay = () => {
    setStep('processing')
    setTimeout(() => {
      onPay(selectedPayment, skipAddress ? undefined : selectedAddress || undefined)
    }, 1800)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('checkoutTitle')}</p>
            <h2 className="mt-2 font-serif text-3xl">
              {step === 'processing'
                ? t('processingTitle')
                : `${language === 'KN' ? 'ಹಂತ' : 'Step'} ${stepIndex + 1} / 3: ${steps[stepIndex]}`}
            </h2>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="modal-close" aria-label="Close">
              ×
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {step !== 'processing' && (
          <div className="mt-5 flex gap-1">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all ${i <= stepIndex ? 'bg-[#c1440e]' : 'bg-[#e3d7ca]'}`} />
                <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-wider ${i <= stepIndex ? 'text-[#c1440e]' : 'text-[#a39384]'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Cart Review ── */}
        {step === 'review' && (
          <div className="mt-5">
            <div className="space-y-3">
              {cart.map((item) => {
                const localizedItemSeva = translateSeva(item.seva)
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl bg-[#f9f4ee] p-3">
                    <img src={localizedItemSeva.image} alt={localizedItemSeva.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">{localizedItemSeva.name}</p>
                      {item.devotee && <p className="text-xs text-[#8b7a6d]">{t('forDevotee')}: {item.devotee.name}</p>}
                      <p className="text-xs text-[#8b7a6d]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">{formatPrice(localizedItemSeva.price * item.quantity)}</p>
                  </div>
                )
              })}
            </div>

            {/* Coupon */}
            <div className="mt-5 rounded-xl border border-[#eadfd1] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">{t('promoCodeLabel')}</p>
              {appliedCoupon ? (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-[#e9f5ed] px-3 py-2">
                  <div>
                    <span className="text-sm font-bold text-[#28724d]">{appliedCoupon.code}</span>
                    <span className="ml-2 text-xs text-[#28724d]">— {appliedCoupon.description}</span>
                  </div>
                  <button onClick={onRemoveCoupon} className="text-sm font-bold text-[#d94444] cursor-pointer">
                    {t('removeCouponBtn')}
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder={t('enterCodePlaceholder')}
                    className="input-field flex-1"
                  />
                  <button onClick={handleApplyCoupon} className="rounded-xl bg-[#34251e] px-5 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-black">
                    {t('applyCouponBtn')}
                  </button>
                </div>
              )}
              {couponError && <p className="mt-2 text-xs text-[#d94444]">{couponError}</p>}
            </div>

            {/* Summary */}
            <div className="mt-5 space-y-2 rounded-xl bg-[#f5ede2] p-4">
              <div className="flex justify-between text-sm"><span className="text-[#8b7a6d]">{t('subtotalLabel')}</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-sm"><span className="text-[#28724d]">{t('discountLabel')}</span><span className="text-[#28724d]">−{formatPrice(discount)}</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-[#8b7a6d]">{t('platformFeeLabel')}</span><span className="text-[#28724d]">{t('freeLabel')}</span></div>
              <div className="border-t border-[#e3d7ca] pt-2 flex justify-between font-bold text-lg">
                <span>{t('totalLabel')}</span><span className="text-[#c1440e]">{formatPrice(total)}</span>
              </div>
            </div>

            <button onClick={() => setStep('address')} className="btn-primary mt-5 w-full cursor-pointer">
              {t('continueToAddress')}
            </button>
          </div>
        )}

        {/* ── STEP 2: Address ── */}
        {step === 'address' && (
          <div className="mt-5">
            <p className="text-sm text-[#8b7a6d]">{t('addressStepDesc')}</p>

            <label className="mt-4 flex items-center gap-2 rounded-xl bg-[#f5ede2] p-3 cursor-pointer">
              <input type="checkbox" checked={skipAddress} onChange={(e) => setSkipAddress(e.target.checked)} className="accent-[#c1440e]" />
              <span className="text-sm font-semibold">{t('noPrasadamCheckbox')}</span>
            </label>

            {!skipAddress && (
              <>
                {/* Saved addresses */}
                {addresses.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {addresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full rounded-xl border-2 p-3 text-left transition cursor-pointer ${selectedAddress?.id === addr.id ? 'border-[#c1440e] bg-[#fef8f3]' : 'border-[#eadfd1]'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-[10px] font-bold uppercase">{addr.label}</span>
                          {addr.isDefault && <span className="text-[10px] font-bold text-[#c1440e]">{t('setDefaultBtn')}</span>}
                        </div>
                        <p className="mt-1 text-sm font-semibold">{addr.name}</p>
                        <p className="text-xs text-[#8b7a6d]">{addr.line1}, {addr.city} - {addr.pincode}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Add address */}
                {showAddressForm ? (
                  <div className="mt-4 space-y-2 rounded-xl border border-[#eadfd1] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('newAddressTitle')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={addrForm.name} onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })} className="input-field" placeholder={t('fullNamePlaceholder')} />
                      <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="input-field" placeholder={t('phonePlaceholder')} />
                    </div>
                    <input value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} className="input-field" placeholder={t('line1Placeholder')} />
                    <input value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} className="input-field" placeholder={t('line2Placeholder')} />
                    <div className="grid grid-cols-3 gap-2">
                      <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="input-field" placeholder={t('cityPlaceholder')} />
                      <input value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="input-field" placeholder={t('statePlaceholder')} />
                      <input value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="input-field" placeholder={t('pinPlaceholder')} />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowAddressForm(false)} className="flex-1 rounded-xl border border-[#d8c8b8] py-2.5 text-sm font-bold cursor-pointer">
                        {t('cancelBtn')}
                      </button>
                      <button onClick={handleSaveAddress} className="flex-1 rounded-xl bg-[#34251e] py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-black">
                        {t('saveAddressBtn')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddressForm(true)} className="mt-3 w-full rounded-xl border border-dashed border-[#c1440e] py-3 text-sm font-bold text-[#c1440e] cursor-pointer hover:bg-[#fff9f4]">
                    {t('addNewAddressBtn')}
                  </button>
                )}
              </>
            )}

            <div className="mt-5 flex gap-2">
              <button onClick={() => setStep('review')} className="flex-1 rounded-xl border border-[#d8c8b8] py-3 text-sm font-bold cursor-pointer hover:bg-[#f5ede2]">
                {t('backBtn')}
              </button>
              <button
                onClick={() => setStep('payment')}
                disabled={!skipAddress && !selectedAddress && addresses.length > 0}
                className="btn-primary flex-1 disabled:opacity-50 cursor-pointer"
              >
                {t('continueToPayment')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Payment ── */}
        {step === 'payment' && (
          <div className="mt-5">
            <p className="text-sm text-[#8b7a6d]">{t('choosePaymentDesc')}</p>

            <div className="mt-4 space-y-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition cursor-pointer ${selectedPayment === pm.id ? 'border-[#c1440e] bg-[#fef8f3]' : 'border-[#eadfd1]'}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f5ede2] text-lg">{pm.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{pm.label}</p>
                    <p className="text-xs text-[#8b7a6d]">{pm.description}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 ${selectedPayment === pm.id ? 'border-[#c1440e] bg-[#c1440e]' : 'border-[#d8c8b8]'}`}>
                    {selectedPayment === pm.id && <div className="m-0.5 h-3 w-3 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-5 rounded-xl bg-[#f5ede2] p-4">
              <div className="flex justify-between text-sm"><span className="text-[#8b7a6d]">{t('itemsLabel')} ({cart.length})</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-[#28724d]"><span>{t('discountLabel')}</span><span>−{formatPrice(discount)}</span></div>}
              <div className="mt-2 border-t border-[#e3d7ca] pt-2 flex justify-between font-bold text-lg">
                <span>{t('payBtn')}</span><span className="text-[#c1440e]">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => setStep('address')} className="flex-1 rounded-xl border border-[#d8c8b8] py-3 text-sm font-bold cursor-pointer hover:bg-[#f5ede2]">
                {t('backBtn')}
              </button>
              <button onClick={handlePay} className="btn-primary flex-1 cursor-pointer">
                {t('payBtn')} {formatPrice(total)} →
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-[#a39384]">{t('demoNotice')}</p>
          </div>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <div className="mt-10 flex flex-col items-center py-8">
            <div className="processing-spinner" />
            <p className="mt-6 font-serif text-2xl font-bold">{t('processingTitle')}</p>
            <p className="mt-2 text-sm text-[#8b7a6d]">{t('processingSub')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
