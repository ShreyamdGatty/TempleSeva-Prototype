import { useState } from 'react'
import type { Seva } from '../../types'
import { reviews as allReviews, sevas } from '../../data'
import { formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface SevaDetailModalProps {
  seva: Seva
  isWished: boolean
  onToggleWish: () => void
  onAdd: () => void
  onClose: () => void
}

const StarRating = ({ rating }: { rating: number }) => (
  <span className="text-[#d4a64a]">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= Math.round(rating) ? '' : 'opacity-25'}>★</span>
    ))}
  </span>
)

const SevaDetailModal = ({ seva: rawSeva, isWished, onToggleWish, onAdd, onClose }: SevaDetailModalProps) => {
  const { language, t, translateSeva, translateCategory } = useLanguage()
  const [tab, setTab] = useState<'details' | 'reviews'>('details')
  const seva = translateSeva(rawSeva)

  const sevaReviews = allReviews.filter((r) => r.sevaId === seva.id)
  const relatedSevas = sevas.filter((s) => s.category === rawSeva.category && s.id !== seva.id).slice(0, 3)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative -mx-8 -mt-8 mb-6">
          <img
            src={seva.image}
            alt={seva.name}
            className="h-56 w-full rounded-t-3xl object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/temple-hero.webp'
            }}
          />
          <div className="absolute inset-0 rounded-t-3xl bg-gradient-to-t from-black/50 to-transparent" />
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow backdrop-blur cursor-pointer" aria-label="Close">×</button>
          <button onClick={onToggleWish} className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow backdrop-blur cursor-pointer" title="Favorite">
            {isWished ? '❤️' : '🤍'}
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {seva.popular && (
              <span className="rounded-full bg-[#c1440e] px-3 py-1 text-xs font-bold text-white shadow">🔥 {t('popularBadge')}</span>
            )}
            {seva.originalPrice && (
              <span className="rounded-full bg-[#28724d] px-3 py-1 text-xs font-bold text-white shadow">
                {Math.round(((seva.originalPrice - seva.price) / seva.originalPrice) * 100)}% {t('offBadge')}
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#34251e] shadow backdrop-blur">
              ⏱ {seva.duration}
            </span>
          </div>
        </div>

        {/* Title Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-[#f5ede2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c1440e]">
              {translateCategory(seva.category)}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold">{seva.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <StarRating rating={seva.rating} />
              <span className="font-bold text-[#34251e]">{seva.rating}</span>
              <span className="text-[#8b7a6d]">({seva.reviewCount} {language === 'KN' ? 'ವಿಮರ್ಶೆಗಳು' : 'reviews'})</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl font-bold text-[#c1440e]">{formatPrice(seva.price)}</p>
            {seva.originalPrice && (
              <p className="text-sm text-[#8b7a6d] line-through">{formatPrice(seva.originalPrice)}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex border-b border-[#eadfd1]">
          <button
            onClick={() => setTab('details')}
            className={`pb-3 pr-6 text-sm font-bold transition cursor-pointer ${tab === 'details' ? 'border-b-2 border-[#c1440e] text-[#c1440e]' : 'text-[#8b7a6d]'}`}
          >
            {language === 'KN' ? 'ವಿವರಗಳು & ಮಹತ್ವ' : 'Details & Benefits'}
          </button>
          <button
            onClick={() => setTab('reviews')}
            className={`pb-3 pr-6 text-sm font-bold transition cursor-pointer ${tab === 'reviews' ? 'border-b-2 border-[#c1440e] text-[#c1440e]' : 'text-[#8b7a6d]'}`}
          >
            {language === 'KN' ? 'ಭಕ್ತರ ಅನುಭವ' : 'Reviews'} ({sevaReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'details' ? (
          <div className="mt-5">
            <p className="leading-7 text-[#674f40]">{seva.longDescription || seva.description}</p>

            {seva.benefits && (
              <div className="mt-5">
                <h3 className="font-serif text-lg font-bold">{language === 'KN' ? 'ಸೇವೆಯ ಫಲಶ್ರುತಿ' : 'Benefits'}</h3>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {seva.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 rounded-lg bg-[#f5ede2] px-3 py-2.5 text-sm font-semibold text-[#674f40]">
                      <span className="text-[#28724d]">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {seva.requiresDevotee ? (
              <div className="mt-5 rounded-xl border border-[#c1440e]/30 bg-[#fef6f0] p-4 text-sm text-[#c1440e]">
                <strong>🕉️ {language === 'KN' ? 'ಸಂಕಲ್ಪಕ್ಕೆ ಭಕ್ತರ ವಿವರ ಅಗತ್ಯ' : 'Devotee Assignment Required for Sankalpa'}</strong>
                <p className="mt-1 text-xs opacity-90 text-[#674f40]">
                  {language === 'KN'
                    ? 'ಈ ಸೇವೆಗಾಗಿ ಪುರೋಹಿತರು ನಿಮ್ಮ ಹೆಸರು, ಗೋತ್ರ ಮತ್ತು ನಕ್ಷತ್ರದ ಸಂಕಲ್ಪವನ್ನು ಮಾಡುತ್ತಾರೆ.'
                    : 'Priests will chant your Name, Gotram, and Nakshatra during the personalized Vedic sankalpa.'}
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-50/70 p-4 text-sm text-emerald-800">
                <strong>✓ {language === 'KN' ? 'ಭಕ್ತರ ವಿವರಗಳ ಅಗತ್ಯವಿಲ್ಲ (ಮುಕ್ತ ಸೇವೆ)' : 'No Devotee Assignment Needed'}</strong>
                <p className="mt-1 text-xs opacity-90 text-emerald-900">
                  {language === 'KN'
                    ? 'ಇದು ಸಾರ್ವತ್ರಿಕ ಸಮರ್ಪಣೆ / ದಾನ ಸೇವೆಯಾಗಿದೆ. ಯಾವುದೇ ವೈಯಕ್ತಿಕ ಗೋತ್ರ ಅಥವಾ ನಕ್ಷತ್ರದ ಅಗತ್ಯವಿಲ್ಲ.'
                    : 'This is a universal temple offering / prasadam daan. No individual gotram, nakshatra, or family member allocation is needed.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {sevaReviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#8b7a6d]">
                {language === 'KN' ? 'ಈ ಸೇವೆಗೆ ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ.' : 'No reviews yet for this Seva.'}
              </p>
            ) : (
              sevaReviews.map((review) => (
                <div key={review.id} className="rounded-xl bg-[#f9f4ee] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#c1440e] text-xs font-bold text-white">
                        {review.userName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{review.userName}</p>
                        <p className="text-xs text-[#8b7a6d]">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#674f40]">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Sevas */}
        {relatedSevas.length > 0 && (
          <div className="mt-6 border-t border-[#eadfd1] pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">
              {language === 'KN' ? 'ಭಕ್ತರು ಇದನ್ನೂ ಕಾಯ್ದಿರಿಸುತ್ತಾರೆ' : 'Devotees also book'}
            </h3>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {relatedSevas.map((s) => {
                const locS = translateSeva(s)
                return (
                  <div key={s.id} className="min-w-[140px] rounded-xl border border-[#eadfd1] bg-white p-3">
                    <img src={locS.image} alt={locS.name} className="h-16 w-full rounded-lg object-cover" />
                    <p className="mt-2 text-sm font-bold">{locS.name}</p>
                    <p className="text-xs font-semibold text-[#c1440e]">{formatPrice(locS.price)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <button onClick={onAdd} className="btn-primary mt-6 w-full cursor-pointer">
          {t('addBtn')} — {formatPrice(seva.price)}
        </button>
      </div>
    </div>
  )
}

export default SevaDetailModal
