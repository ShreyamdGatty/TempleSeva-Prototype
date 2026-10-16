import { useState } from 'react'
import type { Devotee } from '../../types'
import { nakshatras, rashis } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'

interface DevoteeDetailsModalProps {
  devotee: Devotee
  defaultUserName?: string
  onSave: (devotee: Devotee) => void
  onClose: () => void
  onToast?: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
}

const DevoteeDetailsModal = ({
  devotee,
  defaultUserName = '',
  onSave,
  onClose,
  onToast,
}: DevoteeDetailsModalProps) => {
  const { t, language } = useLanguage()

  const [form, setForm] = useState<Devotee>({
    name: devotee.name || defaultUserName || '',
    nakshatra: devotee.nakshatra || '',
    rashi: devotee.rashi || '',
    gotram: devotee.gotram || '',
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleSave = () => {
    const errs: Record<string, boolean> = {}
    if (!form.name.trim()) errs.name = true

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    onSave(form)
    if (onToast) {
      onToast(t('devoteeSavedSuccess'), 'success')
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container w-full max-w-lg bg-[#fffdf9] p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eadfd1] pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-xl text-white shadow-sm">
              📿
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#34251e]">
                {t('devoteeDetailsTitle')}
              </h2>
              <p className="text-xs text-[#8b7a6d]">{t('devoteeDetailsSub')}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        {/* Info card */}
        <div className="mt-4 rounded-xl border border-[#eedecb] bg-[#fcf8f3] p-3 text-xs text-[#8a6842]">
          <p className="font-semibold">
            🕉️ {language === 'KN' ? 'ಸಂಕಲ್ಪ ಮಹತ್ವ:' : 'Sankalpa Importance:'}
          </p>
          <p className="mt-1 leading-relaxed opacity-90">
            {language === 'KN'
              ? 'ಪೂಜೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಹೆಸರು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರವನ್ನು ಉಚ್ಚರಿಸಿ ದೈವಿಕ ಸಂಕಲ್ಪ ಮಾಡುತ್ತಾರೆ. ಈ ವಿವರಗಳು ನೇರವಾಗಿ ಅರ್ಚಕರಿಗೆ ತಲುಪುತ್ತವೆ.'
              : 'During puja, priests recite your name, birth star (nakshatra), and lineage (gotram) for individual spiritual sanctification and family blessings.'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="mt-5 space-y-4">
          {/* Devotee Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1.5">
              {t('devoteeNameLabel')} <span className="text-[#c1440e]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: false })
              }}
              placeholder={t('devoteeNamePlaceholder')}
              className={`input-field w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none ${
                errors.name
                  ? 'border-[#d94444] bg-[#fff5f5]'
                  : 'border-[#d8c8b8] bg-white focus:border-[#c1440e]'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#d94444]">
                {t('nameRequired')}
              </p>
            )}
          </div>

          {/* Nakshatra & Rashi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1.5">
                {t('nakshatraLabel')}
              </label>
              <select
                value={form.nakshatra}
                onChange={(e) => setForm({ ...form, nakshatra: e.target.value })}
                className="w-full rounded-xl border border-[#d8c8b8] bg-white px-3 py-2.5 text-sm text-[#34251e] shadow-xs cursor-pointer focus:border-[#c1440e] focus:outline-none"
              >
                <option value="">{t('selectNakshatra')}</option>
                {nakshatras.map((nak) => (
                  <option key={nak} value={nak}>
                    {nak}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1.5">
                {t('rashiLabel')}
              </label>
              <select
                value={form.rashi}
                onChange={(e) => setForm({ ...form, rashi: e.target.value })}
                className="w-full rounded-xl border border-[#d8c8b8] bg-white px-3 py-2.5 text-sm text-[#34251e] shadow-xs cursor-pointer focus:border-[#c1440e] focus:outline-none"
              >
                <option value="">{t('selectRashi')}</option>
                {rashis.map((ras) => (
                  <option key={ras} value={ras}>
                    {ras}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gotram */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#674f40] mb-1.5">
              {t('gotramLabel')}{' '}
              <span className="text-[11px] font-normal text-[#8b7a6d] lowercase">
                ({language === 'KN' ? 'ಐಚ್ಛಿಕ' : 'optional'})
              </span>
            </label>
            <input
              type="text"
              value={form.gotram || ''}
              onChange={(e) => setForm({ ...form, gotram: e.target.value })}
              placeholder={t('gotramPlaceholder')}
              className="input-field w-full rounded-xl border border-[#d8c8b8] bg-white px-3.5 py-2.5 text-sm transition focus:border-[#c1440e] focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2.5 border-t border-[#eadfd1] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#d8c8b8] bg-[#fdfbf7] py-2.5 text-sm font-bold text-[#674f40] transition hover:bg-[#f5ede2] cursor-pointer"
          >
            {language === 'KN' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary flex-1 py-2.5 text-sm font-bold shadow-md cursor-pointer"
          >
            {language === 'KN' ? 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ' : 'Save Devotee Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DevoteeDetailsModal
