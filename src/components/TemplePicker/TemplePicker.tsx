import type { Temple } from '../../types'
import { temples } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'

interface TemplePickerProps {
  onSelect: (temple: Temple) => void
  onClose?: () => void
}

const TemplePicker = ({ onSelect, onClose }: TemplePickerProps) => {
  const { t, translateTemple } = useLanguage()

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#34251e]/55 p-5 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl bg-[#fffcf6] p-7 shadow-2xl sm:p-9 animate-pop">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {t('templesSub')}
            </p>
            <h2 className="mt-2 font-serif text-4xl">{t('chooseTemplePrompt')}</h2>
            <p className="mt-2 text-sm text-[#8b7a6d]">
              {t('templesDesc')}
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="modal-close" aria-label="Close">
              ×
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {temples.map((temple) => {
            const localized = translateTemple(temple)
            return (
              <button
                key={temple.id}
                onClick={() => onSelect(temple)}
                className="overflow-hidden rounded-2xl border border-[#eadfd1] bg-white text-left transition hover:-translate-y-1 hover:border-[#c1440e] hover:shadow-lg cursor-pointer"
              >
                <img src={localized.image} alt={localized.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-serif text-xl font-bold">{localized.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#c1440e]">{localized.location}</p>
                  <span className="mt-4 block text-sm font-bold text-[#674f40]">
                    {t('viewAvailableSevas')}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TemplePicker
