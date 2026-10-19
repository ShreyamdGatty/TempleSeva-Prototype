import type { Seva } from '../../types'
import { sevas } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface WishlistModalProps {
  wishlistIds: string[]
  selectedTemple?: import('../../types').Temple
  onClose: () => void
  onRemove: (sevaId: string) => void
  onAddToCart: (seva: Seva) => void
  onViewDetails: (seva: Seva) => void
}

const WishlistModal = ({
  wishlistIds,
  selectedTemple,
  onClose,
  onRemove,
  onAddToCart,
  onViewDetails,
}: WishlistModalProps) => {
  const { t, translateSeva, translateTemple } = useLanguage()
  const activeTempleName = selectedTemple ? translateTemple(selectedTemple).name : ''
  const wishlistedSevas = sevas.filter(
    (s) => wishlistIds.includes(s.id) && (!selectedTemple || s.templeId === selectedTemple.id)
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-[#fffcf6] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#eadfd1] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('navFavorites')}</p>
              {activeTempleName && (
                <span className="rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-2 py-0.2 text-[10px] font-bold text-[#c1440e]">
                  🛕 {activeTempleName}
                </span>
              )}
            </div>
            <h2 className="mt-1 font-serif text-3xl font-bold">{t('wishlistTitle')}</h2>
            <p className="text-xs text-[#8b7a6d]">
              {wishlistedSevas.length} {t('wishlistCount')} {activeTempleName ? `for ${activeTempleName}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="modal-close cursor-pointer" aria-label="Close">
            ×
          </button>
        </div>

        {wishlistedSevas.length === 0 ? (
          <div className="mt-20 text-center">
            <span className="text-5xl">🤍</span>
            <h3 className="mt-4 font-serif text-2xl font-bold">{t('wishlistEmptyTitle')}</h3>
            <p className="mt-2 text-sm text-[#8b7a6d]">
              {activeTempleName
                ? `No saved offerings for ${activeTempleName}. Tap the heart icon on any seva to save it here.`
                : t('wishlistEmptySub')}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {wishlistedSevas.map((rawSeva) => {
              const seva = translateSeva(rawSeva)
              return (
                <div
                  key={seva.id}
                  className="group relative flex gap-4 rounded-2xl border border-[#eadfd1] bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={seva.image}
                    alt={seva.name}
                    className="h-24 w-24 rounded-xl object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/temple-hero.webp'
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => onViewDetails(rawSeva)}
                          className="cursor-pointer font-serif text-lg font-bold hover:text-[#c1440e]"
                        >
                          {seva.name}
                        </h4>
                        <button
                          onClick={() => onRemove(seva.id)}
                          className="text-sm text-[#b54733] hover:opacity-75 cursor-pointer"
                          title="Remove from wishlist"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-[#8b7a6d] line-clamp-1">{seva.description}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#c1440e]">{formatPrice(seva.price)}</span>
                        {seva.originalPrice && (
                          <span className="ml-2 text-xs text-[#8b7a6d] line-through">
                            {formatPrice(seva.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onAddToCart(rawSeva)}
                        className="rounded-lg bg-[#c1440e] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#a5370a] cursor-pointer"
                      >
                        {t('addBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </aside>
    </div>
  )
}

export default WishlistModal
