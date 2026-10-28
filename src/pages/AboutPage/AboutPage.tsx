import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { temples } from '../../data'
import type { Temple } from '../../types'

interface AboutPageProps {
  navigateToSevas?: (temple?: Temple) => void
}

const AboutPage = ({ navigateToSevas }: AboutPageProps) => {
  const navigate = useNavigate()
  const { language, translateTemple } = useLanguage()

  const handleExplore = (temple?: Temple) => {
    if (navigateToSevas) {
      navigateToSevas(temple)
    } else {
      navigate('/')
    }
  }

  const pillars = [
    {
      icon: '📜',
      title: language === 'KN' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಆಗಮ & ವೇದ ಪರಂಪರೆ' : 'Agamic & Vedic Sanctity',
      desc:
        language === 'KN'
          ? 'ಪ್ರತಿಯೊಂದು ಪೂಜೆ ಮತ್ತು ಹೋಮವನ್ನು ಶತಮಾನಗಳ ಸಂಪ್ರದಾಯಬದ್ಧ ಆಗಮ ಶಾಸ್ತ್ರಗಳ ಪ್ರಕಾರ, ಪ್ರಮಾಣೀಕೃತ ವೇದ ಪುರೋಹಿತರೇ ನಿರ್ವಹಿಸುತ್ತಾರೆ.'
          : 'Rituals are conducted strictly according to Agamic and Vedic scriptures by experienced, certified temple priests in the consecrated sanctums.',
    },
    {
      icon: '📿',
      title: language === 'KN' ? 'ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪ ನಿಷ್ಠೆ' : 'Authentic Devotee Sankalpa',
      desc:
        language === 'KN'
          ? 'ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ನಿಮ್ಮ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬದ ಹೆಸರು, ನಕ್ಷತ್ರ ಹಾಗೂ ಗೋತ್ರವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಉಚ್ಚರಿಸಿ ಅರ್ಚಕರು ದೈವಿಕ ಸಂಕಲ್ಪ ಮಾಡುತ್ತಾರೆ.'
          : 'During the auspicious puja muhurtham, the head priest recites your registered name, gotram, and nakshatra in the sacred Vedic sankalpa.',
    },
    {
      icon: '📦',
      title: language === 'KN' ? 'ಪವಿತ್ರ ಪ್ರಸಾದ ಮನೆಬಾಗಿಲಿಗೆ' : 'Consecrated Prasadam Delivery',
      desc:
        language === 'KN'
          ? 'ಪೂಜೆಯ ನಂತರ ಪವಿತ್ರ ಕುಂಕುಮ, ವಿಭೂತಿ, ರಕ್ಷಾಸೂತ್ರ ಮತ್ತು ಪ್ರಸಾದವನ್ನು ಶುದ್ಧತೆಯಿಂದ ಪ್ಯಾಕ್ ಮಾಡಿ ನಿಮ್ಮ ಮನೆಗೆ ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿಸಲಾಗುತ್ತದೆ.'
          : 'Consecrated prasadam, holy vibhuti, kumkum, and sacred raksha threads are hygienically sealed and dispatched directly to your home.',
    },
    {
      icon: '🔔',
      title: language === 'KN' ? 'ಪಾರದರ್ಶಕತೆ & ನಂಬಿಕೆ' : 'Spiritual Transparency',
      desc:
        language === 'KN'
          ? 'ಸೇವೆಯ ನಂತರ ವಾಟ್ಸಾಪ್ ಮತ್ತು ಎಸ್ಎಂಎಸ್ ಮೂಲಕ ದೃಢೀಕರಣ ಹಾಗೂ ಪೂಜೆಯ ನೈಜ ಫೋಟೋ/ವಿಡಿಯೋ ಅಪ್ಡೇಟ್ ಭಕ್ತರಿಗೆ ಲಭ್ಯವಾಗುತ್ತದೆ.'
          : 'Devotees receive genuine photo and video updates of their sankalpa along with timely SMS and WhatsApp status notifications.',
    },
  ]

  const stats = [
    {
      value: '50,000+',
      label: language === 'KN' ? 'ನೆರವೇರಿಸಿದ ಸೇವೆಗಳು' : 'Devotee Sevas Performed',
      sub: language === 'KN' ? 'ಭಾರತ & ವಿದೇಶಗಳ ಭಕ್ತರು' : 'Across India & Worldwide',
    },
    {
      value: '100%',
      label: language === 'KN' ? 'ಸುರಕ್ಷಿತ ಪ್ರಸಾದ ವಿತರಣೆ' : 'Prasadam Delivery Guarantee',
      sub: language === 'KN' ? 'ವೇಗದ ಸ್ಪೀಡ್ ಪೋಸ್ಟ್' : 'Expedited Postal Courier',
    },
    {
      value: '25+',
      label: language === 'KN' ? 'ಪ್ರಮಾಣೀಕೃತ ವೈದಿಕ ಪುರೋಹಿತರು' : 'Vedic Gurukul Priests',
      sub: language === 'KN' ? 'ಆಗಮ ಪಂಡಿತರು' : 'Certified Sanskrit Scholars',
    },
    {
      value: '4.9 ★',
      label: language === 'KN' ? 'ಭಕ್ತರ ತೃಪ್ತಿ ರೇಟಿಂಗ್' : 'Devotee Trust Rating',
      sub: language === 'KN' ? 'ಸಾವಿರಾರು ಸದ್ಭಾವನೆಗಳು' : 'Based on 12,000+ Reviews',
    },
  ]

  return (
    <main className="bg-[#fffcf6] text-[#34251e] overflow-hidden">
      {/* ── 1. Sacred Header Breadcrumb & Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5ede2] via-[#faf4ec] to-[#fffcf6] px-5 pt-12 pb-16 lg:px-8 lg:pt-16 lg:pb-24 border-b border-[#eadfd1]">
        {/* Sacred Decorative Mandala Background */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#d4a64a]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#c1440e]/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Breadcrumb pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xs px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#c1440e] shadow-2xs border border-[#eadfd1]">
            <span className="animate-diya">🪔</span>
            <span>{language === 'KN' ? 'ನಮ್ಮ ಬಗ್ಗೆ · ಟೆಂಪಲ್ ಸೇವಾ' : 'About Us · TempleSeva'}</span>
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#34251e] leading-tight">
            {language === 'KN' ? (
              <>
                ಭಾರತದ ಪಾವನ ಪುಣ್ಯಕ್ಷೇತ್ರಗಳನ್ನು <br />
                <span className="text-[#c1440e]">ಪ್ರತಿಯೊಬ್ಬ ಭಕ್ತನೊಂದಿಗೆ ಬೆಸೆಯುವ ಸೇವೆ</span>
              </>
            ) : (
              <>
                Connecting Eternal Sanctuaries <br />
                <span className="text-[#c1440e]">With Every Devoted Soul</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-[#786657]">
            {language === 'KN'
              ? 'ಟೆಂಪಲ್ ಸೇವೆಯು ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ನಂಬಿಕೆಯನ್ನು ಆಧರಿಸಿ ರೂಪಿತವಾದ ದೈವಿಕ ಸೇವಾ ವೇದಿಕೆ. ಭೌಗೋಳಿಕ ಅಂತರವು ಭಕ್ತ ಮತ್ತು ದೇವರ ನಡುವೆ ಅಡ್ಡಿಯಾಗಬಾರದು ಎಂಬ ದೃಢ ಸಂಕಲ್ಪದಿಂದ, ಭಾರತದ ಪ್ರಸಿದ್ಧ ದೇವಾಲಯಗಳ ಪೂಜೆ, ಹೋಮ ಮತ್ತು ನೈಜ ಪ್ರಸಾದವನ್ನು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.'
              : 'TempleSeva was founded on the sacred belief that physical distance should never hinder divine worship. We bridge ancient Vedic sanctuaries with devotees globally by facilitating authentic personalized sankalpa sevas and doorstep delivery of sacred consecrated prasadam.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleExplore()}
              className="btn-primary sheen-card shadow-lg px-8 py-3.5 text-sm font-bold cursor-pointer"
            >
              <span className="mr-2">🛕</span>
              {language === 'KN' ? 'ಲಭ್ಯವಿರುವ ದೇವಾಲಯಗಳು & ಸೇವೆಗಳು' : 'Explore Temples & Sevas'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-full border-2 border-[#d9cabb] bg-white px-7 py-3 text-sm font-bold shadow-2xs transition hover:border-[#c1440e] hover:shadow-md cursor-pointer text-[#34251e]"
            >
              {language === 'KN' ? 'ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Back to Home'}
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Our Mission & Sacred Narrative ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
              <span>✦</span>
              <span>{language === 'KN' ? 'ನಮ್ಮ ಧ್ಯೇಯೋದ್ದೇಶ' : 'Our Sacred Mission'}</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#34251e] leading-snug">
              {language === 'KN'
                ? 'ಶುದ್ಧ ವೈದಿಕ ಸಂಪ್ರದಾಯ, ಅಚಲ ಭಕ್ತಿ ಮತ್ತು ದೈವಿಕ ಅನುಗ್ರಹ'
                : 'Pure Agamic Tradition, Steadfast Devotion & Divine Grace'}
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#786657]">
              <p>
                {language === 'KN'
                  ? 'ಲಕ್ಷಾಂತರ ಭಕ್ತರು ಜೀವನದ ವಿವಿಧ ಸಂದರ್ಭಗಳಲ್ಲಿ, ವೃದ್ಧಾಪ್ಯ, ಆರೋಗ್ಯ ಅಥವಾ ಭೌಗೋಳಿಕ ದೂರದ ಕಾರಣದಿಂದ ಕಾಶಿ ವಿಶ್ವನಾಥ, ತಿರುಪತಿ ಬಾಲಾಜಿ ಅಥವಾ ಮಧುರೈ ಮೀನಾಕ್ಷಿ ಅಮ್ಮನವರ ಸನ್ನಿಧಿಗೆ ಖುದ್ದಾಗಿ ಭೇಟಿ ನೀಡಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ.'
                  : 'Millions of devotees across the globe revere sacred sanctums like Tirupati Balaji, Kashi Vishwanath, and Madurai Meenakshi, yet family responsibilities, aging elders, or geographical distances often prevent them from undertaking the physical pilgrimage.'}
              </p>
              <p>
                {language === 'KN'
                  ? 'ಟೆಂಪಲ್ ಸೇವಾ ಈ ಅಂತರವನ್ನು ಪ್ರೀತಿ ಮತ್ತು ನಿಷ್ಠೆಯಿಂದ ಸೇತುವೆ ಮಾಡುತ್ತದೆ. ನಮ್ಮ ಪ್ರಮಾಣೀಕೃತ ವೇದ ಪುರೋಹಿತರು ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ, ನಿಮ್ಮ ಗೋತ್ರ ಮತ್ತು ನಕ್ಷತ್ರವನ್ನು ಉಚ್ಚರಿಸಿ ದೇವರಿಗೆ ಅರ್ಪಣೆ ಸಲ್ಲಿಸುತ್ತಾರೆ. ಪೂಜೆಯ ನಂತರ ದೈವಿಕ ಶಕ್ತಿಯಿಂದ ಪ್ರಭಾವಿತವಾದ ಪವಿತ್ರ ಪ್ರಸಾದವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ನಿಮ್ಮ ಮನೆಗೆ ಕಳುಹಿಸಿಕೊಡುತ್ತೇವೆ.'
                  : 'TempleSeva acts as your sacred representative at the sanctum sanctorum. Our learned archakas carry out the rituals in exact accordance with centuries-old shastras, ensuring your family receives the benevolent vibrations and divine protective armor of the puja.'}
              </p>
            </div>

            {/* Sacred Highlight Box */}
            <div className="mt-8 rounded-2xl border border-[#d4a64a]/40 bg-gradient-to-br from-[#fff9f0] to-[#fbf4ea] p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c1440e] text-lg text-white shadow-xs">
                  ॐ
                </span>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#34251e]">
                    {language === 'KN' ? '೧೦೦% ನೈಜ ಸಂಕಲ್ಪ ಗ್ಯಾರಂಟಿ' : '100% Verified Sankalpa Guarantee'}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#786657] leading-relaxed">
                    {language === 'KN'
                      ? 'ಪ್ರತಿಯೊಂದು ಸೇವೆಯಲ್ಲೂ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪವನ್ನು ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನೆರವೇರಿಸಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ದೇವಸ್ಥಾನದ ಅರ್ಚಕರಿಂದಲೇ ನಿರ್ವಹಣೆ.'
                      : 'Every single seva booked through TempleSeva is consecrated directly by temple priests with your exact family sankalpa without intermediaries.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-[#eadfd1] bg-white p-3 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85"
                alt="Sacred Temple Sanctum"
                className="h-[380px] sm:h-[440px] w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#2a170d]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#c1440e]/90 px-3 py-1 text-xs font-bold backdrop-blur-xs">
                  <span>🛕</span>
                  <span>{language === 'KN' ? 'ಪವಿತ್ರ ದೇವಸ್ಥಾನಗಳ ನೆಟ್‌ವರ್ಕ್' : 'Sanctified Temple Network'}</span>
                </div>
                <p className="mt-2 font-serif text-xl sm:text-2xl font-bold leading-snug">
                  {language === 'KN'
                    ? 'ಪುರಾತನ ಶೃಂಗೇರಿ, ಕಾಶಿ, ತಿರುಪತಿ ಮತ್ತು ಮಧುರೈ ಸನ್ನಿಧಾನಗಳು'
                    : 'Ancient Varanasi, Tirupati, and Madurai Shrines'}
                </p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl border border-[#eadfd1]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#28724d] text-white text-lg">
                ✓
              </span>
              <div>
                <p className="text-xs font-bold text-[#34251e]">
                  {language === 'KN' ? 'ವೇದ ಪ್ರಮಾಣೀಕೃತ' : 'Agama Certified'}
                </p>
                <p className="text-[11px] text-[#806f61]">
                  {language === 'KN' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವಿಧಿವಿಧಾನ' : 'Authentic Temple Priests'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Four Core Pillars of TempleSeva ── */}
      <section className="bg-[#f5ede2] px-5 py-16 lg:px-8 lg:py-24 border-y border-[#eadfd1]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-[#c1440e]">
              {language === 'KN' ? 'ನಮ್ಮ ದೃಢ ತತ್ವಗಳು' : 'The Four Pillars'}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#34251e]">
              {language === 'KN' ? 'ಟೆಂಪಲ್ ಸೇವೆಯನ್ನು ಭಕ್ತರು ಏಕೆ ನಂಬುತ್ತಾರೆ?' : 'Why Devotees Trust TempleSeva'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#806f61]">
              {language === 'KN'
                ? 'ಪ್ರತಿಯೊಂದು ವಿಧಿವಿಧಾನದಲ್ಲೂ ಪರಿಶುದ್ಧತೆ, ಶ್ರದ್ಧೆ ಮತ್ತು ನಿಖರತೆಗೆ ನಾವು ನೀಡುವ ಆದ್ಯತೆ.'
                : 'Every offering is guided by reverence, agamic compliance, and complete devotional integrity.'}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border border-[#eadfd1] hover:border-[#c1440e]"
              >
                <span className="text-4xl">{pillar.icon}</span>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#34251e] group-hover:text-[#c1440e] transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#806f61]">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Impact & Trust Numbers ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((st, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#eadfd1] bg-white p-6 text-center shadow-xs transition hover:scale-105"
            >
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#c1440e]">{st.value}</p>
              <p className="mt-2 font-serif text-sm sm:text-base font-bold text-[#34251e]">{st.label}</p>
              <p className="mt-1 text-xs text-[#8b7a6d]">{st.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Available Sacred Sanctuaries Preview ── */}
      <section className="bg-[#faf4ec] px-5 py-16 lg:px-8 border-t border-[#eadfd1]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c1440e]">
                {language === 'KN' ? 'ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳು' : 'Sanctuaries Active'}
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#34251e]">
                {language === 'KN' ? 'ಲಭ್ಯವಿರುವ ಪವಿತ್ರ ದೇವಾಲಯಗಳು' : 'Revered Temples on the Network'}
              </h2>
            </div>
            <button
              onClick={() => handleExplore()}
              className="text-xs sm:text-sm font-bold text-[#c1440e] hover:underline cursor-pointer"
            >
              {language === 'KN' ? 'ಎಲ್ಲಾ ದೇವಾಲಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ →' : 'View All Active Temples →'}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {temples.map((temple) => {
              const loc = translateTemple(temple)
              return (
                <div
                  key={temple.id}
                  className="overflow-hidden rounded-2xl border border-[#eadfd1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={temple.image}
                      alt={loc.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 rounded-full bg-black/65 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white shadow-md border border-white/25">
                      {temple.id === 'kashi'
                        ? (language === 'KN' ? '🕉️ ಜ್ಯೋತಿರ್ಲಿಂಗ ಸನ್ನಿಧಿ' : '🕉️ Jyotirlinga Shrine')
                        : temple.id === 'venkateswara'
                        ? (language === 'KN' ? '🪔 ಶ್ರೀ ಬಾಲಾಜಿ ಸನ್ನಿಧಿ' : '🪔 Lord Balaji Shrine')
                        : (language === 'KN' ? '🌸 ದೇವಿ ಮೀನಾಕ್ಷಿ ಸನ್ನಿಧಿ' : '🌸 Devi Meenakshi Shrine')}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-[#34251e]">{loc.name}</h3>
                    <p className="mt-1 text-[11px] font-bold text-[#c1440e] uppercase tracking-wider flex items-center gap-1">
                      <span>📍</span> {loc.location}
                    </p>
                    <p className="mt-2 text-xs text-[#786657] line-clamp-2 leading-relaxed">{loc.description}</p>
                    <button
                      onClick={() => handleExplore(temple)}
                      className="mt-4 w-full rounded-xl bg-[#f5ede2] py-2 text-xs font-bold text-[#c1440e] transition hover:bg-[#c1440e] hover:text-white cursor-pointer"
                    >
                      {language === 'KN' ? 'ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Temple Sevas'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Final Spiritual Call-To-Action Banner ── */}
      <section className="bg-gradient-to-r from-[#2c170e] via-[#482819] to-[#2c170e] text-white px-5 py-16 lg:px-8 text-center border-t border-[#d4a64a]/30">
        <div className="mx-auto max-w-3xl">
          <span className="text-3xl animate-diya">🪔</span>
          <h2 className="mt-4 font-serif text-2xl sm:text-4xl font-bold leading-tight">
            {language === 'KN'
              ? 'ನಿಮ್ಮ ಭಕ್ತಿ ಮತ್ತು ಪ್ರಾರ್ಥನೆಗಳಿಗೆ ದೈವಿಕ ಆಶೀರ್ವಾದ ಸದಾ ಇರಲಿ'
              : 'Let Every Devout Prayer Receive Sacred Divine Grace'}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#e2d5c5] max-w-xl mx-auto leading-relaxed">
            {language === 'KN'
              ? 'ನಿಮ್ಮ ಕುಟುಂಬದ ಹೆಸರಿನಲ್ಲಿ ಶಾಸ್ತ್ರೋಕ್ತ ಪೂಜೆಗಳನ್ನು ಕಾಯ್ದಿರಿಸಿ, ಪವಿತ್ರ ಪ್ರಸಾದವನ್ನು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ಸ್ವೀಕರಿಸಿ.'
              : 'Book authentic Vedic pujas with your family sankalpa today and receive holy consecrated prasadam safely delivered to your doorstep.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleExplore()}
              className="btn-primary sheen-card px-8 py-3.5 text-sm font-bold shadow-xl cursor-pointer"
            >
              <span className="mr-2">🪔</span>
              {language === 'KN' ? 'ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ & ಕಾಯ್ದಿರಿಸಿ' : 'Book Sacred Seva Online'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white hover:text-[#34251e] cursor-pointer"
            >
              {language === 'KN' ? 'ಮುಖಪುಟ' : 'Return Home'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
