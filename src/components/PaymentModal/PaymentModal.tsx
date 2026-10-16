import { useState } from 'react'

interface PaymentModalProps {
  total: number
  onPay: () => void
  onClose: () => void
}

const PaymentModal = ({ total, onPay, onClose }: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false)

  const pay = () => {
    setProcessing(true)
    window.setTimeout(onPay, 650)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#34251e]/55 p-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#fffcf6] p-8">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">
              Demo payment
            </p>
            <h2 className="mt-2 font-serif text-3xl">Complete offering</h2>
          </div>
          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-[#f5ede2] p-4 text-sm">
          <span className="text-[#8b7a6d]">Total amount</span>
          <strong className="float-right text-xl">₹{total}</strong>
        </div>

        <input
          className="mt-5 w-full rounded-xl border border-[#e3d7ca] px-4 py-3 text-sm"
          placeholder="Card number (demo)"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input
            className="rounded-xl border border-[#e3d7ca] px-4 py-3 text-sm"
            placeholder="MM / YY"
          />
          <input
            className="rounded-xl border border-[#e3d7ca] px-4 py-3 text-sm"
            placeholder="CVV"
          />
        </div>

        <button
          onClick={pay}
          disabled={processing}
          className="mt-5 w-full rounded-xl bg-[#c1440e] py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {processing ? 'Processing…' : `Pay ₹${total}`}
        </button>

        <p className="mt-4 text-center text-xs text-[#a39384]">
          Demo only. No real payment is processed.
        </p>
      </div>
    </div>
  )
}

export default PaymentModal
