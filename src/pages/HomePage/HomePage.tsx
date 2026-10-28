import { useLanguage } from '../../contexts/LanguageContext'
import type { Temple, User } from '../../types'
import { IonIcon } from '../../components/IonIcon'
import { HowTempleSevaWorks } from '../../components/HowTempleSevaWorks/HowTempleSevaWorks'
import { WhyChooseTempleSeva } from '../../components/WhyChooseTempleSeva/WhyChooseTempleSeva'
import { GoldenTempleVisual } from '../../components/GoldenTempleVisual/GoldenTempleVisual'
import FaqSection from '../../components/FaqSection/FaqSection'

interface HomePageProps {
  navigateToSevas: (temple?: Temple) => void
  onRegister: () => void
  onLogin?: () => void
  onSwitchTemple?: () => void
  onSelectTempleDirect?: (templeId: string) => void
  user?: User | null
  selectedTemple?: Temple | null
}

const HomePage = ({ navigateToSevas, user: _user, selectedTemple: _selectedTemple }: HomePageProps) => {
  const { language, t } = useLanguage()

  return (
    <main className="bg-[#fffcf6] text-[#34251e] overflow-hidden">
      {/* ── 1. Sacred Hero Section with Divine Text & Golden Temple Visual ── */}
      <section
        id="hero"
        className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-8 lg:py-16 scroll-mt-20"
      >
        <div>
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

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigateToSevas()}
              className="btn-primary sheen-card shadow-lg px-7 py-3.5 text-sm font-bold text-center justify-center cursor-pointer"
            >
              <span className="animate-diya mr-2">🪔</span>
              {language === 'KN' ? 'ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Sevas'}
            </button>
          </div>
        </div>

        {/* ── Sacred Golden Temple Visual (Animated & Cloud-Free) ── */}
        <GoldenTempleVisual />
      </section>

      {/* ── 2. Sacred Journey Steps Marquee Ticker ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2c170e] via-[#482819] to-[#2c170e] py-3 text-white border-y border-[#d4a64a]/30 shadow-md">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold tracking-wider flex items-center gap-8">
          {[1, 2].map((cycle) => (
            <div key={cycle} className="flex items-center gap-8">
              <span className="flex items-center gap-2">
                <IonIcon name="business-outline" className="text-[#f2c778] text-base" />
                <span className="uppercase tracking-wider">{language === 'KN' ? 'ದೇವಾಲಯ ಆಯ್ಕೆಮಾಡಿ' : 'Choose Temple'}</span>
              </span>
              <span className="text-[#f2c778] text-sm select-none">✦</span>
              <span className="flex items-center gap-2">
                <IonIcon name="flame-outline" className="text-[#f2c778] text-base" />
                <span className="uppercase tracking-wider">{language === 'KN' ? 'ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ' : 'Book Seva'}</span>
              </span>
              <span className="text-[#f2c778] text-sm select-none">✦</span>
              <span className="flex items-center gap-2">
                <IonIcon name="card-outline" className="text-[#f2c778] text-base" />
                <span className="uppercase tracking-wider">{language === 'KN' ? 'ಪಾವತಿ ಮಾಡಿ' : 'Make Payment'}</span>
              </span>
              <span className="text-[#f2c778] text-sm select-none">✦</span>
              <span className="flex items-center gap-2">
                <IonIcon name="qr-code-outline" className="text-[#f2c778] text-base" />
                <span className="uppercase tracking-wider">{language === 'KN' ? 'ಸೇವೆ ಪಡೆಯಲು QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' : 'Scan QR Code to Receive the Seva'}</span>
              </span>
              <span className="text-[#f2c778] text-sm select-none">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. How It Works Section ── */}
      <HowTempleSevaWorks />

      {/* ── 4. Why Choose Temple Seva Section ── */}
      <WhyChooseTempleSeva />

      {/* ── 5. Frequently Asked Questions Section ── */}
      <FaqSection />
    </main>
  )
}

export default HomePage
