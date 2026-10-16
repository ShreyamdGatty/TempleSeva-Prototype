import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../contexts/LanguageContext'

export interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
}

const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
  const { language, setLanguage, toggleLanguage } = useLanguage()

  // Prevent background scrolling and close on Escape
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isEnglish = language === 'EN'
  const targetLanguage = isEnglish ? 'Kannada' : 'English'
  const targetLanguageNative = isEnglish ? 'ಕನ್ನಡ' : 'English'

  const handleConfirmSwitch = () => {
    toggleLanguage()
    onClose()
  }

  const handleSelectLanguage = (lang: 'EN' | 'KN') => {
    setLanguage(lang)
    onClose()
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-200 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#fff3eb] via-[#fef6f0] to-[#fff] p-6 pb-5 border-b border-[#f3e3d6]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-[#888888] hover:bg-[#f3e3d6] hover:text-[#222222] transition cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-2xl text-white shadow-md">
              🌐
            </span>
            <div>
              <h3 className="text-xl font-bold text-[#222222] font-serif">
                {isEnglish ? 'Change Language' : 'ಭಾಷೆ ಬದಲಾಯಿಸಿ'}
              </h3>
              <p className="text-xs text-[#777777] mt-0.5">
                {isEnglish
                  ? 'Select your preferred language'
                  : 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Confirmation Question Prompt */}
          <div className="rounded-2xl border border-[#fed7aa] bg-[#fffaf5] p-4 text-center">
            <span className="text-2xl mb-1 block">💬</span>
            <h4 className="text-base font-bold text-[#222222] leading-snug">
              {isEnglish
                ? 'Do you want to switch to Kannada?'
                : 'ನೀವು ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಾಯಿಸಲು ಬಯಸುವಿರಾ?'}
            </h4>
            <p className="text-xs text-[#c1440e] font-medium mt-1">
              {isEnglish
                ? 'ವೆಬ್‌ಸೈಟ್ ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗುವುದು'
                : 'Website language will be switched to English'}
            </p>
          </div>

          {/* Quick Language Selection Cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* English Card */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('EN')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                language === 'EN'
                  ? 'border-[#c1440e] bg-[#fff6f0] shadow-sm'
                  : 'border-[#eaeaea] bg-white hover:border-[#fed7aa]'
              }`}
            >
              <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider">
                English
              </span>
              <span className="text-base font-bold text-[#222222] mt-0.5">
                English
              </span>
              {language === 'EN' ? (
                <span className="mt-2 rounded-full bg-[#c1440e] px-2 py-0.5 text-[10px] font-bold text-white">
                  ✓ Current
                </span>
              ) : (
                <span className="mt-2 text-[10px] font-semibold text-[#888888]">
                  Click to switch
                </span>
              )}
            </button>

            {/* Kannada Card */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('KN')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                language === 'KN'
                  ? 'border-[#c1440e] bg-[#fff6f0] shadow-sm'
                  : 'border-[#eaeaea] bg-white hover:border-[#fed7aa]'
              }`}
            >
              <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider">
                Kannada
              </span>
              <span className="text-base font-bold text-[#222222] mt-0.5">
                ಕನ್ನಡ
              </span>
              {language === 'KN' ? (
                <span className="mt-2 rounded-full bg-[#c1440e] px-2 py-0.5 text-[10px] font-bold text-white">
                  ✓ Current
                </span>
              ) : (
                <span className="mt-2 text-[10px] font-semibold text-[#888888]">
                  ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ
                </span>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleConfirmSwitch}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] py-3 px-4 text-center text-sm font-bold text-white shadow-md transition hover:from-[#ab3b0b] hover:to-[#c64913] hover:shadow-lg cursor-pointer"
            >
              {isEnglish
                ? `Yes, Switch to ${targetLanguageNative}`
                : `ಹೌದು, ${targetLanguageNative} ಗೆ ಬದಲಾಯಿಸಿ`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#d5d5d5] py-3 px-5 text-center text-sm font-semibold text-[#555555] hover:bg-[#f7f7f7] transition cursor-pointer"
            >
              {isEnglish ? 'Cancel' : 'ರದ್ದುಮಾಡಿ'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default LanguageModal
