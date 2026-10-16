import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { User } from '../../types'
import { useLanguage } from '../../contexts/LanguageContext'

export interface SideMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  wishlistCount?: number
  ordersCount?: number
  onWishlist: () => void
  onDevoteeDetails: () => void
  onProfile: () => void
  onLogout: () => void
  onOrders?: () => void
  onOpenQrPass?: () => void
  onLogin: () => void
  onRegister: () => void
}

const SideMenuDrawer = ({
  isOpen,
  onClose,
  user,
  wishlistCount = 0,
  ordersCount = 0,
  onWishlist,
  onDevoteeDetails,
  onProfile,
  onLogout,
  onOrders,
  onOpenQrPass,
  onLogin,
}: SideMenuDrawerProps) => {
  const { language } = useLanguage()

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
                  onProfile()
                }}
                className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-[#f84464] transition cursor-pointer"
              >
                <span>{language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ' : 'Edit Profile'}</span>
                <span className="text-sm font-bold leading-none">›</span>
              </button>
            </div>

            {/* User Avatar Circle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onProfile()
                }}
                className="grid h-13 w-13 place-items-center rounded-full bg-[#e4e4e7] text-white shadow-xs cursor-pointer hover:opacity-90 transition"
                aria-label="Profile"
              >
                {user ? (
                  <span className="font-serif text-lg font-bold text-[#444444]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg
                    className="h-7 w-7 text-[#8e8e93]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-[#888888] hover:bg-[#f4f4f5] hover:text-[#222222] transition cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* ── 2. BookMyShow Menu List Rows ── */}
          <div className="divide-y divide-[#f2f2f2] bg-white">

            {/* Add Devotee (Directly below Profile) */}
            <div
              onClick={() => {
                onClose()
                onDevoteeDetails()
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#f84464] text-lg w-5 text-center font-bold">➕</span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಭಕ್ತರ ವಿವರ ಸೇರಿಸಿ (Add Devotee)' : 'Add Devotee'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಕುಟುಂಬ ಸಂಕಲ್ಪ ಹೆಸರುಗಳು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ ಸೇರಿಸಿ' : 'Add family members for sacred temple sankalpa & puja'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
            </div>

            {/* Your Orders (My Sevas) */}
            <div
              onClick={() => {
                onClose()
                if (onOrders) onOrders()
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#333333] text-lg w-5 text-center">🛍️</span>
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
              <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
            </div>

            {/* Your Wishlist */}
            <div
              onClick={() => {
                onClose()
                onWishlist()
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#333333] text-lg w-5 text-center">🤍</span>
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
              <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
            </div>

            {/* Devotee List / Family Sankalpa */}
            <div
              onClick={() => {
                onClose()
                onDevoteeDetails()
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#333333] text-lg w-5 text-center">📿</span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಭಕ್ತರ ಪಟ್ಟಿ (Devotee List)' : 'Devotee List'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಕುಟುಂಬ ಸಂಕಲ್ಪ ಹೆಸರುಗಳು, ನಕ್ಷತ್ರ ಮತ್ತು ಗೋತ್ರ' : 'Family sankalpa names, nakshatra & gotra'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
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
                <div className="flex items-center gap-4">
                  <span className="text-[#333333] text-lg w-5 text-center">📱</span>
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
                <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
              </div>
            )}

            {/* Help & Support */}
            <div
              onClick={() => {
                onClose()
                window.location.hash = 'faq'
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#333333] text-lg w-5 text-center">💬</span>
                <div>
                  <h4 className="text-sm font-semibold text-[#222222] group-hover:text-[#f84464] transition">
                    {language === 'KN' ? 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ (Help & Support)' : 'Help & Support'}
                  </h4>
                  <p className="text-[11.5px] text-[#777777] mt-0.5">
                    {language === 'KN' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಅರ್ಚಕರ ಸಹಾಯವಾಣಿ' : 'View commonly asked queries and priest helpline'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#b5b5b5] group-hover:translate-x-0.5 transition">›</span>
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
              className="w-full rounded-xl border border-[#f84464] py-3 text-center text-sm font-bold text-[#f84464] transition hover:bg-[#fff0f3] cursor-pointer"
            >
              {language === 'KN' ? 'ನಿರ್ಗಮಿಸಿ (Sign out)' : 'Sign out'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose()
                onLogin()
              }}
              className="w-full rounded-xl bg-[#f84464] py-3 text-center text-sm font-bold text-white shadow-xs transition hover:bg-[#e03152] cursor-pointer"
            >
              {language === 'KN' ? 'ಲಾಗಿನ್ ಮಾಡಿ (Sign in)' : 'Sign in'}
            </button>
          )}
        </div>
      </aside>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default SideMenuDrawer
