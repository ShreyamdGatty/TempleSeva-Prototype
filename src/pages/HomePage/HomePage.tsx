import { useState } from 'react'
import { temples, categories } from '../../data'
import { useToast } from '../../contexts/ToastContext'
import { useLanguage } from '../../contexts/LanguageContext'

import type { Temple } from '../../types'

interface HomePageProps {
  navigateToSevas: (temple?: Temple) => void
  onRegister: () => void
  onSelectTempleDirect?: (templeId: string) => void
}

const HomePage = ({ navigateToSevas }: HomePageProps) => {
  const { addToast } = useToast()
  const { language, t, translateTemple, translateCategory } = useLanguage()
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [emailSub, setEmailSub] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailSub.includes('@')) {
      addToast(
        language === 'KN'
          ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter a valid email address.',
        'error'
      )
      return
    }
    addToast(
      language === 'KN'
        ? 'ಪಂಚಾಂಗ ಮತ್ತು ಉತ್ಸವಗಳ ಮಾಹಿತಿಗೆ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ!'
        : 'Subscribed for Panchangam & festival updates!',
      'success'
    )
    setEmailSub('')
  }

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ]

  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          {/* Pulsing Beacon Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5ede2] px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#c1440e] shadow-xs">
            <span className="pulse-beacon" />
            <span>{t('sanctuaryNetwork')}</span>
          </div>

          <h1 className="mt-5 font-serif text-5xl leading-[1.04] sm:text-6xl lg:text-[74px]">
            {t('heroTitlePart1')}
            <br />
            <em className="text-[#c1440e] relative inline-block">
              {t('heroTitlePart2')}
              <span className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-[#c1440e] to-transparent rounded-full opacity-60" />
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#806f61]">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#temples" className="btn-primary sheen-card shadow-lg">
              <span className="animate-diya mr-2">🪔</span>
              {t('heroExploreTemples')}
            </a>
            <button
              onClick={() => navigateToSevas()}
              className="rounded-full border border-[#d9cabb] bg-white px-7 py-3.5 text-sm font-bold shadow-sm transition hover:border-[#c1440e] hover:shadow cursor-pointer"
            >
              {t('heroBookSeva')}
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#eadfd1] pt-8">
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-3xl font-bold text-[#c1440e]">{t('heroStat1Value')}</p>
              <p className="mt-1 text-xs font-semibold text-[#8b7a6d]">{t('heroStat1Label')}</p>
            </div>
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-3xl font-bold text-[#34251e]">{t('heroStat2Value')}</p>
              <p className="mt-1 text-xs font-semibold text-[#8b7a6d]">{t('heroStat2Label')}</p>
            </div>
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-3xl font-bold text-[#d4a64a]">{t('heroStat3Value')}</p>
              <p className="mt-1 text-xs font-semibold text-[#8b7a6d]">{t('heroStat3Label')}</p>
            </div>
          </div>
        </div>

        {/* ── Creative Non-Boxed Hero Temple Visual ── */}
        <div className="relative flex items-center justify-center pt-4 lg:pt-0">
          {/* Spiritual Sunburst Radiance Glow */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#df5619]/25 via-[#f59e0b]/20 to-[#c1440e]/10 blur-3xl -z-10 pointer-events-none" />

          {/* Golden Concentric Sacred Mandala Rings */}
          <div className="animate-mandala absolute h-[460px] w-[460px] max-w-full rounded-full border border-dashed border-[#d4a64a]/35 -z-10 pointer-events-none" />
          <div
            className="animate-spin-slow absolute h-[380px] w-[380px] max-w-full rounded-full border border-[#c1440e]/15 -z-10 pointer-events-none"
            style={{ animationDuration: '40s' }}
          />

          {/* The Sacred Temple Artwork - Organic, Seamless, Non-Boxed */}
          <div className="relative w-full max-w-[500px]">
            {/* The Image seamlessly feathered into the page background */}
            <div
              className="animate-float-hero relative overflow-hidden"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, transparent 95%)',
                maskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, transparent 95%)',
              }}
            >
              <img
                src="/temple-hero.webp"
                alt="Sacred South Indian Temple Sanctum"
                className="w-full h-auto max-h-[460px] object-cover drop-shadow-2xl hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              />
              {/* Soft warm light overlays that organically merge with the page atmosphere */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf6] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fffcf6]/50 via-transparent to-[#fffcf6]/50" />
            </div>

            {/* Floating Devotional Elements (Seamlessly floating around the temple, no card box) */}

            {/* Top Left: Certified Priests Pill */}
            <div className="animate-bounce-subtle absolute -top-4 -left-2 sm:-left-6 flex items-center gap-2.5 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg border border-[#eadfd1] transition hover:scale-105">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdf2e9] text-[#c1440e] text-sm">
                🪔
              </span>
              <div>
                <span className="block text-[11px] font-bold text-[#34251e] leading-tight">
                  {language === 'KN' ? '೧೦೦% ವೈದಿಕ ಪುರೋಹಿತರು' : 'Vedic Priests Certified'}
                </span>
                <span className="block text-[9px] font-semibold text-[#c1440e]">
                  {language === 'KN' ? 'ನೇರ ಗರ್ಭಗುಡಿ ಸಂಕಲ್ಪ' : 'Live Sanctum Sankalpa'}
                </span>
              </div>
            </div>

            {/* Bottom Right: Sacred Prasadam Delivery Pill */}
            <div className="animate-float-hero absolute -bottom-5 -right-2 sm:-right-4 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-[#eadfd1] transition hover:scale-105">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-white text-lg shadow-sm">
                📦
              </span>
              <div>
                <span className="block text-xs font-bold text-[#34251e]">
                  {language === 'KN' ? 'ಪವಿತ್ರ ಪ್ರಸಾದ ಮನೆಬಾಗಿಲಿಗೆ' : 'Sacred Prasadam Delivery'}
                </span>
                <span className="block text-[10px] text-[#806f61] mt-0.5">
                  {language === 'KN' ? 'ಕುಂಕುಮ, ತೀರ್ಥ ಮತ್ತು ರಕ್ಷೆ' : 'Kumkum, Vibhuti & Temple Raksha'}
                </span>
              </div>
            </div>

            {/* Bottom Left: Live Darshan Pill */}
            <div className="absolute bottom-6 -left-2 sm:-left-6 hidden sm:flex items-center gap-2 rounded-full bg-[#2c170e]/90 backdrop-blur-md px-3.5 py-1.5 text-white shadow-lg border border-[#d4a64a]/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#f2c778]">
                {language === 'KN' ? 'ಲೈವ್ ದರ್ಶನ ಲಭ್ಯ' : 'Live Darshan Active'}
              </span>
            </div>

            {/* Floating Sparkle Particles */}
            <span className="particle-1 absolute -top-8 right-10 text-2xl text-[#d4a64a] pointer-events-none">✦</span>
            <span className="particle-2 absolute top-24 -right-6 text-lg text-[#df5619] pointer-events-none">✧</span>
            <span className="particle-3 absolute bottom-20 -left-6 text-xl text-[#f59e0b] pointer-events-none">✦</span>
          </div>
        </div>
      </section>

      {/* ── Creative Sacred Live Blessings Marquee Ticker ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2c170e] via-[#482819] to-[#2c170e] py-3.5 text-white border-y border-[#d4a64a]/30 shadow-md">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-8">
          <span className="flex items-center gap-2">
            <span className="animate-diya text-base">🪔</span> {language === 'KN' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಪುರೋಹಿತರು' : '100% Certified Vedic Priests'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>🕉</span> {language === 'KN' ? 'ವೈಯಕ್ತಿಕ ಹೆಸರು & ಗೋತ್ರ ಸಂಕಲ್ಪ' : 'Personalized Name & Gotra Sankalpa'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>📦</span> {language === 'KN' ? 'ಶುದ್ಧ ಪವಿತ್ರ ಪ್ರಸಾದ ಮನೆ ಬಾಗಿಲಿಗೆ' : 'Pure Temple Prasadam Doorstep Delivery'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span className="animate-diya text-base">🔔</span> {language === 'KN' ? 'ನೇರ ಪೂಜಾ ಫೋಟೋ & ವಿಡಿಯೋ ಮಾಹಿತಿ' : 'Live Puja Photo & Video Blessings'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>✨</span> {language === 'KN' ? '೫೦,೦೦೦+ ಸಫಲ ಸೇವೆಗಳು' : '50,000+ Sacred Offerings Completed'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span className="animate-diya text-base">🪔</span> {language === 'KN' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಪುರೋಹಿತರು' : '100% Certified Vedic Priests'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>🕉</span> {language === 'KN' ? 'ವೈಯಕ್ತಿಕ ಹೆಸರು & ಗೋತ್ರ ಸಂಕಲ್ಪ' : 'Personalized Name & Gotra Sankalpa'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>📦</span> {language === 'KN' ? 'ಶುದ್ಧ ಪವಿತ್ರ ಪ್ರಸಾದ ಮನೆ ಬಾಗಿಲಿಗೆ' : 'Pure Temple Prasadam Doorstep Delivery'}
          </span>
        </div>
      </div>

      {/* ── Seva Categories Showcase ── */}
      <section className="border-b border-[#eadfd1] bg-[#faf4ec] py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                {t('categoriesSub')}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold">{t('categoriesTitle')}</h2>
            </div>
            <button
              onClick={() => navigateToSevas()}
              className="text-sm font-bold text-[#c1440e] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{t('viewAllSevas')}</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories
              .filter((c) => c !== 'All')
              .map((category) => (
                <div
                  key={category}
                  onClick={() => navigateToSevas()}
                  className="group cursor-pointer rounded-2xl border border-[#eadfd1] bg-white p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#c1440e] hover:shadow-xl sheen-card"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#f5ede2] text-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c1440e] group-hover:text-white group-hover:shadow-md">
                    🕉
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[#34251e] group-hover:text-[#c1440e] capitalize">
                    {translateCategory(category)}
                  </h3>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Temples Showcase ── */}
      <section id="temples" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {t('templesSub')}
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-bold">{t('templesTitle')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#806f61]">{t('templesDesc')}</p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {temples.map((originalTemple) => {
              const temple = translateTemple(originalTemple)
              return (
                <article
                  key={temple.id}
                  className="temple-animated-card group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#eadfd1] bg-white shadow-sm sheen-card cursor-pointer"
                >
                  <div>
                    <div className="relative overflow-hidden">
                      <img
                        loading="lazy"
                        src={temple.image}
                        alt={temple.name}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                        📍 {temple.location}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold group-hover:text-[#c1440e] transition-colors">
                        {temple.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#8b7a6d]">{temple.description}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => navigateToSevas(originalTemple)}
                      className="w-full rounded-2xl border-2 border-[#34251e] py-3 text-sm font-bold text-[#34251e] transition-all hover:bg-[#34251e] hover:text-white cursor-pointer group-hover:border-[#c1440e] group-hover:bg-[#c1440e] group-hover:text-white"
                    >
                      {t('viewAvailableSevas')}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Trust & Delivery Guarantee ── */}
      <section id="trust" className="bg-[#f5ede2] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {t('trustSub')}
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold">{t('trustTitle')}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md sheen-card">
              <span className="animate-diya text-3xl">🪔</span>
              <h3 className="mt-4 font-serif text-lg font-bold">{t('trust1Title')}</h3>
              <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust1Desc')}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md sheen-card">
              <span className="text-3xl">📜</span>
              <h3 className="mt-4 font-serif text-lg font-bold">{t('trust2Title')}</h3>
              <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust2Desc')}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md sheen-card">
              <span className="text-3xl">📦</span>
              <h3 className="mt-4 font-serif text-lg font-bold">{t('trust3Title')}</h3>
              <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust3Desc')}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md sheen-card">
              <span className="animate-diya text-3xl">🔔</span>
              <h3 className="mt-4 font-serif text-lg font-bold">{t('trust4Title')}</h3>
              <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
            {t('howSub')}
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold">{t('howTitle')}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { step: '01', title: t('step1Title'), desc: t('step1Desc') },
            { step: '02', title: t('step2Title'), desc: t('step2Desc') },
            { step: '03', title: t('step3Title'), desc: t('step3Desc') },
            { step: '04', title: t('step4Title'), desc: t('step4Desc') },
          ].map((item) => (
            <div
              key={item.step}
              className="group rounded-2xl border border-[#eadfd1] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#c1440e] hover:shadow-lg"
            >
              <span className="font-serif text-4xl font-bold text-[#d4a64a] group-hover:text-[#c1440e] transition-colors">
                {item.step}
              </span>
              <h3 className="mt-4 font-serif text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Accordion Section ── */}
      <section id="faq" className="border-t border-[#eadfd1] bg-[#faf4ec] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {t('faqSub')}
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold">{t('faqTitle')}</h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[#eadfd1] bg-white overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-serif text-lg font-bold text-[#34251e] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xl text-[#c1440e] transition-transform duration-300">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#f5ede2] px-5 pb-5 pt-3 text-sm leading-6 text-[#75685d] animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter & Auspicious Tithi Updates ── */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-[#34251e] to-[#453127] p-8 text-center text-white sm:p-12 shadow-2xl relative overflow-hidden sheen-card">
          <span className="animate-diya text-4xl">🪔</span>
          <h2 className="mt-4 font-serif text-3xl font-bold">{t('newsletterTitle')}</h2>
          <p className="mt-2 text-sm text-[#e0cfbe]">{t('newsletterSub')}</p>
          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center relative z-10"
          >
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder={t('newsletterPlaceholder')}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none sm:w-80 focus:border-[#f2c778]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#c1440e] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#a5370a] cursor-pointer"
            >
              {t('newsletterBtn')}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default HomePage
