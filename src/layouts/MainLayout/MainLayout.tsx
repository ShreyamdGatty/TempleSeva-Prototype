import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../../types'
import { getInitials } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import SideMenuDrawer from '../../components/SideMenuDrawer/SideMenuDrawer'
import LanguageModal from '../../components/LanguageModal/LanguageModal'

interface MainLayoutProps {
  user: User | null
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
  onLogout: () => void
  children: React.ReactNode
}

const MainLayout = ({
  user,
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
  onLogout,
  children,
}: MainLayoutProps) => {
  const navigate = useNavigate()
  const { language, toggleLanguage: _toggleLanguage, t } = useLanguage()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)

  return (
    <div className="home-route min-h-screen bg-[#fffcf6] text-[#34251e]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#eadfd1] bg-[#fffcf6]/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left shrink-0 mr-4 cursor-pointer"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] font-serif text-xl font-bold text-white shadow-md">
              ॐ
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight whitespace-nowrap">
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

          {/* Central Navigation Links */}
          <nav className="hidden items-center gap-4 xl:gap-7 text-sm font-semibold text-[#75685d] lg:flex shrink-0">
            <a href="/#about" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navAbout')}
            </a>
            <a href="/#temples" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navTemples')}
            </a>

            {/* Sevas link in navbar after login */}
            {user && (
              <button
                onClick={() => navigate('/sevas')}
                className="flex items-center gap-1.5 rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-3.5 py-1 text-xs font-bold text-[#c1440e] whitespace-nowrap transition-all hover:bg-[#c1440e] hover:text-white shadow-xs cursor-pointer"
              >
                <span className="animate-diya">🪔</span>
                <span>{language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}</span>
              </button>
            )}

            <a href="/#how" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navHowItWorks')}
            </a>
            <a href="/#trust" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navTrust')}
            </a>
            <a href="/#faq" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navFaq')}
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
            {user ? (
              <div className="hidden sm:flex items-center gap-1.5 xl:gap-2">
                <button
                  onClick={onOrders}
                  className="rounded-full bg-[#f5ede2] px-3 py-1.5 text-xs font-bold whitespace-nowrap transition hover:bg-[#ebdcc9] cursor-pointer"
                >
                  {t('navMySevas')}
                </button>
                <button
                  onClick={onProfile}
                  className="flex items-center gap-1.5 rounded-full border border-[#e0d3c5] bg-white px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition hover:border-[#c1440e] cursor-pointer"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#c1440e] text-[10px] text-white">
                    {getInitials(user.name)}
                  </span>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onLogin}
                  className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={onRegister}
                  className="rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-sm whitespace-nowrap transition hover:shadow-md cursor-pointer"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}

            {/* Menu Trigger: Only shown after login is successful */}
            {user && (
              <button
                type="button"
                onClick={() => setSideMenuOpen(true)}
                className="group flex items-center justify-center h-10 w-10 rounded-xl border border-[#e0d3c5] bg-white text-[#34251e] shadow-xs transition hover:border-[#c1440e] hover:bg-[#fff9f3] hover:text-[#c1440e] cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${user.name} - Profile & Menu`}
              >
                {/* Desktop View: Profile Icon */}
                <div className="relative hidden sm:flex items-center justify-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#34251e] group-hover:text-[#c1440e] transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#c1440e] ring-2 ring-white" />
                </div>

                {/* Mobile View: 3-Line Hamburger Icon */}
                <span className="flex sm:hidden flex-col gap-1 w-5 items-center justify-center pointer-events-none">
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                  <span className="block h-0.5 w-full bg-[#34251e] rounded-full group-hover:bg-[#c1440e] transition-colors" />
                </span>
              </button>
            )}

            {/* 🌐 Orange Globe (Language) in the right top corner */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#c1440e] bg-[#fff5ee] hover:bg-[#ffebd9] px-3 py-1.5 text-xs font-bold text-[#c1440e] shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              aria-label="Change Language"
              title={language === 'EN' ? 'Change Language (Switch to ಕನ್ನಡ)' : 'Change Language (Switch to English)'}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c1440e"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" fill="#fed7aa" fillOpacity="0.5" stroke="#c1440e" strokeWidth="2" />
                <path d="M2 12h20" stroke="#c1440e" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#c1440e" />
              </svg>
              <span className="font-bold text-[#c1440e] tracking-tight">
                {language === 'EN' ? '(Language)' : '(ಭಾಷೆ)'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Language Switch Confirmation Modal ── */}
      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
      />

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
                <li><a href="/#temples" className="hover:text-[#c1440e]">{t('navTemples')}</a></li>
                <li><a href="/#how" className="hover:text-[#c1440e]">{t('navHowItWorks')}</a></li>
                <li><a href="/#trust" className="hover:text-[#c1440e]">{t('navTrust')}</a></li>
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
            <div className="flex gap-4">
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
