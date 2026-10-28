import { useState, useEffect } from 'react'
import type { User } from '../../types'
import { STORAGE_USER, STORAGE_TEMPLE } from '../../data'
import { readJson } from '../../utils/storage'
import { passwordStrength, strengthLabels, strengthColors } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface AuthModalProps {
  mode: 'login' | 'register'
  registeredUser: User | null
  onRegister: (user: User) => void
  onLogin: (user: User) => void
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

/**
 * Geometric Floating Spheres & Rings Vector Artwork
 * Harmonized with Temple Seva's sacred theme colors:
 * Saffron (#df5619), Terracotta (#c1440e), Vedic Crimson (#931c26), and Golden Sandalwood (#d4a64a / #f2c778).
 */
const WelcomeIllustration = () => (
  <svg
    viewBox="0 0 360 440"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      {/* Saffron to Deep Temple Maroon Gradient */}
      <linearGradient id="themeSphereGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#df5619" />
        <stop offset="55%" stopColor="#931c26" />
        <stop offset="100%" stopColor="#3c0d12" />
      </linearGradient>

      {/* Fiery Vermilion to Deep Terracotta Gradient */}
      <linearGradient id="themeSphereGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f57c00" />
        <stop offset="60%" stopColor="#c1440e" />
        <stop offset="100%" stopColor="#63141b" />
      </linearGradient>

      {/* Sacred Golden Sandalwood to Crimson Ring Gradient */}
      <linearGradient id="themeRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4a64a" />
        <stop offset="50%" stopColor="#c1440e" />
        <stop offset="100%" stopColor="#7a141e" />
      </linearGradient>

      {/* Saffron Amber Ring Gradient */}
      <linearGradient id="themeRingGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f2c778" />
        <stop offset="100%" stopColor="#c1440e" />
      </linearGradient>
    </defs>

    {/* Top Ring */}
    <circle
      cx="230"
      cy="0"
      r="32"
      fill="none"
      stroke="url(#themeRingGrad1)"
      strokeWidth="11"
    />

    {/* Top-Right Big Sphere */}
    <circle
      cx="340"
      cy="70"
      r="70"
      fill="url(#themeSphereGrad1)"
    />

    {/* Small floating sphere top-left */}
    <circle
      cx="215"
      cy="65"
      r="13"
      fill="url(#themeSphereGrad2)"
    />

    {/* Medium sphere middle-left */}
    <circle
      cx="245"
      cy="145"
      r="34"
      fill="url(#themeSphereGrad1)"
    />

    {/* Tiny dot near center-right */}
    <circle
      cx="305"
      cy="170"
      r="7"
      fill="url(#themeSphereGrad2)"
    />

    {/* Ring on right edge */}
    <circle
      cx="355"
      cy="200"
      r="28"
      fill="none"
      stroke="url(#themeRingGrad1)"
      strokeWidth="10"
    />

    {/* Tiny dot below Welcome */}
    <circle
      cx="212"
      cy="265"
      r="7"
      fill="url(#themeSphereGrad2)"
    />

    {/* Sphere bottom-right */}
    <circle
      cx="300"
      cy="285"
      r="30"
      fill="url(#themeSphereGrad1)"
    />

    {/* Soft Golden Sandalwood dot */}
    <circle
      cx="260"
      cy="325"
      r="7"
      fill="#f8d07e"
    />

    {/* Bottom Ring */}
    <circle
      cx="220"
      cy="400"
      r="34"
      fill="none"
      stroke="url(#themeRingGrad2)"
      strokeWidth="11"
    />

    {/* Tiny dot at bottom-right corner */}
    <circle
      cx="330"
      cy="405"
      r="7"
      fill="url(#themeSphereGrad2)"
    />
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

  const remembered = readJson<{ email?: string; password?: string } | null>('temple-seva.remembered', null)
  const savedUser = registeredUser || readJson<User | null>(STORAGE_USER, null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState(() => remembered?.email || savedUser?.email || '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState(() => remembered?.password || savedUser?.password || '')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Sync credentials on opening or switching to login mode
  useEffect(() => {
    if (mode === 'login') {
      const curRemembered = readJson<{ email?: string; password?: string } | null>('temple-seva.remembered', null)
      const curSaved = registeredUser || readJson<User | null>(STORAGE_USER, null)
      const emailToUse = curRemembered?.email || curSaved?.email || ''
      const pwToUse = curRemembered?.password || curSaved?.password || ''
      if (emailToUse && !email) setEmail(emailToUse)
      if (pwToUse && !password) setPassword(pwToUse)
    }
  }, [mode, registeredUser])

  const strength = passwordStrength(password)

  const submitLogin = () => {
    setError('')
    const trimmedInput = email.trim().toLowerCase()
    if (!trimmedInput || password.length < 6) {
      setError(
        isKn
          ? 'ಮಾನ್ಯವಾದ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್ ಮತ್ತು ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
          : 'Enter a valid username or email and a password with at least 6 characters.'
      )
      return
    }

    const saved = registeredUser || readJson<User | null>(STORAGE_USER, null)
    const allUsers = readJson<User[]>('temple-seva.users_list', [])

    // Check if matching registeredUser or any account in allUsers by email OR name/username
    let matchedUser: User | null = null
    if (
      saved &&
      (saved.email?.trim().toLowerCase() === trimmedInput ||
        saved.name?.trim().toLowerCase() === trimmedInput) &&
      saved.password === password
    ) {
      matchedUser = saved
    } else {
      matchedUser =
        allUsers.find(
          (u) =>
            (u.email?.trim().toLowerCase() === trimmedInput ||
              u.name?.trim().toLowerCase() === trimmedInput) &&
            u.password === password
        ) || null
    }

    // Default recognized account fallback if not yet initialized in storage
    if (
      !matchedUser &&
      (trimmedInput === 'shreyamd2002@gmail.com' ||
        trimmedInput === 'shreya' ||
        trimmedInput === 'shreya gatty') &&
      (password === 'password123' || password === saved?.password)
    ) {
      matchedUser = {
        name: saved?.name || 'Shreya Gatty',
        email: 'shreyamd2002@gmail.com',
        password: password,
        phone: saved?.phone || '+91 94800 12345',
      }
    }

    if (!matchedUser) {
      setError(
        isKn
          ? 'ತಪ್ಪಾದ ಬಳಕೆದಾರ ಹೆಸರು/ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ಅಗತ್ಯವಿದ್ದರೆ ಮೊದಲು ನೋಂದಾಯಿಸಿ.'
          : 'Incorrect username/email or password. Please register first if needed.'
      )
      return
    }

    // Save remembered credentials if enabled
    if (rememberMe) {
      window.localStorage.setItem(
        'temple-seva.remembered',
        JSON.stringify({ email: matchedUser.email, password: matchedUser.password })
      )
    } else {
      window.localStorage.removeItem('temple-seva.remembered')
    }

    window.localStorage.setItem(STORAGE_USER, JSON.stringify(matchedUser))
    onLogin(matchedUser)
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

    // Save user to storage and registered users list
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    const users = readJson<User[]>('temple-seva.users_list', [])
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    )
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    window.localStorage.setItem('temple-seva.users_list', JSON.stringify(users))

    window.sessionStorage.setItem('temple-seva.isNewUserRegistered', 'true')
    window.localStorage.setItem('temple-seva.mustSelectTemple', 'true')
    window.localStorage.removeItem(STORAGE_TEMPLE)
    
    // Register the user
    onRegister(user)

    // After successful registration, navigate to the Login page with a success message
    setSuccess(
      isKn
        ? 'ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.'
        : 'Registration successful! Please log in to continue.'
    )
    setError('')
    onSwitchMode('login')
  }

  const handleForgotPassword = () => {
    if (!forgotEmail.includes('@')) return
    setForgotSent(true)
  }

  /* ── 1. Forgot Password Modal View (Themed) ── */
  if (forgotMode) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-7 sm:p-9 shadow-2xl border border-[#eadfd1] animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#34251e] tracking-tight">
                {t('resetPasswordTitle')}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#786657] leading-relaxed">
                {forgotSent
                  ? isKn
                    ? 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್‌ಗಾಗಿ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.'
                    : 'Check your email for a password reset link.'
                  : t('resetPasswordSub')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-[#fdfaf5] hover:bg-[#f5ede2] text-[#705a4d] flex items-center justify-center text-lg font-bold transition cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {forgotSent ? (
            <div className="mt-6 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] p-5 text-center">
              <span className="text-3xl text-emerald-600">✓</span>
              <p className="mt-2 text-sm font-semibold text-emerald-800">
                {isKn ? `ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ: ${forgotEmail}` : `Reset link sent to ${forgotEmail}`}
              </p>
              <p className="mt-1 text-xs text-emerald-600">({t('demoNotice')})</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <input
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-[#fdfaf5] rounded-md px-4 py-3 text-xs sm:text-sm text-[#2d1b14] border border-[#eadfd1] placeholder-[#9e8c80] focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
                type="email"
                placeholder={t('emailPlaceholder')}
              />

              <button
                onClick={handleForgotPassword}
                className="w-full py-2.5 sm:py-3 rounded-md bg-gradient-to-r from-[#df5619] via-[#c1440e] to-[#8b1e2a] hover:from-[#e86022] hover:to-[#731620] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md transition cursor-pointer"
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
            className="mt-6 w-full text-center text-xs sm:text-sm font-semibold text-[#c1440e] hover:text-[#8b1e2a] transition cursor-pointer"
          >
            ← {t('backToLoginBtn')}
          </button>
        </div>
      </div>
    )
  }

  /* ── 2. Main Login / Register Card in Temple Theme Colors ── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Decorative Warm Temple Aura in background */}
      <div className="pointer-events-none fixed top-10 left-10 h-72 w-72 rounded-full bg-[#c1440e]/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-10 right-10 h-80 w-80 rounded-full bg-[#f59e0b]/15 blur-3xl -z-10" />

      {/* Centered Card (Compact Form on Mobile, Horizontal Split on Desktop) */}
      <div
        className="relative w-full max-w-[440px] md:max-w-[780px] bg-white rounded-xl sm:rounded-2xl shadow-[0_25px_60px_rgba(35,18,11,0.35)] border border-[#eadfd1]/70 overflow-hidden my-auto animate-scale-in flex flex-col md:flex-row min-h-0 md:min-h-[460px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 h-7 w-7 rounded-full bg-[#fdfaf5] hover:bg-[#f5ede2] text-[#705a4d] hover:text-[#2c170e] flex items-center justify-center text-base font-bold transition shadow-2xs cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        {/* ── LEFT PANEL: Form with Sacred Saffron to Deep Temple Maroon Gradient ── */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-[#df5619] via-[#9e2226] to-[#2a0e10] p-5 sm:p-8 md:p-10 flex flex-col justify-center text-white relative z-10">
          <div>
            {/* Header: "Log in" or "Sign Up" */}
            <h2 className="text-xl sm:text-[28px] font-semibold text-white tracking-tight text-center mb-5 sm:mb-7">
              {mode === 'login'
                ? isKn ? 'ಲಾಗಿನ್' : 'Log in'
                : isKn ? 'ಸೈನ್ ಅಪ್' : 'Sign Up'}
            </h2>

            {/* Error Message */}
            {error && (
              <p className="mb-4 text-xs font-semibold text-[#fef2f2] bg-black/40 border border-white/20 rounded-md p-2.5 text-center">
                {error}
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="mb-4 text-xs font-semibold text-emerald-100 bg-emerald-900/40 border border-emerald-400/30 rounded-md p-2.5 text-center">
                ✓ {success}
              </p>
            )}

            {/* Form Inputs (Crisp white rounded rectangular fields) */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Full Name (Register Mode Only) */}
              {mode === 'register' && (
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white rounded-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:ring-2 focus:ring-[#f2c778] transition shadow-sm"
                    placeholder={isKn ? 'ಪೂರ್ಣ ಹೆಸರು' : 'full name'}
                  />
                </div>
              )}

              {/* Phone (Register Mode Only) */}
              {mode === 'register' && (
                <div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white rounded-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:ring-2 focus:ring-[#f2c778] transition shadow-sm"
                    type="tel"
                    placeholder={isKn ? 'ದೂರವಾಣಿ (ಐಚ್ಛಿಕ)' : 'phone (optional)'}
                  />
                </div>
              )}

              {/* Username / Email Field */}
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:ring-2 focus:ring-[#f2c778] transition shadow-sm"
                  type={mode === 'login' ? 'text' : 'email'}
                  autoComplete="username"
                  placeholder={
                    mode === 'login'
                      ? isKn ? 'ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಇಮೇಲ್' : 'username or email'
                      : isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'email'
                  }
                />
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded-md px-4 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:ring-2 focus:ring-[#f2c778] transition shadow-sm"
                  type={showPw ? 'text' : 'password'}
                  placeholder={
                    mode === 'register'
                      ? isKn ? 'ಪಾಸ್‌ವರ್ಡ್ (ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು)' : 'password (min. 6 chars)'
                      : isKn ? 'ಪಾಸ್‌ವರ್ಡ್' : 'password'
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#8c7769] hover:text-[#c1440e] transition cursor-pointer"
                >
                  {showPw ? (isKn ? 'ಮರೆಮಾಡಿ' : 'HIDE') : isKn ? 'ತೋರಿಸಿ' : 'SHOW'}
                </button>
              </div>

              {/* Password Strength Indicator (Register Mode Only) */}
              {mode === 'register' && password.length > 0 && (
                <div className="flex items-center gap-2 px-1 pt-0.5">
                  <div className="flex flex-1 gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          background:
                            i <= strength - 1 ? strengthColors[strength] : 'rgba(255,255,255,0.3)',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[11px] font-bold text-white drop-shadow-sm"
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}

              {/* Confirm Password & Terms (Register Mode Only) */}
              {mode === 'register' && (
                <>
                  <div>
                    <input
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full bg-white rounded-md px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2d1b14] placeholder-[#9e8c80] focus:outline-none focus:ring-2 focus:ring-[#f2c778] transition shadow-sm"
                      type="password"
                      placeholder={isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ' : 'confirm password'}
                    />
                  </div>
                  <label className="flex items-start gap-2 px-1 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 accent-[#df5619]"
                    />
                    <span className="text-[11px] text-white/90 leading-tight">
                      {t('termsCheckbox')}
                    </span>
                  </label>
                </>
              )}
            </div>

            {/* Forgot your password? (Right-aligned in theme amber-white) */}
            {mode === 'login' && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-[11px] sm:text-xs text-white/85 hover:text-[#f2c778] transition cursor-pointer"
                >
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot your password?'}
                </button>
              </div>
            )}

            {/* Centered Action Button in Theme Saffron Gradient */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={mode === 'login' ? submitLogin : submitRegister}
                className="px-10 py-2.5 sm:py-3 rounded-md bg-gradient-to-r from-[#df5619] via-[#c1440e] to-[#8b1e2a] hover:from-[#e86022] hover:to-[#731620] active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide shadow-[0_4px_16px_rgba(193,68,14,0.35)] hover:shadow-lg transition-all cursor-pointer min-w-[140px]"
              >
                {mode === 'login'
                  ? isKn ? 'ಲಾಗಿನ್' : 'Log in'
                  : isKn ? 'ಸೈನ್ ಅಪ್' : 'Sign Up'}
              </button>
            </div>

            {/* Switch Mode: "Don't have any account? Sign Up" */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  onSwitchMode(mode === 'login' ? 'register' : 'login')
                  setError('')
                  setSuccess('')
                }}
                className="text-xs text-white/90 hover:text-[#f2c778] transition cursor-pointer"
              >
                {mode === 'login' ? (
                  <>
                    <span>{isKn ? 'ಖಾತೆ ಇಲ್ಲವೇ? ' : "Don't have any account? "}</span>
                    <span className="font-bold underline ml-1 text-[#fceddc] hover:text-[#f2c778]">
                      {isKn ? 'ಸೈನ್ ಅಪ್' : 'Sign Up'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{isKn ? 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ' : 'Already have an account? '}</span>
                    <span className="font-bold underline ml-1 text-[#fceddc] hover:text-[#f2c778]">
                      {isKn ? 'ಲಾಗಿನ್' : 'Log in'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Pure White with Themed Geometric Spheres & "WELCOME !" (Desktop only) ── */}
        <div className="hidden md:flex md:w-1/2 bg-white relative flex-col justify-center items-center p-8 sm:p-12 overflow-hidden min-h-[460px] select-none">
          {/* Floating Spheres & Rings Vector Illustration in Temple Palette */}
          <WelcomeIllustration />

          {/* Centered Hero Greeting in Sacred Terracotta */}
          <div className="relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#c1440e] drop-shadow-xs">
              {isKn ? 'ಸ್ವಾಗತ !' : 'WELCOME !'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#786657] font-medium">
              {mode === 'login'
                ? isKn ? 'ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಮಾಡಿ' : 'Log in to continue'
                : isKn ? 'ಮುಂದುವರಿಯಲು ನೋಂದಾಯಿಸಿ' : 'Sign up to continue'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
