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
  onSwitchTemple?: () => void
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
  onSwitchTemple,
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
          <nav className="hidden items-center gap-6 xl:gap-8 text-sm font-semibold text-[#5c4d41] lg:flex shrink-0">
            {!user && (
              <a href="/#about" className="whitespace-nowrap transition hover:text-[#c1440e]">
                {t('navAbout')}
              </a>
            )}
            <a href="/#temples" className="whitespace-nowrap transition hover:text-[#c1440e]">
              {t('navTemples')}
            </a>

            {/* When logged in: Standard Sevas & My Sevas links */}
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/sevas')}
                  className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
                >
                  <span className="text-[#c1440e]">🪔</span>
                  <span>{language === 'KN' ? 'ಸೇವೆಗಳು' : 'Sevas'}</span>
                </button>
                <button
                  type="button"
                  onClick={onOrders}
                  className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#c1440e] cursor-pointer"
                >
                  <span>📿</span>
                  <span>{t('navMySevas')}</span>
                  {ordersCount > 0 && (
                    <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-[10px] font-bold text-[#c1440e]">
                      {ordersCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                <a href="/#how" className="whitespace-nowrap transition hover:text-[#c1440e]">
                  {t('navHowItWorks')}
                </a>
                <a href="/#trust" className="whitespace-nowrap transition hover:text-[#c1440e]">
                  {t('navTrust')}
                </a>
                <a href="/#faq" className="whitespace-nowrap transition hover:text-[#c1440e]">
                  {t('navFaq')}
                </a>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Switch / Select Temple Pill */}
            {onSwitchTemple && (
              <button
                type="button"
                onClick={onSwitchTemple}
                className="flex items-center gap-1.5 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] px-3 py-1.5 text-xs font-semibold text-[#5c4d41] hover:text-[#c1440e] shadow-2xs transition cursor-pointer shrink-0"
                title={language === 'KN' ? 'ದೇವಾಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select Temple'}
              >
                <span className="text-sm text-[#c1440e]">🛕</span>
                <span className="hidden sm:inline font-bold">
                  {language === 'KN' ? 'ದೇವಾಲಯ ಆಯ್ಕೆ' : 'Select Temple'}
                </span>
                <svg className="h-3 w-3 text-[#8b7a6d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Wishlist quick-link when logged in */}
            {user && onWishlist && (
              <button
                type="button"
                onClick={onWishlist}
                className="relative hidden sm:flex items-center justify-center h-9 w-9 rounded-full border border-[#e0d3c5] bg-white text-[#5c4d41] hover:border-[#c1440e] hover:bg-[#fff9f3] hover:text-[#c1440e] transition cursor-pointer"
                title={t('navFavorites')}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[#c1440e] text-[9px] font-bold text-white shadow-2xs">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Language Switch Button */}
            <button
              type="button"
              onClick={() => setLangModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] px-3 py-1.5 text-xs font-semibold text-[#5c4d41] hover:text-[#c1440e] shadow-2xs transition cursor-pointer shrink-0"
              aria-label="Change Language"
              title={language === 'EN' ? 'Change Language (Switch to ಕನ್ನಡ)' : 'Change Language (Switch to English)'}
            >
              <span className="text-sm">🌐</span>
              <span className="font-bold">{language === 'EN' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            {/* User Account / Profile Menu Pill */}
            {user ? (
              <button
                type="button"
                onClick={() => setSideMenuOpen(true)}
                className="group flex items-center gap-2 rounded-full border border-[#e0d3c5] bg-white hover:border-[#c1440e] hover:bg-[#fff9f3] pl-1 pr-3 py-1 text-xs font-bold text-[#34251e] shadow-2xs transition hover:shadow-xs cursor-pointer shrink-0"
                aria-label="Open profile menu"
                title={`${user.name} - Profile & Menu`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-[11px] font-bold text-white shadow-2xs">
                  {getInitials(user.name)}
                </span>
                <span className="font-semibold text-[#34251e] group-hover:text-[#c1440e] transition-colors max-w-[120px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <svg
                  className="h-3.5 w-3.5 text-[#8b7a6d] group-hover:text-[#c1440e] transition-transform group-hover:translate-y-0.5"
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
        onSwitchTemple={onSwitchTemple}
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
