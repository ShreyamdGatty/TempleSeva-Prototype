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
  selectedTemple?: Temple
  onWishlist?: () => void
  onDevoteeDetails?: () => void
  onProfile: () => void
  onLogout: () => void
  onOrders?: () => void
  onOpenQrPass?: () => void
  onSwitchTemple?: () => void
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
  onLogin,
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

  // Drawer is only available for authenticated users
  if (!isOpen || !user) return null

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
        className="relative flex h-full w-full max-w-[375px] sm:max-w-[395px] flex-col justify-between overflow-hidden bg-white shadow-2xl transition-all duration-300"
        style={{
          zIndex: 1000000,
          boxShadow: '-6px 0 28px rgba(0, 0, 0, 0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* ── 1. BookMyShow Style Header: "Hey!" + Avatar + Edit Profile Link ── */}
          <div className="flex items-center justify-between px-6 pt-6 pb-5 bg-white border-b border-[#f0f0f0]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#222222]">
                {user ? `Hey, ${user.name.split(' ')[0]}!` : 'Hey!'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/profile?tab=profile', { state: { tab: 'profile' } })
                  if (onProfile) onProfile()
                }}
                className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-[#f84464] transition cursor-pointer"
              >
                <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ' : 'Edit Profile'}</span>
                <IonIcon name="chevron-forward-outline" className="text-xs font-bold leading-none" />
              </button>
            </div>

            {/* User Avatar Circle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/profile?tab=profile', { state: { tab: 'profile' } })
                  if (onProfile) onProfile()
                }}
                className="grid h-13 w-13 place-items-center rounded-full bg-[#e4e4e7] text-white shadow-xs cursor-pointer hover:opacity-90 transition"
                aria-label="Profile"
              >
                {user ? (
                  <span className="font-serif text-lg font-bold text-[#444444]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <IonIcon name="person-outline" className="text-2xl text-[#8e8e93]" />
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

          {/* ── 2. BookMyShow Menu List Rows ── */}
          <div className="divide-y divide-[#f2f2f2] bg-white">

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
                      {selectedTemple ? (
                        <span className="rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-2 py-0.5 text-[9px] font-bold text-[#c1440e] truncate max-w-[130px]">
                          {translateTemple(selectedTemple).name}
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#fdf2e9] border border-[#f5cfb5] px-2 py-0.2 text-[9px] font-bold text-[#c1440e]">
                          Sanctuary
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-[#777777] mt-0.5">
                      {language === 'KN' ? 'ಬೇರೆ ಪವಿತ್ರ ಕ್ಷೇತ್ರ ಮತ್ತು ಸೇವೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Change active sacred sanctuary & explore offerings'}
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

            {/* Payment QR Pass */}
            {onOpenQrPass && (
              <div
                onClick={() => {
                  onClose()
                  onOpenQrPass()
                }}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0fdf4] text-[#15803d] shrink-0">
                    <IonIcon name="qr-code-outline" className="text-lg text-[#15803d]" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                        {language === 'KN' ? 'ಪಾವತಿ ಕ್ಯೂಆರ್ ಪಾಸ್ (QR Pass)' : 'Payment QR Pass'}
                      </h4>
                      <span className="rounded-full bg-[#dcfce7] px-1.5 py-0.2 text-[9px] font-black text-[#15803d]">
                        LIVE
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#777777] mt-0.5">
                      {language === 'KN' ? 'ಯಶಸ್ವಿ ಬುಕಿಂಗ್‌ನ ಅಧಿಕೃತ ಪ್ರವೇಶ ಕ್ಯೂಆರ್ ಕೋಡ್' : 'Verified digital pass & booking entry code'}
                    </p>
                  </div>
                </div>
                <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
              </div>
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

            {/* Help & Support */}
            <div
              onClick={() => {
                onClose()
                navigate('/profile?tab=help', { state: { tab: 'help' } })
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5ede2] text-[#5c4d41] shrink-0">
                  <IonIcon name="help-circle-outline" className="text-lg text-[#5c4d41]" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ (Help & Support)' : 'Help & Support'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಅರ್ಚಕರ ಸಹಾಯವಾಣಿ' : 'View commonly asked queries and priest helpline'}
                  </p>
                </div>
              </div>
              <IonIcon name="chevron-forward-outline" className="text-sm text-[#b5b5b5] group-hover:translate-x-0.5 transition" />
            </div>

          </div>
        </div>

        {/* ── 4. BookMyShow Bottom Sticky Sign Out Bar ── */}
        <div className="p-4 bg-white border-t border-[#f0f0f0] shadow-xs">
          {user ? (
            <button
              type="button"
              onClick={() => {
                onClose()
                onLogout()
              }}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#f84464] py-3 text-center text-sm font-bold text-[#f84464] transition hover:bg-[#fff0f3] cursor-pointer"
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
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#f84464] py-3 text-center text-sm font-bold text-white shadow-xs transition hover:bg-[#e03152] cursor-pointer"
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
