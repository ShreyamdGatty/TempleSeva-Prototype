import { useState } from 'react'
import type { User } from '../../types'
import { STORAGE_USER, STORAGE_TEMPLE } from '../../data'
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

const AuthModal = ({ mode, registeredUser, onRegister, onLogin, onClose, onSwitchMode }: AuthModalProps) => {
  const { t, language } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
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
      setError(language === 'KN' ? 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ಮತ್ತು ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' : 'Enter a valid email and a password with at least 6 characters.')
      return
    }
    if (!registeredUser || registeredUser.email !== email.trim().toLowerCase() || registeredUser.password !== password) {
      setError(language === 'KN' ? 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ಅಗತ್ಯವಿದ್ದರೆ ಮೊದಲು ನೋಂದಾಯಿಸಿ.' : 'Incorrect email or password. Please register first if needed.')
      return
    }
    onLogin(registeredUser)
  }

  const submitRegister = () => {
    setError('')
    if (!name.trim()) { setError(language === 'KN' ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Enter your full name.'); return }
    if (!email.includes('@')) { setError(language === 'KN' ? 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.' : 'Enter a valid email address.'); return }
    if (password.length < 6) { setError(language === 'KN' ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Password must be at least 6 characters.'); return }
    if (password !== confirmPw) { setError(language === 'KN' ? 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : 'Passwords do not match.'); return }
    if (!agreeTerms) { setError(t('termsRequiredError')); return }

    const user: User = { name: name.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim() || undefined }
    if (registeredUser?.email === user.email) {
      setError(language === 'KN' ? 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ.' : 'This email is already registered. Please log in.')
      return
    }
    window.localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    window.sessionStorage.setItem('temple-seva.isNewUserRegistered', 'true')
    window.localStorage.removeItem(STORAGE_TEMPLE)
    setSuccess(language === 'KN' ? 'ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲ್ಪಟ್ಟಿದೆ! ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...' : 'Account created successfully! Logging you in...')
    onRegister(user)
    setTimeout(() => {
      onLogin(user)
    }, 1000)
  }

  const handleForgotPassword = () => {
    if (!forgotEmail.includes('@')) return
    setForgotSent(true)
  }

  /* ── Forgot Password View ── */
  if (forgotMode) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between">
            <div>
              <p className="text-2xl text-[#c1440e]">✦</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">{t('resetPasswordTitle')}</h2>
              <p className="mt-2 text-sm text-[#8b7a6d]">
                {forgotSent
                  ? (language === 'KN' ? 'ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್‌ಗಾಗಿ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ.' : 'Check your email for a reset link.')
                  : t('resetPasswordSub')}
              </p>
            </div>
            <button onClick={onClose} className="modal-close" aria-label="Close">×</button>
          </div>

          {forgotSent ? (
            <div className="mt-6 rounded-xl bg-[#e9f5ed] p-5 text-center">
              <span className="text-3xl text-[#28724d]">✓</span>
              <p className="mt-2 text-sm font-semibold text-[#28724d]">
                {language === 'KN' ? `ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ: ${forgotEmail}` : `Reset link sent to ${forgotEmail}`}
              </p>
              <p className="mt-1 text-xs text-[#8b7a6d]">({t('demoNotice')})</p>
            </div>
          ) : (
            <input
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="input-field mt-6"
              type="email"
              placeholder={t('emailPlaceholder')}
            />
          )}

          {!forgotSent && (
            <button onClick={handleForgotPassword} className="btn-primary mt-4 w-full cursor-pointer">
              {t('sendResetLinkBtn')}
            </button>
          )}

          <button onClick={() => { setForgotMode(false); setForgotSent(false) }} className="mt-4 w-full text-center text-sm font-semibold text-[#c1440e] cursor-pointer hover:underline">
            {t('backToLoginBtn')}
          </button>
        </div>
      </div>
    )
  }

  /* ── Main Auth View ── */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <p className="text-2xl text-[#c1440e]">✦</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              {mode === 'login' ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p className="mt-2 text-sm text-[#8b7a6d]">
              {mode === 'login' ? t('authSubLogin') : t('authSubRegister')}
            </p>
          </div>
          <button onClick={onClose} className="modal-close cursor-pointer" aria-label="Close">×</button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex rounded-xl bg-[#f5ede2] p-1">
          <button
            onClick={() => { onSwitchMode('login'); setError(''); setSuccess('') }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all cursor-pointer ${mode === 'login' ? 'bg-white text-[#34251e] shadow-sm' : 'text-[#8b7a6d]'}`}
          >
            {t('tabLogin')}
          </button>
          <button
            onClick={() => { onSwitchMode('register'); setError(''); setSuccess('') }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all cursor-pointer ${mode === 'register' ? 'bg-white text-[#34251e] shadow-sm' : 'text-[#8b7a6d]'}`}
          >
            {t('tabRegister')}
          </button>
        </div>

        {/* Success */}
        {success && (
          <p className="mt-4 rounded-xl bg-[#e9f5ed] p-3 text-sm font-semibold text-[#28724d]">{success}</p>
        )}

        {/* Form */}
        <div className="mt-4 space-y-3">
          {mode === 'register' && (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder={t('fullNamePlaceholder')} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" type="tel" placeholder={t('phoneOptionalPlaceholder')} />
            </>
          )}

          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" type="email" placeholder={t('emailPlaceholder')} />

          {/* Password with toggle */}
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-12"
              type={showPw ? 'text' : 'password'}
              placeholder={mode === 'register' ? `${t('passwordPlaceholder')} (min. 6 chars)` : t('passwordPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8b7a6d] cursor-pointer"
            >
              {showPw ? (language === 'KN' ? 'ಮರೆಮಾಡಿ' : 'HIDE') : (language === 'KN' ? 'ತೋರಿಸಿ' : 'SHOW')}
            </button>
          </div>

          {/* Password strength (register only) */}
          {mode === 'register' && password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{ background: i <= strength - 1 ? strengthColors[strength] : '#e3d7ca' }} />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <input value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="input-field" type="password" placeholder={t('confirmPasswordPlaceholder')} />
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 accent-[#c1440e]" />
                <span className="text-xs text-[#8b7a6d]">
                  {t('termsCheckbox')}
                </span>
              </label>
            </>
          )}
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-[#b54733]">{error}</p>}

        <button onClick={mode === 'login' ? submitLogin : submitRegister} className="btn-primary mt-5 w-full cursor-pointer">
          {mode === 'login' ? t('tabLogin') : t('createAccount')}
        </button>

        {/* Forgot password (login only) */}
        {mode === 'login' && (
          <button onClick={() => setForgotMode(true)} className="mt-3 w-full text-center text-sm font-semibold text-[#c1440e] cursor-pointer hover:underline">
            {t('forgotPassword')}
          </button>
        )}

        {/* Social Login (demo) */}
        <div className="mt-5">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e3d7ca]" />
            <span className="text-xs font-bold text-[#a39384]">{t('orLabel')}</span>
            <div className="h-px flex-1 bg-[#e3d7ca]" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e3d7ca] py-3 text-sm font-semibold transition hover:bg-[#f5ede2] cursor-pointer">
              <span className="text-lg">G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e3d7ca] py-3 text-sm font-semibold transition hover:bg-[#f5ede2] cursor-pointer">
              <span className="text-lg">◉</span> Apple
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[#a39384]">
          {t('demoNotice')}
        </p>
      </div>
    </div>
  )
}

export default AuthModal
