import { useState } from 'react'
import type { Order } from '../../types'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface OrdersModalProps {
  orders: Order[]
  onClose: () => void
  onTrack: (order: Order) => void
  onCancel: (orderId: string) => void
  onReorder: (order: Order) => void
}

const OrdersModal = ({ orders, onClose, onCancel, onReorder }: OrdersModalProps) => {
  const { t, translateTemple, translateSeva } = useLanguage()
  const [filter, setFilter] = useState<'all' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'>('all')
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const statusColor: Record<string, string> = {
    Confirmed: 'bg-[#e8f0fe] text-[#2b5a9e]',
    'In Progress': 'bg-[#fef3e2] text-[#9a6700]',
    Completed: 'bg-[#e9f5ed] text-[#28724d]',
    Cancelled: 'bg-[#fde8e8] text-[#d94444]',
  }

  /* ── Tracking View ── */
  if (trackingOrder) {
    const localizedTemple = translateTemple(trackingOrder.temple)
    return (
      <div className="modal-overlay" onClick={onClose}>
        <aside className="fixed right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-[#fffcf6] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setTrackingOrder(null)} className="text-sm font-bold text-[#c1440e] cursor-pointer hover:underline">
            {t('backToOrders')}
          </button>

          <h2 className="mt-4 font-serif text-3xl font-bold">{t('orderIdLabel')} {trackingOrder.id}</h2>
          <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusColor[trackingOrder.status] ?? ''}`}>
            {trackingOrder.status}
          </span>

          {/* Timeline */}
          <div className="mt-8">
            {trackingOrder.timeline.map((event, i) => (
              <div key={event.label} className="flex gap-4">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${event.completed ? 'bg-[#28724d] text-white' : 'border-2 border-[#d8c8b8] text-[#d8c8b8]'}`}>
                    {event.completed ? '✓' : i + 1}
                  </div>
                  {i < trackingOrder.timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[40px] ${event.completed ? 'bg-[#28724d]' : 'bg-[#e3d7ca]'}`} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <p className={`text-sm font-bold ${event.completed ? 'text-[#34251e]' : 'text-[#a39384]'}`}>
                    {event.label}
                  </p>
                  <p className="text-xs text-[#8b7a6d]">{event.description}</p>
                  {event.time && <p className="mt-1 text-[10px] font-mono text-[#a39384]">{event.time}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="rounded-xl bg-[#f9f4ee] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('orderIdLabel')}</p>
            <p className="mt-1 font-serif text-xl font-bold">{localizedTemple.name}</p>
            <p className="text-sm text-[#8b7a6d]">{trackingOrder.date}</p>
            <div className="mt-3 space-y-1">
              {trackingOrder.items.map((item) => {
                const localizedSeva = translateSeva(item.seva)
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{localizedSeva.name} × {item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.seva.price * item.quantity)}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 border-t border-[#e3d7ca] pt-2 flex justify-between font-bold">
              <span>{t('totalLabel')}</span><span className="text-[#c1440e]">{formatPrice(trackingOrder.total)}</span>
            </div>
          </div>

          {trackingOrder.status === 'Confirmed' && (
            <button onClick={() => { onCancel(trackingOrder.id); setTrackingOrder(null) }} className="mt-4 w-full rounded-xl border border-[#d94444] py-3 text-sm font-bold text-[#d94444] cursor-pointer hover:bg-[#fde8e8]">
              {t('cancelOrderBtn')}
            </button>
          )}
        </aside>
      </div>
    )
  }

  /* ── Orders List ── */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside className="fixed right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-[#fffcf6] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('ordersSub')}</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">{t('ordersTitle')}</h2>
            <p className="mt-1 text-sm text-[#8b7a6d]">{orders.length} {t('itemsLabel').toLowerCase()}</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">×</button>
        </div>

        {/* Filters */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {(['all', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition cursor-pointer ${filter === f ? 'bg-[#34251e] text-white' : 'bg-[#f5ede2] text-[#674f40] hover:bg-[#ebdcc9]'}`}
            >
              {f === 'all'
                ? t('filterAll')
                : f === 'Confirmed'
                ? t('filterConfirmed')
                : f === 'In Progress'
                ? (t('filterInProgress') || 'In Progress')
                : f === 'Completed'
                ? t('filterCompleted')
                : t('filterCancelled')}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <span className="text-4xl">📋</span>
            <p className="mt-3 text-sm text-[#8b7a6d]">
              {t('noOrdersTitle')}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filtered.map((order) => {
              const localizedTemple = translateTemple(order.temple)
              return (
                <article key={order.id} className="rounded-2xl border border-[#eadfd1] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-lg font-bold">{localizedTemple.name}</p>
                      <p className="text-xs text-[#8b7a6d]">{order.date} · {order.id}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusColor[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#674f40]">
                    {order.items.map((item) => `${translateSeva(item.seva).name} × ${item.quantity}`).join(', ')}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#eadfd1] pt-3">
                    <span className="font-bold text-[#c1440e]">{formatPrice(order.total)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setTrackingOrder(order)} className="rounded-lg bg-[#f5ede2] px-3 py-1.5 text-xs font-bold cursor-pointer hover:bg-[#ebdcc9]">
                        {t('trackBtn')}
                      </button>
                      {order.status === 'Cancelled' ? (
                        <button onClick={() => onReorder(order)} className="rounded-lg bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3 py-1.5 text-xs font-bold text-white cursor-pointer hover:brightness-110">
                          {t('retryBtn') || 'Retry Booking'}
                        </button>
                      ) : (
                        <button onClick={() => onReorder(order)} className="rounded-lg bg-[#c1440e] px-3 py-1.5 text-xs font-bold text-white cursor-pointer hover:bg-[#a5370a]">
                          {t('reorderBtn')}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </aside>
    </div>
  )
}

export default OrdersModal
