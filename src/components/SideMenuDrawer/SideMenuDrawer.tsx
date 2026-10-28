import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { User, Temple } from '../../types'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../IonIcon'

export interface SideMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  wishlistCount?: number
  ordersCount?: number
  selectedTemple?: Temple | null
  onWishlist?: () => void
  onDevoteeDetails?: () => void
  onProfile: () => void
  onLogout: () => void
  onOrders?: () => void
  onOpenQrPass?: () => void
  onSwitchTemple?: () => void
  onSevas?: () => void
  onLogin: () => void
  onRegister?: () => void
}

const SideMenuDrawer = ({
  isOpen,
  onClose,
  user,
  wishlistCount = 0,
  ordersCount = 0,
  selectedTemple,
  onProfile,
  onLogout,
  onOrders,
  onOpenQrPass,
  onSwitchTemple,
  onSevas,
  onLogin,
  onRegister,
}: SideMenuDrawerProps) => {
  const navigate = useNavigate()
  const { language, setLanguage, translateTemple } = useLanguage()

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

  // Drawer opens when isOpen is true
  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 flex justify-end"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <aside
        className="relative flex h-full w-full max-w-[85vw] sm:max-w-[395px] flex-col justify-between overflow-hidden bg-white shadow-2xl transition-all duration-300"
        style={{
          zIndex: 1000000,
          boxShadow: '-6px 0 28px rgba(0, 0, 0, 0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* ── 1. Header: User Info or Guest Welcome ── */}
          <div className="flex items-center justify-between px-6 pt-6 pb-5 bg-white border-b border-[#f0f0f0]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#222222]">
                {user ? `Hey, ${user.name.split(' ')[0]}!` : (language === 'KN' ? 'ನಮಸ್ಕಾರ!' : 'Welcome!')}
              </h2>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate('/profile?tab=profile', { state: { tab: 'profile' } })
                    if (onProfile) onProfile()
                  }}
                  className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-[#c1440e] transition cursor-pointer"
                >
                  <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ' : 'Edit Profile'}</span>
                  <IonIcon name="chevron-forward-outline" className="text-xs font-bold leading-none" />
                </button>
              ) : (
                <p className="mt-1 text-xs text-[#786657]">
                  {language === 'KN' ? 'ಪವಿತ್ರ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ' : 'Explore sacred temple rituals'}
                </p>
              )}
            </div>

            {/* Avatar Circle & Close Button */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    onClose()
                    navigate('/profile?tab=profile', { state: { tab: 'profile' } })
                    if (onProfile) onProfile()
                  } else {
                    onClose()
                    onLogin()
                  }
                }}
                className="grid h-11 w-11 place-items-center rounded-full bg-[#f5ede2] text-[#c1440e] shadow-xs cursor-pointer hover:bg-[#ebdcc9] transition"
                aria-label="Profile"
              >
                {user ? (
                  <span className="font-serif text-base font-bold text-[#c1440e]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <IonIcon name="person-outline" className="text-xl text-[#c1440e]" />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-[#888888] hover:bg-[#f4f4f5] hover:text-[#222222] transition cursor-pointer"
                aria-label="Close"
              >
                <IonIcon name="close-outline" className="text-xl" />
              </button>
            </div>
          </div>

          {/* Guest Action Callout if not logged in */}
          {!user && (
            <div className="p-4 bg-[#fff9f3] border-b border-[#f5e6d6]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onLogin()
                  }}
                  className="flex-1 rounded-xl border border-[#c1440e] py-2 text-xs font-bold text-[#c1440e] hover:bg-white transition cursor-pointer text-center"
                >
                  {language === 'KN' ? 'ಲಾಗಿನ್' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    if (onRegister) onRegister()
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] py-2 text-xs font-bold text-white shadow-xs hover:shadow-sm transition cursor-pointer text-center"
                >
                  {language === 'KN' ? 'ನೋಂದಣಿ' : 'Register'}
                </button>
              </div>
            </div>
          )}

          {/* ── 2. Menu List Rows ── */}
          <div className="divide-y divide-[#f2f2f2] bg-white">
            {/* Guest Navigation Links */}
            {!user && (
              <>
                <a
                  href="/#temples"
                  onClick={(e) => {
                    onClose()
                    if (window.location.pathname === '/' || window.location.pathname === '') {
                      e.preventDefault()
                      document.getElementById('temples')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fafafa] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4eb] text-[#c1440e] shrink-0">
                      <IonIcon name="business-outline" className="text-lg text-[#c1440e]" />
                    </span>
                    <span className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                      {language === 'KN' ? 'ಪವಿತ್ರ ದೇವಾಲಯಗಳು (Temples)' : 'Holy Temples'}
                    </span>
                  </div>
                  <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
                </a>


                <a
                  href="/#why-us"
                  onClick={(e) => {
                    onClose()
                    if (window.location.pathname === '/' || window.location.pathname === '') {
                      e.preventDefault()
                      document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fafafa] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4eb] text-[#c1440e] shrink-0">
                      <IonIcon name="shield-checkmark-outline" className="text-lg text-[#c1440e]" />
                    </span>
                    <span className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                      {language === 'KN' ? 'ನಮ್ಮನ್ನು ಏಕೆ ಆರಿಸಬೇಕು (Why Us)' : 'Why Choose Us'}
                    </span>
                  </div>
                  <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
                </a>

                <a
                  href="/#faq"
                  onClick={(e) => {
                    onClose()
                    if (window.location.pathname === '/' || window.location.pathname === '') {
                      e.preventDefault()
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fafafa] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4eb] text-[#c1440e] shrink-0">
                      <IonIcon name="help-circle-outline" className="text-lg text-[#c1440e]" />
                    </span>
                    <span className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                      {language === 'KN' ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'FAQ'}
                    </span>
                  </div>
                  <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
                </a>

                {/* Payment QR Pass for Guest */}
                {onOpenQrPass && (
                  <div
                    onClick={() => {
                      onClose()
                      onOpenQrPass()
                    }}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-[#fff9f3] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4ec] text-[#c1440e] shrink-0">
                        <IonIcon name="qr-code-outline" className="text-lg text-[#c1440e]" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                            {language === 'KN' ? 'ಪಾವತಿ ಕ್ಯೂಆರ್ ಪಾಸ್ (Payment QR Pass)' : 'Payment QR Pass'}
                          </h4>
                          <span className="rounded-full bg-[#e9f5ed] border border-[#a7f3d0] px-2 py-0.5 text-[9px] font-bold text-[#15803d]">
                            {language === 'KN' ? 'ಸಕ್ರಿಯ / ನಿಷ್ಕ್ರಿಯ' : 'Active & Deactive'}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#777777] mt-0.5">
                          {language === 'KN'
                            ? 'ಸಕ್ರಿಯ ಮತ್ತು ನಿಷ್ಕ್ರಿಯ ಡಿಜಿಟಲ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ವೀಕ್ಷಿಸಿ'
                            : 'View active entry passes & deactive ritual codes'}
                        </p>
                      </div>
                    </div>
                    <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:text-[#c1440e] group-hover:translate-x-0.5 transition" />
                  </div>
                )}
              </>
            )}

            {/* Authenticated User Menu Rows */}
            {user && (
              <>
                {/* Add Devotee (Directly below Profile) */}
                <div
                  onClick={() => {
                    onClose()
                    navigate('/profile?tab=add-devotee', { state: { tab: 'add-devotee' } })
                  }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
                >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff0f3] text-[#f84464] shrink-0">
                  <IonIcon name="person-add-outline" className="text-lg text-[#f84464]" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ (Add Devotee)' : 'Add Devotee'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಕುಟುಂಬ ಸಂಕಲ್ಪ ಹೆಸರುಗಳು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ ಸೇರಿಸಿ' : 'Add family members for sacred temple sankalpa & puja'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Book Sevas (Asks Temple first) */}
            <div
              onClick={() => {
                onClose()
                if (onSevas) {
                  onSevas()
                } else if (onSwitchTemple) {
                  onSwitchTemple()
                } else {
                  navigate('/sevas')
                }
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fff9f3] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4ec] text-[#c1440e] shrink-0">
                  <IonIcon name="flame-outline" className="text-lg text-[#c1440e]" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                    {language === 'KN' ? 'ಸೇವೆಗಳು (Book Sevas)' : 'Book Sevas'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ದೇವಾಲಯ ಆರಿಸಿ ಪವಿತ್ರ ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'Select temple & explore holy offerings'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:text-[#c1440e] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Switch Temple / Sanctuary */}
            {onSwitchTemple && (
              <div
                onClick={() => {
                  onClose()
                  onSwitchTemple()
                }}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#fff9f3] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4ec] text-[#c1440e] shrink-0">
                    <IonIcon name="business-outline" className="text-lg text-[#c1440e]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                        {language === 'KN' ? 'ದೇವಾಲಯ ಬದಲಾಯಿಸಿ (Switch Temple)' : 'Switch Temple'}
                      </h4>
                      {selectedTemple && (
                        <span className="rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-2 py-0.5 text-[9px] font-bold text-[#c1440e] truncate max-w-[130px]">
                          {translateTemple(selectedTemple).name}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-[#777777] mt-0.5">
                      {language === 'KN' ? 'ಬೇರೆ ಪವಿತ್ರ ಕ್ಷೇತ್ರ ಮತ್ತು ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Change active temple & explore offerings'}
                    </p>
                  </div>
                </div>
                <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:text-[#c1440e] group-hover:translate-x-0.5 transition" />
              </div>
            )}

            {/* Your Orders (My Sevas) */}
            <div
              onClick={() => {
                onClose()
                if (onOrders) onOrders()
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5ede2] text-[#5c4d41] shrink-0">
                  <IonIcon name="receipt-outline" className="text-lg text-[#5c4d41]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                      {language === 'KN' ? 'ನಿಮ್ಮ ಸೇವೆಗಳು (Your Orders)' : 'Your Orders'}
                    </h4>
                    {ordersCount > 0 && (
                      <span className="rounded-full bg-[#e9f5ed] px-2 py-0.5 text-[10px] font-bold text-[#28724d]">
                        {ordersCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಬುಕಿಂಗ್‌ಗಳು ಮತ್ತು ಸೇವಾ ಸ್ಥಿತಿ ವೀಕ್ಷಿಸಿ' : 'View all your bookings & purchases'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Payment QR Pass (Active & Deactive QR Codes) */}
            {onOpenQrPass && (
              <div
                onClick={() => {
                  onClose()
                  onOpenQrPass()
                }}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#fff9f3] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4ec] text-[#c1440e] shrink-0">
                    <IonIcon name="qr-code-outline" className="text-lg text-[#c1440e]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#c1440e] transition">
                        {language === 'KN' ? 'ಪಾವತಿ ಕ್ಯೂಆರ್ ಪಾಸ್ (Payment QR Pass)' : 'Payment QR Pass'}
                      </h4>
                      <span className="rounded-full bg-[#e9f5ed] border border-[#a7f3d0] px-2 py-0.5 text-[9px] font-bold text-[#15803d]">
                        {language === 'KN' ? 'ಸಕ್ರಿಯ / ನಿಷ್ಕ್ರಿಯ' : 'Active & Deactive'}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#777777] mt-0.5">
                      {language === 'KN'
                        ? 'ಸಕ್ರಿಯ ಮತ್ತು ನಿಷ್ಕ್ರಿಯ ಡಿಜಿಟಲ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ವೀಕ್ಷಿಸಿ'
                        : 'View active entry passes & deactive ritual codes'}
                    </p>
                  </div>
                </div>
                <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:text-[#c1440e] group-hover:translate-x-0.5 transition" />
              </div>
            )}

            {/* Your Wishlist */}
            <div
              onClick={() => {
                onClose()
                navigate('/profile?tab=wishlist', { state: { tab: 'wishlist' } })
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626] shrink-0">
                  <IonIcon name="heart-outline" className="text-lg text-[#dc2626]" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                      {language === 'KN' ? 'ನಿಮ್ಮ ಮೆಚ್ಚಿನವುಗಳು (Your Wishlist)' : 'Your Wishlist'}
                    </h4>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-[#fde8e8] px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಉಳಿಸಿದ ಪವಿತ್ರ ದೇವಾಲಯ ಸೇವೆಗಳು' : 'Saved ritual offerings & sacred temples'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Devotee List / Family Sankalpa */}
            <div
              onClick={() => {
                onClose()
                navigate('/profile?tab=devotee-list', { state: { tab: 'devotee-list' } })
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5ede2] text-[#5c4d41] shrink-0">
                  <IonIcon name="people-outline" className="text-lg text-[#5c4d41]" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ (Devotee List)' : 'Devotee List'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಕುಟುಂಬ ಸಂಕಲ್ಪ ಹೆಸರುಗಳು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ' : 'Family sankalpa names, nakshatra & gotra'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
            </div>


            </>
            )}

            {/* Change Language Row */}
            <div className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition group border-t border-[#f2f2f2]">
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fdf2e9] text-[#c1440e] shrink-0">
                  <IonIcon name="globe-outline" className="text-lg text-[#c1440e]" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222]">
                    {language === 'KN' ? 'ಭಾಷೆ ಬದಲಾಯಿಸಿ' : 'Change Language'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಪ್ರಸ್ತುತ: ಕನ್ನಡ' : 'Current: English'}
                  </p>
                </div>
              </div>

              {/* Two Rectangle Boxes in Theme Color */}
              <div className="flex items-center gap-1.5 rounded-xl bg-[#f5ede2] p-1 border border-[#eadfd1] shrink-0">
                <button
                  type="button"
                  onClick={() => setLanguage('EN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'EN'
                      ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-xs'
                      : 'text-[#674f40] hover:text-[#c1440e] hover:bg-white/70'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('KN')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === 'KN'
                      ? 'bg-gradient-to-r from-[#c1440e] to-[#df5619] text-white shadow-xs'
                      : 'text-[#674f40] hover:text-[#c1440e] hover:bg-white/70'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── 4. Bottom Sticky Sign In / Sign Out Bar ── */}
        <div className="p-4 bg-white border-t border-[#f0f0f0] shadow-xs">
          {user ? (
            <button
              type="button"
              onClick={() => {
                onClose()
                onLogout()
              }}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#c1440e] py-3 text-center text-sm font-bold text-[#c1440e] transition hover:bg-[#fff9f3] cursor-pointer"
            >
              <IonIcon name="log-out-outline" className="text-lg" />
              <span>{language === 'KN' ? 'ನಿರ್ಗಮಿಸಿ (Sign out)' : 'Sign out'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose()
                onLogin()
              }}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#c1440e] to-[#df5619] py-3 text-center text-sm font-bold text-white shadow-xs transition hover:opacity-95 cursor-pointer"
            >
              <IonIcon name="log-in-outline" className="text-lg" />
              <span>{language === 'KN' ? 'ಲಾಗಿನ್ ಮಾಡಿ (Sign in)' : 'Sign in'}</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default SideMenuDrawer
