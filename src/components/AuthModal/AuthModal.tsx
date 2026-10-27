import { useState } from 'react'
import type { User } from '../../types'
import { STORAGE_USER, STORAGE_TEMPLE } from '../../data'
import { passwordStrength, strengthLabels, strengthColors } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../IonIcon'

interface AuthModalProps {
  mode: 'login' | 'register'
  registeredUser: User | null
  onRegister: (user: User) => void
  onLogin: (user: User) => void
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

/**
 * Sacred Low-Poly Faceted Mesh SVG in Temple Theme Colors
 * Replaces the blue/purple polygon mesh from the reference image with divine
 * Temple Maroon, Vedic Crimson, Fiery Saffron, and Golden Amber facets.
 */
const SacredLowPolyMesh = () => (
  <svg
    viewBox="0 0 800 650"
    preserveAspectRatio="xMidYMid slice"
    className="w-full h-full select-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="facetShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </linearGradient>
    </defs>

    {/* Row 0 to 1 */}
    <polygon points="0,0 160,0 130,130" fill="#460b13" />
    <polygon points="0,0 130,130 0,150" fill="#3a080f" />
    <polygon points="160,0 330,0 280,140" fill="#5c101c" />
    <polygon points="160,0 280,140 130,130" fill="#6f1523" />
    <polygon points="330,0 490,0 450,120" fill="#841a2a" />
    <polygon points="330,0 450,120 280,140" fill="#751726" />
    <polygon points="490,0 650,0 610,135" fill="#9c212f" />
    <polygon points="490,0 610,135 450,120" fill="#8c1c2b" />
    <polygon points="650,0 800,0 770,125" fill="#b02b33" />
    <polygon points="650,0 770,125 610,135" fill="#a02430" />
    <polygon points="800,0 800,140 770,125" fill="#921f2d" />

    {/* Row 1 to 2 */}
    <polygon points="0,150 130,130 140,290" fill="#4a0d16" />
    <polygon points="0,150 140,290 0,310" fill="#3d0911" />
    <polygon points="130,130 280,140 290,280" fill="#6a1422" />
    <polygon points="130,130 290,280 140,290" fill="#58101a" />
    <polygon points="280,140 450,120 460,270" fill="#8a1c2b" />
    <polygon points="280,140 460,270 290,280" fill="#781827" />
    <polygon points="450,120 610,135 620,285" fill="#a8272f" />
    <polygon points="450,120 620,285 460,270" fill="#99222c" />
    <polygon points="610,135 770,125 780,275" fill="#bf382f" />
    <polygon points="610,135 780,275 620,285" fill="#ae2e2d" />
    <polygon points="770,125 800,140 800,290" fill="#b8332c" />
    <polygon points="770,125 800,290 780,275" fill="#a4282b" />

    {/* Row 2 to 3 - Transitioning to Fiery Saffron & Terracotta */}
    <polygon points="0,310 140,290 120,440" fill="#4d0e17" />
    <polygon points="0,310 120,440 0,460" fill="#400b12" />
    <polygon points="140,290 290,280 270,430" fill="#7a1827" />
    <polygon points="140,290 270,430 120,440" fill="#661320" />
    <polygon points="290,280 460,270 440,420" fill="#9d232a" />
    <polygon points="290,280 440,420 270,430" fill="#8c1e28" />
    <polygon points="460,270 620,285 600,430" fill="#bf3c24" />
    <polygon points="460,270 600,430 440,420" fill="#ae3025" />
    <polygon points="620,285 780,275 760,425" fill="#d44e1a" />
    <polygon points="620,285 760,425 600,430" fill="#c4431e" />
    <polygon points="780,275 800,290 800,440" fill="#c9471b" />
    <polygon points="780,275 800,440 760,425" fill="#df5916" />

    {/* Row 3 to 4 - Transitioning to Warm Saffron & Golden Amber */}
    <polygon points="0,460 120,440 150,650" fill="#541019" />
    <polygon points="0,460 150,650 0,650" fill="#3f0a12" />
    <polygon points="120,440 270,430 300,650" fill="#881c28" />
    <polygon points="120,440 300,650 150,650" fill="#711622" />
    <polygon points="270,430 440,420 460,650" fill="#b33321" />
    <polygon points="270,430 460,650 300,650" fill="#9b2524" />
    <polygon points="440,420 600,430 620,650" fill="#d35417" />
    <polygon points="440,420 620,650 460,650" fill="#c3441a" />
    <polygon points="600,430 760,425 770,650" fill="#e47114" />
    <polygon points="600,430 770,650 620,650" fill="#da6214" />
    <polygon points="760,425 800,440 800,650" fill="#f59e0b" />
    <polygon points="760,425 800,650 770,650" fill="#ea8510" />

    {/* Bottom Right Corner Accent Facet (Rich Amber Gold) */}
    <polygon points="720,530 800,490 800,650" fill="#fbbf24" opacity="0.35" />
    <polygon points="680,590 800,560 800,650" fill="#fde047" opacity="0.25" />

    {/* Subtle Celestial Star Sparkles on Facets */}
    <circle cx="580" cy="90" r="1.5" fill="#fff" opacity="0.8" />
    <circle cx="710" cy="160" r="2" fill="#fff" opacity="0.9" />
    <circle cx="480" cy="210" r="1.5" fill="#fff" opacity="0.75" />
    <circle cx="650" cy="340" r="2.5" fill="#fde047" opacity="0.85" />
    <circle cx="740" cy="480" r="2" fill="#fff" opacity="0.9" />
    <circle cx="390" cy="360" r="1" fill="#fff" opacity="0.6" />
  </svg>
)

const AuthModal = ({
  mode,
  registeredUser,
  onRegister,
  onLogin,
  onClose,
  onSwitchMode,
}: AuthModalProps) => {
  const { t, language } = useLanguage()
  const isKn = language === 'KN'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const strength = passwordStrength(password)

  const submitLogin = () => {
    setError('')
    if (!email.includes('@') || password.length < 6) {
      setError(
        isKn
          ? 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ಮತ್ತು ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
          : 'Enter a valid email and a password with at least 6 characters.'
      )
      return
    }
    if (
      !registeredUser ||
      registeredUser.email !== email.trim().toLowerCase() ||
      registeredUser.password !== password
    ) {
      setError(
        isKn
          ? 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ಅಗತ್ಯವಿದ್ದರೆ ಮೊದಲು ನೋಂದಾಯಿಸಿ.'
          : 'Incorrect email or password. Please register first if needed.'
      )
      return
    }
    onLogin(registeredUser)
  }

  const submitRegister = () => {
    setError('')
    if (!name.trim()) {
      setError(isKn ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Enter your full name.')
      return
    }
    if (!email.includes('@')) {
      setError(isKn ? 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.' : 'Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError(
        isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Password must be at least 6 characters.'
      )
      return
    }
    if (password !== confirmPw) {
      setError(isKn ? 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : 'Passwords do not match.')
      return
    }
    if (!agreeTerms) {
      setError(t('termsRequiredError'))
      return
    }

    const user: User = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim() || undefined,
    }
    if (registeredUser?.email === user.email) {
      setError(
        isKn
          ? 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.'
          : 'This email is already registered. Please log in.'
      )
      return
    }
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    window.sessionStorage.setItem('temple-seva.isNewUserRegistered', 'true')
    window.localStorage.setItem('temple-seva.mustSelectTemple', 'true')
    window.localStorage.removeItem(STORAGE_TEMPLE)
    onRegister(user)
    setSuccess(
      isKn
        ? 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ! ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.'
        : 'Account created successfully! Please log in with your credentials to continue.'
    )
    setPassword('')
    setConfirmPw('')
    onSwitchMode('login')
  }

  const handleForgotPassword = () => {
    if (!forgotEmail.includes('@')) return
    setForgotSent(true)
  }

  /* ── 1. Forgot Password Modal View ── */
  if (forgotMode) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-3xl bg-white border border-[#eadfd1] p-6 sm:p-8 shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#fceddc] text-[#c1440e] text-lg font-bold">
                🪔
              </div>
              <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#2d1b14]">
                {t('resetPasswordTitle')}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#7a6657] leading-relaxed">
                {forgotSent
                  ? isKn
                    ? 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್‌ಗಾಗಿ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.'
                    : 'Check your email for a password reset link.'
                  : t('resetPasswordSub')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-[#f5ede2] text-[#705a4d] hover:bg-[#ebdccd] hover:text-[#2d1b14] flex items-center justify-center text-lg font-bold transition cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {forgotSent ? (
            <div className="mt-6 rounded-2xl bg-[#f0f9f3] border border-[#cbe6d4] p-5 text-center">
              <span className="text-3xl text-emerald-600">✓</span>
              <p className="mt-2 text-sm font-semibold text-[#1f5938]">
                {isKn ? `ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ: ${forgotEmail}` : `Reset link sent to ${forgotEmail}`}
              </p>
              <p className="mt-1 text-xs text-[#6e8576]">({t('demoNotice')})</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="relative">
                <input
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-sm text-[#34251e] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <button
                onClick={handleForgotPassword}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#c1440e] to-[#8b1e2a] hover:from-[#a73507] hover:to-[#731520] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                {t('sendResetLinkBtn')}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setForgotMode(false)
              setForgotSent(false)
            }}
            className="mt-5 w-full text-center text-xs sm:text-sm font-semibold text-[#c1440e] hover:text-[#8b1e2a] transition cursor-pointer hover:underline"
          >
            {t('backToLoginBtn')}
          </button>
        </div>
      </div>
    )
  }

  /* ── 2. Main Diagonal Split Auth Card matching reference image in Sacred Temple Theme ── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Decorative Warm Temple Aura in background */}
      <div className="pointer-events-none fixed top-12 left-12 h-72 w-72 rounded-full bg-[#c1440e]/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-12 right-12 h-80 w-80 rounded-full bg-[#f59e0b]/15 blur-3xl -z-10" />

      {/* Main Card Container */}
      <div
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-white border border-[#eadfd1] shadow-2xl overflow-hidden my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button on top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 text-white md:text-white flex items-center justify-center text-xl font-bold transition shadow-md backdrop-blur-xs cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        {/* ── Mobile-Only Header Banner (with Low-Poly Texture & Diagonal Edge) ── */}
        <div className="block md:hidden relative h-36 overflow-hidden text-white">
          <div className="absolute inset-0 z-0">
            <SacredLowPolyMesh />
          </div>
          <div
            className="absolute inset-0 z-10 flex flex-col justify-end p-5 pb-4 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
            }}
          >
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {mode === 'login'
                ? isKn ? 'ಮರಳಿ ಸ್ವಾಗತ' : 'Welcome Back'
                : isKn ? 'ಸ್ವಾಗತ' : 'Welcome'}
            </h1>
          </div>
        </div>

        {/* ── Desktop Diagonal Split Section (Matching reference with polygon cut) ── */}
        <div
          className="hidden md:block absolute inset-0 z-10 pointer-events-none"
          style={{
            clipPath: 'polygon(40% 0%, 100% 0%, 100% 100%, 86% 100%)',
          }}
        >
          {/* Low-Poly Faceted Mesh Background */}
          <div className="absolute inset-0 z-0">
            <SacredLowPolyMesh />
          </div>

          {/* Right Hero Content inside the polygon: Welcome Back for login / Welcome for register */}
          <div className="absolute top-0 right-0 w-[55%] h-full p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-white pointer-events-auto">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl select-none">
              {mode === 'login' ? (
                <>
                  <span className="block">{isKn ? 'ಮರಳಿ' : 'Welcome'}</span>
                  <span className="block">{isKn ? 'ಸ್ವಾಗತ' : 'Back'}</span>
                </>
              ) : (
                <span className="block text-white drop-shadow-2xl">{isKn ? 'ಸ್ವಾಗತ' : 'Welcome'}</span>
              )}
            </h1>
          </div>
        </div>

        {/* ── Left Form Container (Matching Form in Reference Image) ── */}
        <div className="relative z-20 w-full md:w-[48%] p-6 sm:p-9 lg:p-11 flex flex-col justify-between bg-transparent min-h-[460px]">
          <div>
            {/* Header: "Login" + "Don't have an account? Create your account" */}
            <div className="text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d1b14] tracking-tight">
                {mode === 'login'
                  ? isKn ? 'ಲಾಗಿನ್' : 'Login'
                  : isKn ? 'ನೋಂದಣಿ' : 'Create Account'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#7e695c]">
                {mode === 'login' ? (
                  <>
                    <span>{isKn ? 'ಖಾತೆ ಇಲ್ಲವೇ? ' : "Don't have an account? "}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchMode('register')
                        setError('')
                        setSuccess('')
                      }}
                      className="font-semibold text-[#c1440e] hover:text-[#8b1e2a] hover:underline transition cursor-pointer"
                    >
                      {isKn ? 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ' : 'Create your account'}
                    </button>
                  </>
                ) : (
                  <>
                    <span>{isKn ? 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ' : 'Already have an account? '}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchMode('login')
                        setError('')
                        setSuccess('')
                      }}
                      className="font-semibold text-[#c1440e] hover:text-[#8b1e2a] hover:underline transition cursor-pointer"
                    >
                      {isKn ? 'ಸೈನ್ ಇನ್ ಮಾಡಿ' : 'Sign in'}
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Form Fields (Clean rounded outline boxes matching the reference image) */}
            <div className="mt-6 space-y-3.5">
              {/* Full Name (Register Mode Only) */}
              {mode === 'register' && (
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                    placeholder={t('fullNamePlaceholder')}
                  />
                </div>
              )}

              {/* Phone (Register Mode Only) */}
              {mode === 'register' && (
                <div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                    type="tel"
                    placeholder={t('phoneOptionalPlaceholder')}
                  />
                </div>
              )}

              {/* Username / Email Field */}
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                  type="email"
                  placeholder={mode === 'login' ? (isKn ? 'ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್' : 'Username or Email') : t('emailPlaceholder')}
                />
              </div>

              {/* Password Field with Show/Hide toggle */}
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-16 py-2.5 sm:py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                  type={showPw ? 'text' : 'password'}
                  placeholder={
                    mode === 'register'
                      ? `${t('passwordPlaceholder')} (min. 6 chars)`
                      : isKn ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c7769] hover:text-[#c1440e] cursor-pointer"
                >
                  {showPw ? (isKn ? 'ಮರೆಮಾಡಿ' : 'HIDE') : isKn ? 'ತೋರಿಸಿ' : 'SHOW'}
                </button>
              </div>

              {/* Password Strength Indicator (Register Only) */}
              {mode === 'register' && password.length > 0 && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all"
                        style={{
                          background:
                            i <= strength - 1 ? strengthColors[strength] : '#ebdccd',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: strengthColors[strength] }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}

              {/* Confirm Password & Terms (Register Only) */}
              {mode === 'register' && (
                <>
                  <div>
                    <input
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-[#dfd2c4] bg-[#fffdfa] text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                      type="password"
                      placeholder={t('confirmPasswordPlaceholder')}
                    />
                  </div>
                  <label className="flex items-start gap-2.5 px-1 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-[#c1440e]"
                    />
                    <span className="text-[11px] text-[#786657] leading-tight">
                      {t('termsCheckbox')}
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Remember Me and Forgot Password Row (from reference image) */}
            {mode === 'login' && (
              <div className="mt-3.5 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#6e5d50] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-[#c1440e] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{isKn ? 'ನನ್ನನ್ನು ನೆನಪಿಡಿ' : 'Remember Me'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="font-medium text-[#8a7566] hover:text-[#c1440e] transition cursor-pointer hover:underline"
                >
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot password?'}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="mt-3 text-xs font-bold text-[#b53a27] bg-[#fdf0ed] border border-[#f5cfc7] rounded-xl p-2.5 text-center">
                {error}
              </p>
            )}

            {/* Submit Button ("LOGIN" / "REGISTER") */}
            <div className="mt-6 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={mode === 'login' ? submitLogin : submitRegister}
                className="w-full sm:w-auto min-w-[170px] py-2.5 px-8 rounded-full bg-gradient-to-r from-[#c1440e] via-[#9e2226] to-[#701a23] hover:from-[#a73507] hover:to-[#5e131d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
              >
                {mode === 'login'
                  ? isKn ? 'ಲಾಗಿನ್' : 'LOGIN'
                  : isKn ? 'ನೋಂದಣಿ' : 'REGISTER'}
              </button>
            </div>
          </div>

          {/* ── Social Login Row matching reference image ── */}
          <div className="mt-8 pt-2 flex items-center gap-3">
            <span className="text-xs text-[#8c7a6e] font-medium whitespace-nowrap">
              {mode === 'login'
                ? isKn ? 'ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ' : 'Or login with'
                : isKn ? 'ಅಥವಾ ನೋಂದಾಯಿಸಿ' : 'Or register with'}
            </span>
            <div className="flex items-center gap-2">
              {/* Facebook Pill */}
              <button
                type="button"
                onClick={submitLogin}
                title="Login with Facebook"
                className="h-8 px-3.5 rounded-full bg-[#701a23] hover:bg-[#8b1e2a] text-white font-serif text-sm font-bold flex items-center justify-center transition shadow-2xs hover:scale-105 cursor-pointer"
              >
                f
              </button>

              {/* Google Pill */}
              <button
                type="button"
                onClick={submitLogin}
                title="Login with Google"
                className="h-8 px-3.5 rounded-full bg-[#c1440e] hover:bg-[#d45311] text-white text-xs font-bold flex items-center justify-center transition shadow-2xs hover:scale-105 cursor-pointer"
              >
                G
              </button>

              {/* Phone / OTP Pill */}
              <button
                type="button"
                onClick={submitLogin}
                title="Login with Phone OTP"
                className="h-8 px-3.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold flex items-center gap-1 justify-center transition shadow-2xs hover:scale-105 cursor-pointer"
              >
                <IonIcon name="phone-portrait-outline" />
                <span className="text-[10px] uppercase font-semibold">OTP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
