import { useState } from 'react'
import type { Temple } from '../../types'
import { temples } from '../../data'
import { useLanguage } from '../../contexts/LanguageContext'

interface TemplePickerProps {
  selectedTemple?: Temple | null
  onSelect: (temple: Temple) => void
  onClose?: () => void
  isNewUserSelection?: boolean
}

/**
 * ─────────────────────────────────────────────────────────────
 * TEMPLE ARCHITECTURAL LINE-ART SVGs
 * BookMyShow style monochrome line-art vector drawings
 * ─────────────────────────────────────────────────────────────
 */

// 1. Kashi Vishwanath — Nagara Shikhar, Sacred Trishul & Ganga Ghat Steps
export const KashiVishwanathSvg = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Stepped Ganga Ghats at Base */}
    <line x1="8" y1="72" x2="72" y2="72" />
    <line x1="14" y1="68" x2="66" y2="68" />
    <line x1="20" y1="64" x2="60" y2="64" />

    {/* Nagara Curvilinear Spire Tower (Curved Shikhara) */}
    <path d="M40 16 C33 28 26 44 26 64 H54 C54 44 47 28 40 16 Z" />

    {/* Horizontal Decorative Tier Ridges */}
    <line x1="32" y1="34" x2="48" y2="34" strokeWidth="1.4" />
    <line x1="29" y1="44" x2="51" y2="44" strokeWidth="1.4" />
    <line x1="27" y1="54" x2="53" y2="54" strokeWidth="1.4" />

    {/* Side Spirets (Urushringas) */}
    <path d="M22 64 C22 52 26 46 29 44" strokeWidth="1.3" />
    <path d="M58 64 C58 52 54 46 51 44" strokeWidth="1.3" />

    {/* Garbhagriha Inner Sanctum Portal */}
    <path d="M34 64 V52 C34 49 46 49 46 52 V64" />
    {/* Holy Shiva Lingam Silhouette */}
    <ellipse cx="40" cy="58" rx="3" ry="3.5" fill="currentColor" fillOpacity="0.15" />

    {/* Golden Kalasha Finial */}
    <ellipse cx="40" cy="14" rx="3.5" ry="3" />
    <circle cx="40" cy="9.5" r="1.8" />

    {/* Sacred Trishul atop Spire */}
    <line x1="40" y1="7.5" x2="40" y2="2" strokeWidth="2" />
    <path d="M36 5 C36 7 44 7 44 5" strokeWidth="1.6" />
  </svg>
)

// 2. Sri Venkateswara Swamy — Ananda Nilayam Golden Vimanam, Sacred Namam & 3 Kalasams
export const VenkateswaraTirupatiSvg = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Base Stone Plinth */}
    <line x1="10" y1="72" x2="70" y2="72" />
    <line x1="14" y1="68" x2="66" y2="68" />

    {/* Tier 1: Broad Base Tier with Portal */}
    <path d="M18 68 L21 54 H59 L62 68" />
    <path d="M34 68 V56 C34 52 46 52 46 56 V68" />
    <circle cx="28" cy="61" r="2" strokeWidth="1.3" />
    <circle cx="52" cy="61" r="2" strokeWidth="1.3" />

    {/* Tier 2: Middle Stepped Tier with Carved Niches */}
    <line x1="20" y1="54" x2="60" y2="54" strokeWidth="2" />
    <path d="M24 54 L27 40 H53 L56 54" />
    <circle cx="34" cy="47" r="1.8" strokeWidth="1.3" />
    <circle cx="40" cy="47" r="1.8" strokeWidth="1.3" />
    <circle cx="46" cy="47" r="1.8" strokeWidth="1.3" />

    {/* Tier 3: Apex Vimanam Dome */}
    <line x1="26" y1="40" x2="54" y2="40" strokeWidth="2" />
    <path d="M30 40 C32 30 48 30 50 40" />

    {/* Three Golden Kalasams atop Peak */}
    <line x1="35" y1="30" x2="35" y2="22" strokeWidth="1.5" />
    <line x1="40" y1="29" x2="40" y2="19" strokeWidth="2" />
    <line x1="45" y1="30" x2="45" y2="22" strokeWidth="1.5" />
    <circle cx="40" cy="18" r="1.8" />
    <circle cx="35" cy="21" r="1.4" />
    <circle cx="45" cy="21" r="1.4" />

    {/* Sacred Tirumala Namam (Urdhva Pundra) Tilak */}
    <path d="M37 6 L38 12 H42 L43 6" strokeWidth="1.4" />
    <line x1="40" y1="4" x2="40" y2="11" strokeWidth="1.6" />
  </svg>
)

// 3. Shree Meenakshi — Dravidian Raja Gopuram (Identical to 8th icon in BookMyShow screenshot)
export const MeenakshiMaduraiSvg = ({ className = "w-20 h-20" }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Base Stone Plinth */}
    <line x1="12" y1="72" x2="68" y2="72" />
    <line x1="16" y1="68" x2="64" y2="68" />

    {/* Tier 1: Grand Gateway Arch (Thiruvasal) */}
    <path d="M20 68 L22 56 H58 L60 68" />
    <path d="M33 68 V57 C33 53 47 53 47 57 V68" />

    {/* Tier 2 */}
    <line x1="21" y1="56" x2="59" y2="56" strokeWidth="2" />
    <path d="M24 56 L26 44 H54 L56 56" />
    <circle cx="35" cy="50" r="1.8" strokeWidth="1.3" />
    <circle cx="45" cy="50" r="1.8" strokeWidth="1.3" />

    {/* Tier 3 */}
    <line x1="25" y1="44" x2="55" y2="44" strokeWidth="2" />
    <path d="M28 44 L30 32 H50 L52 44" />
    <circle cx="40" cy="38" r="1.8" strokeWidth="1.3" />

    {/* Tier 4 (Apex Ridge) */}
    <line x1="29" y1="32" x2="51" y2="32" strokeWidth="2" />
    <path d="M32 32 L33 24 H47 L48 32" />

    {/* Row of 5 Kalasha Finials on Gopuram Ridge */}
    <line x1="30" y1="24" x2="50" y2="24" strokeWidth="1.8" />
    <line x1="33" y1="24" x2="33" y2="16" strokeWidth="1.5" />
    <line x1="37" y1="24" x2="37" y2="14" strokeWidth="1.6" />
    <line x1="40" y1="24" x2="40" y2="11" strokeWidth="2" />
    <line x1="43" y1="24" x2="43" y2="14" strokeWidth="1.6" />
    <line x1="47" y1="24" x2="47" y2="16" strokeWidth="1.5" />
    <circle cx="40" cy="10" r="1.6" />
  </svg>
)

const TemplePicker = ({
  selectedTemple,
  onSelect,
  onClose,
  isNewUserSelection,
}: TemplePickerProps) => {
  const { language, translateTemple } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter temples based on search
  const filteredTemples = temples.filter((temple) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      temple.name.toLowerCase().includes(q) ||
      temple.location.toLowerCase().includes(q) ||
      temple.id.toLowerCase().includes(q)
    )
  })

  // Render architectural line-art SVG for each temple
  const renderTempleSvg = (id: string, className = "w-20 h-20") => {
    switch (id) {
      case 'kashi':
        return <KashiVishwanathSvg className={className} />
      case 'venkateswara':
        return <VenkateswaraTirupatiSvg className={className} />
      case 'meenakshi':
        return <MeenakshiMaduraiSvg className={className} />
      default:
        return <KashiVishwanathSvg className={className} />
    }
  }

  const handleTempleClick = (temple: Temple) => {
    onSelect(temple)
    if (onClose) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      {/* ── Modal Dialog Card ── */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-pop border border-gray-200 text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            {isNewUserSelection && (
              <span className="inline-flex items-center gap-1.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c1440e] bg-[#fdf2e9] px-2.5 py-0.5 rounded-full border border-[#f5cfb5]">
                <span className="text-xs">✨</span>
                {language === 'KN' ? 'ಹೊಸ ಭಕ್ತರ ಸ್ವಾಗತ — ದೇವಾಲಯವನ್ನು ಆರಿಸಿ' : 'New Devotee Welcome — Choose Your Temple'}
              </span>
            )}
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              {language === 'KN' ? 'ದೇವಾಲಯವನ್ನು ಆರಿಸಿ' : 'Select Temple'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isNewUserSelection
                ? (language === 'KN'
                    ? 'ನಿಮ್ಮ ಖಾತೆ ಸಿದ್ಧವಾಗಿದೆ! ಸೇವೆಗಳನ್ನು ಆರಂಭಿಸಲು ದೇವಾಲಯವನ್ನು ಆರಿಸಿ.'
                    : 'Your account is ready! Choose a sacred sanctuary to begin booking sevas.')
                : (language === 'KN'
                    ? 'ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಪುಣ್ಯಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
                    : 'Choose a sacred sanctuary to view its offerings')}
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer text-xl leading-none"
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <svg
              className="h-4 w-4"
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
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'KN'
                ? 'ದೇವಾಲಯ ಅಥವಾ ಊರನ್ನು ಹುಡುಕಿ (ಕಾಶಿ, ತಿರುಪತಿ, ಮಧುರೈ)...'
                : 'Search for temple or city (e.g. Kashi, Tirupati, Madurai)...'
            }
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#c1440e] focus:ring-1 focus:ring-[#c1440e]"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Temple SVG with Name & Address (BookMyShow Clean Layout) ── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {filteredTemples.map((temple) => {
            const localized = translateTemple(temple)
            const isSelected = selectedTemple?.id === temple.id

            return (
              <button
                key={temple.id}
                type="button"
                onClick={() => handleTempleClick(temple)}
                className={`group relative flex flex-col items-center justify-between text-center p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'border-[#c1440e] bg-[#fffaf5] shadow-xs'
                    : 'border-transparent hover:border-gray-200 hover:bg-gray-50/70 hover:-translate-y-0.5'
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 rounded-full bg-[#c1440e] text-white text-[9px] font-bold px-1.5 py-0.2">
                    ✓
                  </div>
                )}

                {/* 1. Temple SVG (Line-Art Vector Sitting Directly on Card) */}
                <div
                  className={`flex items-end justify-center h-20 transition-colors duration-200 ${
                    isSelected
                      ? 'text-[#c1440e]'
                      : 'text-gray-600 group-hover:text-[#c1440e]'
                  }`}
                >
                  {renderTempleSvg(temple.id, "w-18 h-18 sm:w-20 sm:h-20")}
                </div>

                {/* 2. Temple Name */}
                <h3
                  className={`mt-3 text-sm font-bold tracking-tight transition-colors duration-200 ${
                    isSelected
                      ? 'text-[#c1440e]'
                      : 'text-gray-900 group-hover:text-[#c1440e]'
                  }`}
                >
                  {localized.name}
                </h3>

                {/* 3. Temple Address / Location */}
                <p className="mt-1 text-xs text-gray-500 font-medium">
                  {localized.location}
                </p>
              </button>
            )
          })}
        </div>

        {filteredTemples.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p className="text-sm font-semibold">No temple found matching "{searchQuery}"</p>
            <p className="text-xs text-gray-400 mt-1">
              Try searching for Kashi, Tirupati, or Madurai
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplePicker
