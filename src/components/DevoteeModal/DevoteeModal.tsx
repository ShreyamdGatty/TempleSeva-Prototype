import { useState } from 'react'
import type { Seva, Devotee } from '../../types'
import { nakshatras, rashis } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'

interface DevoteeModalProps {
  seva: Seva
  devotee: Devotee
  setDevotee: (value: Devotee) => void
  onAdd: () => void
  onClose: () => void
}

const DevoteeModal = ({ seva, devotee, setDevotee, onAdd, onClose }: DevoteeModalProps) => {
  const { t, translateSeva } = useLanguage()
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const localizedSeva = translateSeva(seva)

  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!devotee.name.trim()) e.name = true
    if (!devotee.nakshatra) e.nakshatra = true
    if (!devotee.rashi) e.rashi = true
    setErrors(e)
    if (Object.keys(e).length > 0) return
    onAdd()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">
              {t('devoteeModalSub')}
            </p>
            <h2 className="mt-2 font-serif text-3xl">
              {t('devoteeModalTitle')} {localizedSeva.name}
            </h2>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        <p className="mt-3 text-sm text-[#8b7a6d]">
          {t('devoteeModalDesc')}
        </p>

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
              {t('devoteeNameLabel')}
            </label>
            <input
              value={devotee.name}
              onChange={(e) => setDevotee({ ...devotee, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-[#d94444]' : ''}`}
              placeholder={t('devoteeNamePlaceholder')}
            />
            {errors.name && <p className="mt-1 text-xs text-[#d94444]">{t('nameRequired')}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
              {t('nakshatraLabel')}
            </label>
            <select
              value={devotee.nakshatra}
              onChange={(e) => setDevotee({ ...devotee, nakshatra: e.target.value })}
              className={`input-field cursor-pointer ${errors.nakshatra ? 'border-[#d94444]' : ''}`}
            >
              <option value="">{t('selectNakshatra')}</option>
              {nakshatras.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {errors.nakshatra && (
              <p className="mt-1 text-xs text-[#d94444]">{t('nakshatraRequired')}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
              {t('rashiLabel')}
            </label>
            <select
              value={devotee.rashi}
              onChange={(e) => setDevotee({ ...devotee, rashi: e.target.value })}
              className={`input-field cursor-pointer ${errors.rashi ? 'border-[#d94444]' : ''}`}
            >
              <option value="">{t('selectRashi')}</option>
              {rashis.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.rashi && <p className="mt-1 text-xs text-[#d94444]">{t('rashiRequired')}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
              {t('gotramLabel')}
            </label>
            <input
              value={devotee.gotram || ''}
              onChange={(e) => setDevotee({ ...devotee, gotram: e.target.value })}
              className="input-field"
              placeholder={t('gotramPlaceholder')}
            />
          </div>
        </div>

        <button onClick={validate} className="btn-primary mt-5 w-full cursor-pointer">
          {t('addSevaBtn')} {localizedSeva.name} — ₹{localizedSeva.price}
        </button>
      </div>
    </div>
  )
}

export default DevoteeModal
