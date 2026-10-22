import { useState } from 'react'
import { temples, categories, sevas, reviews } from '../../data'
import { useToast } from '../../contexts/ToastContext'
import { useLanguage } from '../../contexts/LanguageContext'
import type { Temple, User } from '../../types'

interface HomePageProps {
  navigateToSevas: (temple?: Temple) => void
  onRegister: () => void
  onSelectTempleDirect?: (templeId: string) => void
  user?: User | null
}

const HomePage = ({ navigateToSevas, user }: HomePageProps) => {
  const isLoggedIn = !!user
  const { addToast } = useToast()
  const { language, t, translateTemple, translateCategory } = useLanguage()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ]

  // Festival Calendar Highlights
  const upcomingFestivals = [
    {
      name: language === 'KN' ? 'ಮಹಾ ಶಿವರಾತ್ರಿ ಮಹೋತ್ಸವ' : 'Maha Shivaratri Mahotsav',
      tithi: language === 'KN' ? 'ಮಾಘ ಬಹುಳ ಚತುರ್ದಶಿ' : 'Magha Krishna Chaturdashi',
      templeName: 'Kashi Vishwanath',
      highlight: language === 'KN' ? 'ರಾತ್ರಿ ನಾಲ್ಕು ಪ್ರಹರಗಳ ರುದ್ರಾಭಿಷೇಕ' : '4-Prahar Night Ganga Rudrabhishekam',
      templeId: 'kashi',
      icon: '🕉️',
    },
    {
      name: language === 'KN' ? 'ವೈಕುಂಠ ಏಕಾದಶಿ ಮಹೋತ್ಸವ' : 'Vaikunta Ekadashi Seva',
      tithi: language === 'KN' ? 'ಧನುರ್ಮಾಸ ಶುಕ್ಲ ಏಕಾದಶಿ' : 'Dhanurmasa Shukla Ekadashi',
      templeName: 'Sri Venkateswara Swamy',
      highlight: language === 'KN' ? 'ವೈಕುಂಠ ದ್ವಾರ ಪ್ರವೇಶ & ಕಲ್ಯಾಣೋತ್ಸವ' : 'Vaikunta Dwara & Kalyanotsavam',
      templeId: 'venkateswara',
      icon: '🪔',
    },
    {
      name: language === 'KN' ? 'ಮೀನಾಕ್ಷಿ ತಿರುಕಲ್ಯಾಣಂ' : 'Meenakshi Tirukalyanam',
      tithi: language === 'KN' ? 'ಚಿತ್ತಿರೈ ಪೌರ್ಣಮಿ ಉತ್ಸವ' : 'Chithirai Pournami Utsavam',
      templeName: 'Shree Meenakshi Temple',
      highlight: language === 'KN' ? 'ದಿವ್ಯ ವೈದಿಕ ಕಲ್ಯಾಣೋತ್ಸವ & ಕುಂಕುಮಾರ್ಚನೆ' : 'Celestial Wedding & Kumkumarchana',
      templeId: 'meenakshi',
      icon: '🌸',
    },
  ]

  // Featured Testimonials
  const featuredReviews = reviews.slice(0, 3)

  return (
    <main className="bg-[#fffcf6] text-[#34251e] overflow-hidden">
      {/* ── 1. Sacred Daily Panchangam & Auspicious Tithi Top Banner ── */}
      <div className="bg-gradient-to-r from-[#2a170d] via-[#452718] to-[#2a170d] text-white py-2 px-4 text-xs border-b border-[#d4a64a]/30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#f2c778] font-bold">
              {language === 'KN' ? 'ಇಂದಿನ ಪಂಚಾಂಗ:' : 'Today\'s Panchangam:'}
            </span>
            <span className="text-[#e2d5c5]">
              {language === 'KN'
                ? 'ಶುಕ್ಲ ಪಕ್ಷ ದಶಮಿ · ಅನುರಾಧಾ ನಕ್ಷತ್ರ · ಅಭಿಜಿತ್ ಮುಹೂರ್ತ: ೧೧:೪೫ AM - ೧೨:೩೫ PM'
                : 'Shukla Paksha Dashami · Anuradha Nakshatra · Abhijit Muhurtham: 11:45 AM - 12:35 PM'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#f2c778]/90 font-semibold">
            <span>🪔 100% Sanctum Guaranteed</span>
            <span className="hidden md:inline">✦</span>
            <span className="hidden md:inline">📦 Doorstep Prasadam Delivery</span>
          </div>
        </div>
      </div>

      {/* ── 2. Standard Elevated Hero Section ── */}
      <section className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          {/* Pulsing Beacon Sanctuary Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5ede2] px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#c1440e] shadow-2xs border border-[#eadfd1]">
            <span className="pulse-beacon" />
            <span>{t('sanctuaryNetwork')}</span>
          </div>

          <h1 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-[68px] font-bold text-[#34251e]">
            {t('heroTitlePart1')}
            <br />
            <em className="text-[#c1440e] relative inline-block not-italic">
              {t('heroTitlePart2')}
              <span className="absolute -bottom-1.5 left-0 h-1.5 w-full bg-gradient-to-r from-[#c1440e] via-[#d4a64a] to-transparent rounded-full opacity-70" />
            </em>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#786657]">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a href="#temples" className="btn-primary sheen-card shadow-lg px-7 py-3.5 text-sm font-bold">
              <span className="animate-diya mr-2">🪔</span>
              {t('heroExploreTemples')}
            </a>
            <button
              onClick={() => navigateToSevas()}
              className="rounded-full border-2 border-[#d9cabb] bg-white px-7 py-3 text-sm font-bold shadow-2xs transition hover:border-[#c1440e] hover:shadow-md cursor-pointer text-[#34251e]"
            >
              {t('heroBookSeva')}
            </button>
          </div>

          {/* Quick Sanctuary Jump Pills (Direct 1-Click Access) */}
          <div className="mt-6 pt-5 border-t border-[#eadfd1]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d] mb-2.5 flex items-center gap-1.5">
              <span>⚡</span>
              <span>Direct Temple Sevas:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {temples.map((temple) => {
                const count = sevas.filter((s) => s.templeId === temple.id).length
                return (
                  <button
                    key={temple.id}
                    onClick={() => navigateToSevas(temple)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e2d5c4] bg-white px-3 py-1.5 text-xs font-semibold text-[#34251e] transition hover:border-[#c1440e] hover:bg-[#fff9f3] hover:shadow-xs cursor-pointer group"
                  >
                    <span className="text-[#c1440e] text-sm group-hover:scale-110 transition-transform">🛕</span>
                    <span>{translateTemple(temple).name}</span>
                    <span className="rounded-full bg-[#f5ede2] text-[#c1440e] text-[10px] font-bold px-1.5 py-0.2">
                      {count} Sevas
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Social Proof Counters */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#eadfd1] pt-6">
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#c1440e]">
                {t('heroStat1Value')}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#8b7a6d]">
                {t('heroStat1Label')}
              </p>
            </div>
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#34251e]">
                {t('heroStat2Value')}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#8b7a6d]">
                {t('heroStat2Label')}
              </p>
            </div>
            <div className="transition-transform hover:scale-105">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#d4a64a]">
                {t('heroStat3Value')}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#8b7a6d]">
                {t('heroStat3Label')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Sacred Hero Visual Composition in Card ── */}
        <div className="relative flex items-center justify-center pt-6 lg:pt-0">
          {/* Spiritual Sunburst Radiance Glow */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#df5619]/25 via-[#f59e0b]/20 to-[#c1440e]/10 blur-3xl -z-10 pointer-events-none" />

          {/* Golden Concentric Sacred Mandala Rings */}
          <div className="animate-mandala absolute h-[440px] w-[440px] max-w-full rounded-full border border-dashed border-[#d4a64a]/40 -z-10 pointer-events-none" />
          <div
            className="animate-spin-slow absolute h-[360px] w-[360px] max-w-full rounded-full border border-[#c1440e]/20 -z-10 pointer-events-none"
            style={{ animationDuration: '40s' }}
          />

          {/* The Sacred Temple Artwork Card */}
          <div className="relative w-full max-w-[480px]">
            <div
              className="animate-float-hero relative overflow-hidden"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, transparent 95%)',
                maskImage: 'radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, transparent 95%)',
              }}
            >
              <img
                src="/temple-hero.webp"
                alt="Sacred Indian Temple Sanctum"
                className="w-full h-auto max-h-[440px] object-cover drop-shadow-2xl hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffcf6] via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating Devotional Elements */}
            {/* Top Left: Certified Priests Pill */}
            <div className="animate-bounce-subtle absolute -top-3 -left-2 sm:-left-4 flex items-center gap-2.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-2 shadow-lg border border-[#eadfd1] transition hover:scale-105">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdf2e9] text-[#c1440e] text-sm">
                🪔
              </span>
              <div>
                <span className="block text-[11px] font-bold text-[#34251e] leading-tight">
                  {language === 'KN' ? '೧೦೦% ಶಾಸ್ತ್ರೋಕ್ತ ಪುರೋಹಿತರು' : 'Vedic Gurukul Priests'}
                </span>
                <span className="block text-[9px] font-semibold text-[#c1440e]">
                  {language === 'KN' ? 'ನೇರ ಗರ್ಭಗುಡಿ ಸಂಕಲ್ಪ' : 'Live Sanctum Sankalpa'}
                </span>
              </div>
            </div>

            {/* Bottom Right: Sacred Prasadam Delivery Pill */}
            <div className="animate-float-hero absolute -bottom-4 -right-2 sm:-right-4 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-[#eadfd1] transition hover:scale-105">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-white text-base shadow-xs">
                📦
              </span>
              <div>
                <span className="block text-xs font-bold text-[#34251e]">
                  {language === 'KN' ? 'ಶುದ್ಧ ಪ್ರಸಾದ ಮನೆಬಾಗಿಲಿಗೆ' : 'Temple Prasadam Delivery'}
                </span>
                <span className="block text-[10px] text-[#806f61] mt-0.5">
                  {language === 'KN' ? 'ಕುಂಕುಮ, ತೀರ್ಥ ಮತ್ತು ರಕ್ಷೆ' : 'Kumkum, Vibhuti & Raksha'}
                </span>
              </div>
            </div>

            {/* Bottom Left: Live Darshan Pill */}
            <div className="absolute bottom-5 -left-2 sm:-left-4 hidden sm:flex items-center gap-2 rounded-full bg-[#2c170e]/95 backdrop-blur-md px-3.5 py-1.5 text-white shadow-lg border border-[#d4a64a]/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#f2c778]">
                {language === 'KN' ? 'ಲೈವ್ ದರ್ಶನ ಲಭ್ಯ' : 'Live Darshan Active'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Sacred Live Blessings Marquee Ticker ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2c170e] via-[#482819] to-[#2c170e] py-3 text-white border-y border-[#d4a64a]/30 shadow-md">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold tracking-wider flex items-center gap-8">
          <span className="flex items-center gap-2">
            <span className="animate-diya text-base">🪔</span> {language === 'KN' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಪುರೋಹಿತರು' : '100% Certified Vedic Gurukul Priests'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>🕉</span> {language === 'KN' ? 'ವೈಯಕ್ತಿಕ ಹೆಸರು & ಗೋತ್ರ ಸಂಕಲ್ಪ' : 'Personalized Name & Gotra Sankalpa Recording'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>📦</span> {language === 'KN' ? 'ಶುದ್ಧ ಪವಿತ್ರ ಪ್ರಸಾದ ಮನೆ ಬಾಗಿಲಿಗೆ' : 'Doorstep Sacred Prasadam Dispatch'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span className="animate-diya text-base">🔔</span> {language === 'KN' ? 'ನೇರ ಪೂಜಾ ಫೋಟೋ & ವಿಡಿಯೋ ಮಾಹಿತಿ' : 'WhatsApp Video & Photo Sankalpa Updates'}
          </span>
          <span className="text-[#f2c778]">✦</span>
          <span className="flex items-center gap-2">
            <span>✨</span> {language === 'KN' ? '೫೦,೦೦೦+ ಸಫಲ ಸೇವೆಗಳು' : '50,000+ Devotee Offerings Fulfilled'}
          </span>
        </div>
      </div>

      {/* ── 4. Grand Temples Showcase (The 3 Holy Sanctuaries) ── */}
      <section id="temples" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#c1440e]">
              {t('templesSub')}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e]">
              {t('templesTitle')}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#806f61]">
              {t('templesDesc')}
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {temples.map((originalTemple) => {
              const temple = translateTemple(originalTemple)
              const templeSevasCount = sevas.filter((s) => s.templeId === originalTemple.id).length

              return (
                <article
                  key={temple.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#eadfd1] bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative cursor-pointer"
                  onClick={() => navigateToSevas(originalTemple)}
                >
                  <div>
                    {/* Temple Banner Image with Overlay */}
                    <div className="relative overflow-hidden h-60">
                      <img
                        loading="lazy"
                        src={temple.image}
                        alt={temple.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#2c170e]/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#f2c778] border border-[#d4a64a]/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Sanctum Open</span>
                      </div>

                      <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-[#c1440e] shadow-2xs">
                        {templeSevasCount} Sevas Available
                      </div>

                      {/* Location Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white/95">
                        <span>📍</span>
                        <span>{temple.location}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-2xl font-bold text-[#34251e] group-hover:text-[#c1440e] transition-colors leading-tight">
                        {temple.name}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#75685d]">
                        {temple.description}
                      </p>

                      {/* Temple Highlights */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {originalTemple.id === 'kashi' && (
                          <>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Jyotirlinga Sanctum
                            </span>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Ganga Theertham
                            </span>
                          </>
                        )}
                        {originalTemple.id === 'venkateswara' && (
                          <>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Lord Balaji Shrine
                            </span>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Tirupati Laddu Prasadam
                            </span>
                          </>
                        )}
                        {originalTemple.id === 'meenakshi' && (
                          <>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Goddess Shakti Peetham
                            </span>
                            <span className="rounded-lg bg-[#fbf6f0] border border-[#eee2d3] px-2 py-0.5 text-[10px] font-semibold text-[#8b7a6d]">
                              Kumkuma Archana
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      className="w-full rounded-2xl border-2 border-[#34251e] py-3 text-xs sm:text-sm font-bold text-[#34251e] transition-all group-hover:border-[#c1440e] group-hover:bg-[#c1440e] group-hover:text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span>{t('viewAvailableSevas')}</span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Auspicious Upcoming Festival Calendar ── */}
      <section className="bg-gradient-to-b from-[#faf4ec] to-[#fffcf6] border-y border-[#eadfd1] py-16 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e5d7c7] pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                {language === 'KN' ? 'ವಿಶೇಷ ಪರ್ವದಿನಗಳು & ಉತ್ಸವಗಳು' : 'Auspicious Festivals & Muhurthas'}
              </p>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#34251e]">
                {language === 'KN' ? 'ಮುಂಬರುವ ಪುಣ್ಯ ತಿಥಿಗಳು & ಸೇವಾ ಬುಕಿಂಗ್' : 'Upcoming Auspicious Festivals'}
              </h2>
            </div>
            <button
              onClick={() => navigateToSevas()}
              className="text-xs font-bold uppercase tracking-wider text-[#c1440e] hover:underline cursor-pointer flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{t('viewAllSevas')}</span>
              <span>→</span>
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {upcomingFestivals.map((fest, idx) => {
              const matchedTemple = temples.find((t) => t.id === fest.templeId)
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#eadfd1] bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{fest.icon}</span>
                    <span className="rounded-full bg-[#fdf2e9] text-[#c1440e] text-[10px] font-bold px-3 py-1 uppercase tracking-wider border border-[#f5cfb5]">
                      {fest.tithi}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-xl font-bold text-[#34251e] group-hover:text-[#c1440e] transition-colors">
                    {fest.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#8b7a6d] mt-1">
                    🛕 {fest.templeName}
                  </p>
                  <p className="mt-2.5 text-xs text-[#6e5d4f] leading-relaxed">
                    {fest.highlight}
                  </p>

                  <div className="mt-6 pt-4 border-t border-[#f2e7db]">
                    <button
                      onClick={() => navigateToSevas(matchedTemple)}
                      className="w-full rounded-xl bg-[#f5ede2] hover:bg-[#c1440e] hover:text-white text-[#c1440e] font-bold py-2.5 text-xs transition-all duration-300 cursor-pointer text-center"
                    >
                      {language === 'KN' ? 'ಸಂಕಲ್ಪ ಮುಂಗಡ ಬುಕಿಂಗ್' : 'Book Festival Sankalpa'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Seva Categories Showcase ── */}
      <section className="py-16 px-5 lg:px-8 border-b border-[#eadfd1]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                {t('categoriesSub')}
              </p>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold">{t('categoriesTitle')}</h2>
            </div>
            <button
              onClick={() => navigateToSevas()}
              className="text-sm font-bold text-[#c1440e] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{t('viewAllSevas')}</span>
              <span>→</span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                id: 'pooja',
                icon: '🕉️',
                title: 'Pooja & Darshan',
                desc: 'Daily Mangala Aarti, Suprabhata, & sacred deity bathing',
              },
              {
                id: 'homam',
                icon: '🔥',
                title: 'Vedic Homam & Yajna',
                desc: 'Maha Mrityunjaya, Ganapathi & Ayushya fire oblations',
              },
              {
                id: 'archana',
                icon: '🌸',
                title: 'Archana & Sahasranama',
                desc: 'Personalized Gotra chanting & 1,000 holy names of deities',
              },
              {
                id: 'special',
                icon: '🕊️',
                title: 'Special & Anna Daan',
                desc: 'Ganga deepa offerings, celestial weddings & pilgrim food',
              },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateToSevas()}
                className="group cursor-pointer rounded-3xl border border-[#eadfd1] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c1440e] hover:shadow-xl"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f5ede2] text-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c1440e] group-hover:text-white shadow-2xs">
                  {cat.icon}
                </div>
                <h3 className="mt-3.5 font-serif text-base font-bold text-[#34251e] group-hover:text-[#c1440e]">
                  {cat.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#8b7a6d] leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Devotee Testimonials & Consecration Blessings Wall ── */}
      <section className="bg-[#faf5ee] py-16 px-5 lg:px-8 border-b border-[#eadfd1]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              {language === 'KN' ? 'ಭಕ್ತರ ಅನುಭವಗಳು' : 'Devotee Blessings & Testimonials'}
            </p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#34251e]">
              {language === 'KN' ? 'ಭಕ್ತರ ಮುಖದಿಂದ ಕೇಳಿ' : 'Real Experiences from Sacred Shrines'}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl border border-[#e5d7c7] bg-white p-6 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#d4a64a] text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-[#5c4a3d] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#f2e7db] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdf2e9] font-bold text-[#c1440e] text-xs">
                      {rev.userName.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-[#34251e]">{rev.userName}</p>
                      <p className="text-[10px] text-[#28724d] font-semibold">✓ Verified Devotee</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#a3907e]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Conditionally Displayed for Guests (Hidden When User is Logged In) ── */}
      {!isLoggedIn && (
        <>
          {/* Trust & Delivery Guarantee */}
          <section id="trust" className="bg-[#f5ede2] px-5 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                  {t('trustSub')}
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">{t('trustTitle')}</h2>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <span className="animate-diya text-3xl">🪔</span>
                  <h3 className="mt-4 font-serif text-lg font-bold">{t('trust1Title')}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust1Desc')}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <span className="text-3xl">📜</span>
                  <h3 className="mt-4 font-serif text-lg font-bold">{t('trust2Title')}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust2Desc')}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <span className="text-3xl">📦</span>
                  <h3 className="mt-4 font-serif text-lg font-bold">{t('trust3Title')}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust3Desc')}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <span className="animate-diya text-3xl">🔔</span>
                  <h3 className="mt-4 font-serif text-lg font-bold">{t('trust4Title')}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{t('trust4Desc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                {t('howSub')}
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">{t('howTitle')}</h2>
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
                  <h3 className="mt-4 font-serif text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#8b7a6d]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section id="faq" className="border-t border-[#eadfd1] bg-[#faf4ec] px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                  {t('faqSub')}
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">{t('faqTitle')}</h2>
              </div>

              <div className="mt-10 space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl border border-[#eadfd1] bg-white overflow-hidden shadow-2xs transition"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between p-5 text-left font-serif text-base sm:text-lg font-bold text-[#34251e] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-xl text-[#c1440e] transition-transform duration-300">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#f5ede2] px-5 pb-5 pt-3 text-xs sm:text-sm leading-relaxed text-[#75685d] animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </>
      )}

    </main>
  )
}

export default HomePage
