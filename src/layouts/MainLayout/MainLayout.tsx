import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User, Temple } from '../../types'
import { STORAGE_TEMPLE } from '../../data'
import { getInitials } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../../components/IonIcon'
import SideMenuDrawer from '../../components/SideMenuDrawer/SideMenuDrawer'
import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown'

interface MainLayoutProps {
  user: User | null
  selectedTemple?: Temple | null
  cartCount?: number
  wishlistCount?: number
  ordersCount?: number
  onLogin: () => void
  onRegister: () => void
  onOrders: () => void
  onProfile: () => void
  onWishlist?: () => void
  onDevoteeDetails?: () => void
  onOpenQrPass?: () => void
  onSwitchTemple?: () => void
  onSevas?: () => void
  onLogout: () => void
  onSelectTemple?: (temple: Temple) => void
  navigateToSevas?: (temple?: Temple) => void
  isSearchModalOpen?: boolean
  setIsSearchModalOpen?: (open: boolean) => void
  searchModalMode?: 'view' | 'select'
  setSearchModalMode?: (mode: 'view' | 'select') => void
  onOpenSearch?: () => void
  children: React.ReactNode
}

const MainLayout = ({
  user,
  selectedTemple,
  cartCount: _cartCount = 0,
  wishlistCount = 0,
  ordersCount = 0,
  onLogin,
  onRegister,
  onOrders,
  onProfile,
  onWishlist,
  onDevoteeDetails,
  onOpenQrPass,
  onSwitchTemple,
  onSevas,
  onLogout,
  onSelectTemple,
  navigateToSevas: _navigateToSevas,
  isSearchModalOpen: externalSearchOpen,
  setIsSearchModalOpen: setExternalSearchOpen,
  searchModalMode: externalSearchMode,
  setSearchModalMode: setExternalSearchMode,
  onOpenSearch,
  children,
}: MainLayoutProps) => {
  const navigate = useNavigate()
  const { language, toggleLanguage: _toggleLanguage, t, translateTemple } = useLanguage()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  // Search Modal with Blurred Background & Temple Cards Grid (controlled or local)
  const [internalSearchOpen, setInternalSearchOpen] = useState(false)
  const isSearchModalOpen = externalSearchOpen !== undefined ? externalSearchOpen : internalSearchOpen
  const setIsSearchModalOpen = setExternalSearchOpen || setInternalSearchOpen

  const [internalSearchMode, setInternalSearchMode] = useState<'view' | 'select'>('select')
  const searchModalMode = externalSearchMode !== undefined ? externalSearchMode : internalSearchMode
  const setSearchModalMode = setExternalSearchMode || setInternalSearchMode

  const handleSelectTempleFromSearch = (temple: Temple) => {
    setIsSearchModalOpen(false)
    if (!user) {
      window.sessionStorage.setItem('temple-seva.pendingTemple', temple.id)
      if (onLogin) {
        onLogin()
      } else if (onRegister) {
        onRegister()
      }
      return
    }
    if (onSelectTemple) {
      onSelectTemple(temple)
    } else {
      window.localStorage.setItem(STORAGE_TEMPLE, JSON.stringify(temple))
    }
    navigate('/')
  }

  return (
    <div className="home-route min-h-screen bg-[#fffcf6] text-[#34251e]">
      {/* ── BookMyShow Style 2-Tier Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all shadow-xs">
        {/* Tier 1: Main Bar (Logo | Search Bar | Sanctuary Selector ▾ | Language | User Profile) */}
        <div className="flex h-[60px] sm:h-[66px] w-full items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
          {/* 1. Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-left shrink-0 cursor-pointer"
          >
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap">
              {language === 'KN' ? (
                <>
                  ಟೆಂಪಲ್<span className="text-[#c1440e]">ಸೇವಾ</span>
                </>
              ) : (
                <>
                  Temple<span className="text-[#c1440e]">Seva</span>
                </>
              )}
            </span>
          </button>

          {/* 2. BookMyShow Search Bar Button (Always visible before and after login) */}
          <div
            onClick={() => {
              if (onOpenSearch) {
                onOpenSearch()
              } else {
                setSearchModalMode('select')
                setIsSearchModalOpen(true)
              }
            }}
            className="relative flex-1 max-w-[560px] mx-1 sm:mx-3 cursor-pointer group min-w-0"
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5 h-[36px] sm:h-[40px] px-2.5 sm:px-3.5 bg-white border border-gray-300 hover:border-[#c1440e]/70 rounded-lg shadow-2xs group-hover:shadow-xs transition-all">
              {/* Magnifying Glass Icon (BookMyShow Gray Outline) */}
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#c1440e] transition-colors shrink-0"
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

              <span
                className={`text-xs sm:text-sm transition-colors truncate select-none ${
                  user && selectedTemple
                    ? 'font-semibold text-[#2c1d16] group-hover:text-[#c1440e]'
                    : 'font-normal text-gray-400 group-hover:text-gray-600'
                }`}
              >
                {user && selectedTemple
                  ? language === 'KN'
                    ? translateTemple(selectedTemple).name
                    : selectedTemple.name
                  : language === 'KN'
                  ? 'ದೇವಾಲಯ ಹುಡುಕಿ...'
                  : 'Search Temples'}
              </span>
            </div>
          </div>

          {/* 3. Right: Language Dropdown + User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Dropdown */}
            <LanguageDropdown />

            {/* User Profile or Auth Buttons (Login / Register) */}
            {user ? (
              <button
                type="button"
                onClick={() => setSideMenuOpen(true)}
                className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] pl-1 pr-2 sm:pr-3 py-1 text-xs font-bold text-[#34251e] shadow-2xs transition hover:shadow-xs cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${user.name} - Profile & Menu`}
              >
                <span className="grid h-6 w-6 sm:h-7 sm:w-7 place-items-center rounded-full bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-[10px] sm:text-[11px] font-bold text-white shadow-2xs">
                  {getInitials(user.name)}
                </span>
                <span className="hidden sm:inline font-semibold text-gray-700 group-hover:text-[#c1440e] transition-colors max-w-[90px] truncate">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <svg
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 group-hover:text-[#c1440e] transition-transform group-hover:translate-y-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={onLogin}
                  className="rounded-lg border border-[#c1440e]/30 hover:border-[#c1440e] text-[#c1440e] hover:bg-[#fff9f3] px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  {t('navLogin')}
                </button>
                <button
                  type="button"
                  onClick={onRegister}
                  className="rounded-lg bg-[#c1440e] hover:bg-[#a53809] text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold transition shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 2: Sub-navigation Row (BookMyShow style: Movies, Events, Plays... / Categories) */}
        <div className="border-t border-[#eadfd1]/80 bg-[#fffdfa] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[38px] w-full items-center justify-between text-xs sm:text-[13px] font-medium text-[#5c4d41] overflow-x-auto no-scrollbar">
            {/* Left Category Links */}
            <nav className="flex items-center gap-5 sm:gap-7 whitespace-nowrap">
              <a href="/#how" className="transition hover:text-[#c1440e]">
                {t('navHowItWorks')}
              </a>
              <a href="/#why-us" className="transition hover:text-[#c1440e]">
                {t('navWhyUs')}
              </a>
              <a href="/#faq" className="transition hover:text-[#c1440e]">
                {t('navFaq')}
              </a>
              {/* Sevas navigation button (only after login) */}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSevas) {
                      onSevas()
                    } else if (_navigateToSevas) {
                      _navigateToSevas()
                    } else if (!selectedTemple) {
                      setSearchModalMode('select')
                      setIsSearchModalOpen(true)
                    } else {
                      navigate('/sevas')
                    }
                  }}
                  className="transition hover:text-[#c1440e] font-semibold cursor-pointer"
                >
                  {language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}
                </button>
              )}

              {user && (
                <button
                  type="button"
                  onClick={onOrders}
                  className="transition hover:text-[#c1440e] font-semibold cursor-pointer"
                >
                  {t('navMySevas')}
                </button>
              )}
            </nav>

            {/* Right: Selected Temple Name and Location (Only shown after user logs in and selects a temple) */}
            {user && selectedTemple ? (
              <div className="flex items-center gap-1.5 text-xs sm:text-[12px] text-[#5c4d41] shrink-0 font-medium pl-4">
                <span className="text-[#c1440e] font-bold whitespace-nowrap">
                  {language === 'KN' ? 'ಆಯ್ಕೆಮಾಡಿದ ದೇವಾಲಯ :' : 'Selected Temple :'}
                </span>
                <button
                  type="button"
                  onClick={onSwitchTemple}
                  className="flex items-center gap-1.5 hover:text-[#c1440e] transition cursor-pointer text-left whitespace-nowrap group"
                  title={language === 'KN' ? 'ದೇವಾಲಯ ಬದಲಾಯಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to switch temple'}
                >
                  <span className="font-bold text-[#34251e] group-hover:text-[#c1440e] transition">
                    {language === 'KN' ? translateTemple(selectedTemple).name : selectedTemple.name}
                  </span>
                  <span className="hidden sm:inline-flex text-[#786657] group-hover:text-[#c1440e] items-center gap-1">
                    <IonIcon name="location-sharp" className="text-[#c1440e] text-xs shrink-0" />
                    <span>
                      {language === 'KN' ? translateTemple(selectedTemple).location : selectedTemple.location}
                    </span>
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Slide-Out Side Modal / Drawer (Rendered via React Portal onto document.body) ── */}
      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        user={user}
        wishlistCount={wishlistCount}
        ordersCount={ordersCount}
        onWishlist={() => {
          if (onWishlist) onWishlist()
        }}
        onDevoteeDetails={() => {
          if (onDevoteeDetails) {
            onDevoteeDetails()
          } else {
            navigate('/profile?tab=devotee-list', { state: { tab: 'devotee-list' } })
          }
        }}
        onProfile={onProfile}
        onLogout={onLogout}
        onOrders={onOrders}
        onOpenQrPass={onOpenQrPass}
        onSwitchTemple={onSwitchTemple}
        onSevas={onSevas}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      {/* Page Content */}
      {children}

      {/* Enhanced Localized Footer */}
      <footer id="contact" className="border-t border-[#eadfd1] bg-[#f5ede2] px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#c1440e] font-serif text-lg text-white">
                  ॐ
                </span>
                <span className="font-serif text-xl font-bold">{t('brandName')}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#806f61]">
                {language === 'KN'
                  ? 'ಭಾರತದ ಪಾವನ ಪುಣ್ಯಕ್ಷೇತ್ರಗಳನ್ನು ವಿಶ್ವದಾದ್ಯಂತ ಇರುವ ಲಕ್ಷಾಂತರ ಭಕ್ತರೊಂದಿಗೆ ಬೆಸೆಯುವ ಧಾರ್ಮಿಕ ಸೇವಾ ತಾಣ.'
                  : 'Bridging sacred sanctuaries with millions of devotees worldwide through pure rituals and authentic prasadam.'}
              </p>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#34251e]">
                {language === 'KN' ? 'ಭಕ್ತರ ಸೇವೆಗಳು' : 'Devotee Services'}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#806f61]">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSearch) onOpenSearch()
                      else setIsSearchModalOpen(true)
                    }}
                    className="hover:text-[#c1440e] cursor-pointer"
                  >
                    {t('navTemples')}
                  </button>
                </li>
                <li><a href="/#how" className="hover:text-[#c1440e]">{t('navHowItWorks')}</a></li>
                <li><a href="/#why-us" className="hover:text-[#c1440e]">{t('navWhyUs')}</a></li>
                <li><a href="/#faq" className="hover:text-[#c1440e]">{t('navFaq')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#34251e]">
                {language === 'KN' ? 'ವಿಶ್ವಾಸಾರ್ಹತೆ & ಸುರಕ್ಷತೆ' : 'Authenticity & Security'}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#806f61]">
                <li>✓ {language === 'KN' ? 'ಪ್ರಮಾಣೀಕೃತ ವೇದ ಪುರೋಹಿತರು' : 'Certified Temple Priests'}</li>
                <li>✓ {language === 'KN' ? '೧೦೦% ನೈಜ ಸಂಕಲ್ಪ ಪೂಜೆ' : '100% Genuine Sankalpa'}</li>
                <li>✓ {language === 'KN' ? 'ಸುರಕ್ಷಿತ ಪ್ರಸಾದ ವಿತರಣೆ' : 'Temperature-Controlled Prasadam'}</li>
                <li>✓ {language === 'KN' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿ ಗೇಟ್‌ವೇ' : 'SSL Encrypted Payment Gateways'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#34251e]">
                {language === 'KN' ? 'ಸಹಾಯವಾಣಿ' : 'Sacred Helpline'}
              </h4>
              <p className="mt-3 text-sm text-[#806f61]">
                {language === 'KN' ? 'ಸಂಕಲ್ಪ ಅಥವಾ ಗೋತ್ರದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?' : 'Have queries about sankalpa or gotra?'}
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-[#c1440e]">+91 1800-TEMPLE (Demo)</p>
              <p className="text-xs text-[#8b7a6d]">
                {language === 'KN' ? 'ಬೆಳಿಗ್ಗೆ ೬:೦೦ - ರಾತ್ರಿ ೯:೦೦ ವರೆಗೆ' : 'Available 6:00 AM – 9:00 PM IST'}
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e2d5c4] pt-6 text-xs text-[#806f61] sm:flex-row">
            <p>© {new Date().getFullYear()} {t('brandName')}. {language === 'KN' ? 'ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' : 'All rights reserved.'}</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-center">
              <span>{language === 'KN' ? 'ಗೌಪ್ಯತಾ ನೀತಿ' : 'Privacy Policy'}</span>
              <span>{language === 'KN' ? 'ನಿಯಮಗಳು & ಷರತ್ತುಗಳು' : 'Terms of Service'}</span>
              <span>{language === 'KN' ? 'ಮರುಪಾವತಿ ನೀತಿ' : 'Cancellation & Refunds'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
