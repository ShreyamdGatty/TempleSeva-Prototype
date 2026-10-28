import { useState, useEffect, useRef } from 'react'
import type { Temple, User } from '../../types'
import { temples } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../IonIcon'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemple: (temple: Temple) => void
  selectedTemple?: Temple | null
  user?: User | null
  mode?: 'view' | 'select'
}

export const SearchModal = ({
  isOpen,
  onClose,
  onSelectTemple,
  selectedTemple,
  user,
  mode: _mode = 'select',
}: SearchModalProps) => {
  const { language, translateTemple } = useLanguage()
  const isKn = language === 'KN'
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeId, setActiveId] = useState<string>(user && selectedTemple?.id ? selectedTemple.id : '')

  // Sync activeId whenever modal is opened or selectedTemple changes
  useEffect(() => {
    setActiveId(user && selectedTemple?.id ? selectedTemple.id : '')
  }, [user, selectedTemple, isOpen])

  // Auto focus input when opened & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ''
      setSearchQuery('')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleItemSelect = (temple: Temple) => {
    if (user) {
      setActiveId(temple.id)
    }
    onSelectTemple(temple)
    setTimeout(() => {
      onClose()
    }, 180)
  }

  const getTempleShrineInfo = (templeId: string) => {
    let label = isKn ? 'ಪವಿತ್ರ ಸನ್ನಿಧಿ' : 'Sacred Shrine'
    let icon = 'star'
    if (templeId === 'ananthapura') {
      label = isKn ? 'ಸರೋವರ ಸನ್ನಿಧಿ' : 'Lake Shrine'
      icon = 'water'
    } else if (templeId === 'udupi-krishna') {
      label = isKn ? 'ಶ್ರೀ ಕೃಷ್ಣ ಸನ್ನಿಧಿ' : 'Lord Krishna Shrine'
      icon = 'sunny'
    } else if (templeId === 'mangaladevi') {
      label = isKn ? 'ಶ್ರೀ ಮಂಗಳಾದೇವಿ ಸನ್ನಿಧಿ' : 'Devi Mangaladevi Shrine'
      icon = 'sparkles'
    } else if (templeId === 'kateel') {
      label = isKn ? 'ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿ ಸನ್ನಿಧಿ' : 'Devi Durgaparameshwari Shrine'
      icon = 'flame'
    } else if (templeId === 'kashi') {
      label = isKn ? 'ಜ್ಯೋತಿರ್ಲಿಂಗ ಸನ್ನಿಧಿ' : 'Jyotirlinga Shrine'
    } else if (templeId === 'venkateswara') {
      label = isKn ? 'ಶ್ರೀ ಬಾಲಾಜಿ ಸನ್ನಿಧಿ' : 'Lord Balaji Shrine'
    } else if (templeId === 'meenakshi') {
      label = isKn ? 'ದೇವಿ ಮೀನಾಕ್ಷಿ ಸನ್ನಿಧಿ' : 'Devi Meenakshi Shrine'
    }
    return {
      icon,
      label,
    }
  }

  // Filtered temples based on user input
  const q = searchQuery.toLowerCase().trim()
  const filteredTemples = temples
    .filter((t) => {
      const loc = translateTemple(t)
      if (!q) return true
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.location.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      )
    })

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fade-in backdrop-blur-md bg-black/65 flex flex-col items-center justify-start p-3 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* ── Modal Window ── */}
      <div
        className="w-full max-w-6xl my-auto bg-[#fffcf6] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#eadfd1] overflow-hidden text-left flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Search & Close */}
        <div className="bg-white/90 border-b border-[#eadfd1] px-3.5 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Centered Search Input Box */}
          <div className="flex-1 flex items-center bg-[#f7f4ef] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#c1440e]/30 border border-[#e2d6c7] focus-within:border-[#c1440e] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 transition-all shadow-inner">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 mr-2 sm:mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isKn
                  ? 'ದೇವಾಲಯಗಳನ್ನು ಹುಡುಕಿ...'
                  : 'Search Temples'
              }
              className="w-full bg-transparent text-xs sm:text-base text-gray-800 placeholder-gray-400 font-medium outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-200 transition"
              >
                ✕
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#f5ede2] hover:bg-[#ebdcc9] text-[#5c4d41] hover:text-[#c1440e] flex items-center justify-center text-lg sm:text-xl font-light transition-all cursor-pointer shrink-0 border border-[#e2d5c5]"
            title="Close Search Modal"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Scrollable Content */}
        <div className="p-3.5 sm:p-8 max-h-[80vh] overflow-y-auto no-scrollbar space-y-4 sm:space-y-6">
          {/* ── Grid of Temple Cards (3 cards) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 pt-2">
            {filteredTemples.slice(0, 3).map((temple) => {
              const localized = translateTemple(temple)
              const isSelected = Boolean(user && activeId === temple.id)
              const shrineInfo = getTempleShrineInfo(temple.id)

              return (
                <article
                  key={temple.id}
                  onClick={() => handleItemSelect(temple)}
                  className={`group flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 relative cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${
                    isSelected
                      ? 'border-[#c1440e] bg-[#fffbf7] shadow-xl ring-2 ring-[#c1440e]/30 scale-[1.01]'
                      : 'border-[#eadfd1] bg-white shadow-sm'
                  }`}
                >
                  <div>
                    {/* Temple Banner Image with Overlay */}
                    <div className="relative h-72 sm:h-80 overflow-hidden">
                      <img
                        loading="lazy"
                        src={temple.image}
                        alt={localized.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

                      {/* Left Side: Active Badge */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#1b5e20] backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg border border-emerald-400/60 ring-2 ring-emerald-500/30 animate-in fade-in">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse shadow-[0_0_8px_#4ade80]" />
                          <span className="tracking-wide">{isKn ? 'ಸಕ್ರಿಯ' : 'Active'}</span>
                        </div>
                      )}

                      {/* Top Right: Sacred Shrine Badge (Devi Meenakshi Shrine / Lord Balaji Shrine / Jyotirlinga Shrine) */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white shadow-md border border-white/25">
                        <IonIcon name={shrineInfo.icon} className="text-[#f8d07e] text-xs" />
                        <span>{shrineInfo.label}</span>
                      </div>

                      {/* Bottom Left: Temple Name & Address Overlaid on Image */}
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md group-hover:text-[#f8d07e] transition-colors">
                          {localized.name}
                        </h3>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#f8d07e] drop-shadow-sm">
                          <IonIcon name="location-sharp" className="text-[#f8d07e] text-sm shrink-0" />
                          <span className="text-white/90">{localized.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredTemples.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              <p className="text-lg font-serif font-bold text-[#34251e]">
                {isKn ? 'ಯಾವುದೇ ದೇವಾಲಯ ಕಂಡುಬಂದಿಲ್ಲ' : 'No temples found'}
              </p>
              <p className="text-sm text-[#786657] mt-1">
                {isKn
                  ? 'ದಯವಿಟ್ಟು ಮಧುರೈ, ತಿರುಪತಿ ಅಥವಾ ಕಾಶಿ ಎಂದು ಹುಡುಕಿ ನೋಡಿ.'
                  : `Try searching for "Madurai", "Tirupati", or "Kashi"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
