import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

interface LanguageDropdownProps {
  className?: string
}

const LanguageDropdown = ({ className = '' }: LanguageDropdownProps) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelectLanguage = (lang: 'EN' | 'KN') => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Globe button ONLY in navbar (no text) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-[#c1440e] bg-[#fff9f3] text-[#c1440e] shadow-xs ring-2 ring-[#c1440e]/20'
            : 'border-[#e0d3c5] bg-white text-[#5c4d41] hover:border-[#c1440e] hover:bg-[#fff9f3] hover:text-[#c1440e]'
        }`}
        aria-label="Select Language"
        aria-expanded={isOpen}
        title={language === 'EN' ? 'Language: English' : 'ಭಾಷೆ: ಕನ್ನಡ'}
      >
        <svg
          className="h-4.5 w-4.5 text-[#c1440e]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>

      {/* Two rectangle boxes displayed right in navbar */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-[#eadfd1] bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          <div className="flex flex-col gap-1.5">
            {/* English Rectangle Box */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('EN')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                language === 'EN'
                  ? 'bg-[#fdf2e9] text-[#c1440e] border border-[#f5cfb5] shadow-xs'
                  : 'bg-white text-[#5c4d41] border border-transparent hover:bg-[#faf4ec] hover:text-[#c1440e]'
              }`}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇬🇧</span>
                <span>English</span>
              </div>
              {language === 'EN' && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c1440e] text-[10px] text-white font-bold">
                  ✓
                </span>
              )}
            </button>

            {/* Kannada Rectangle Box */}
            <button
              type="button"
              onClick={() => handleSelectLanguage('KN')}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                language === 'KN'
                  ? 'bg-[#fdf2e9] text-[#c1440e] border border-[#f5cfb5] shadow-xs'
                  : 'bg-white text-[#5c4d41] border border-transparent hover:bg-[#faf4ec] hover:text-[#c1440e]'
              }`}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇮🇳</span>
                <span>ಕನ್ನಡ</span>
              </div>
              {language === 'KN' && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c1440e] text-[10px] text-white font-bold">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
