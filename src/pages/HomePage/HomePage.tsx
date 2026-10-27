import { useState } from 'react'
import { temples, categories, sevas, STORAGE_TEMPLE } from '../../data'
import { readJson } from '../../utils/storage'
import { useToast } from '../../contexts/ToastContext'
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
  onSelectTempleDirect?: (templeId: string) => void
  user?: User | null
  selectedTemple?: Temple | null
}

const HomePage = ({ navigateToSevas, user, selectedTemple }: HomePageProps) => {
  const isLoggedIn = !!user
  const { addToast } = useToast()
  const { language, t, translateTemple, translateCategory } = useLanguage()

  // Active selected temple for highlighting cards with "Active" badge
  // STRICT RULE: If user is not registered or logged in, NO temple should ever show the Active Badge.
  // After user selects the temple after successful login, only then should the Active Badge be shown.
  const savedTemple = readJson<Temple | null>(STORAGE_TEMPLE, null)
  const activeTempleId = isLoggedIn ? (selectedTemple?.id || savedTemple?.id || null) : null

  const currentSelectedTemple = activeTempleId
    ? translateTemple(temples.find((t) => t.id === activeTempleId) || temples[0])
    : null

  const getTempleShrineInfo = (templeId: string, lang: string) => {
    let label = lang === 'KN' ? 'ಪವಿತ್ರ ಸನ್ನಿಧಿ' : 'Sacred Shrine'
    if (templeId === 'kashi') {
      label = lang === 'KN' ? 'ಜ್ಯೋತಿರ್ಲಿಂಗ ಸನ್ನಿಧಿ' : 'Jyotirlinga Shrine'
    } else if (templeId === 'venkateswara') {
      label = lang === 'KN' ? 'ಶ್ರೀ ಬಾಲಾಜಿ ಸನ್ನಿಧಿ' : 'Lord Balaji Shrine'
    } else if (templeId === 'meenakshi') {
      label = lang === 'KN' ? 'ದೇವಿ ಮೀನಾಕ್ಷಿ ಸನ್ನಿಧಿ' : 'Devi Meenakshi Shrine'
    }
    return {
      icon: 'star',
      label,
    }
  }






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
          <div className="flex items-center gap-2 text-[11px] text-[#f2c778] font-semibold">
            {user && currentSelectedTemple ? (
              <span className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
                <span className="text-[#d4a64a] font-bold">
                  {language === 'KN' ? 'ಆಯ್ಕೆಮಾಡಿದ ದೇವಾಲಯ:' : 'Selected Temple:'}
                </span>
                <span className="text-white font-bold">{currentSelectedTemple.name}</span>
                <span className="text-[#f2c778]/70">·</span>
                <span className="text-[#e2d5c5] flex items-center gap-1">
                  <IonIcon name="location-sharp" className="text-[#f2c778] text-xs shrink-0" />
                  <span>{currentSelectedTemple.location}</span>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
                <span className="text-[#d4a64a] font-bold">
                  {language === 'KN' ? 'ಇಷ್ಟದ ದೇವಾಲಯ ಆಯ್ಕೆಮಾಡಿ,' : 'Choose Preferred Temple,'}
                </span>
                <span className="text-[#f2c778]">
                  {language === 'KN'
                    ? '🙏 ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸೇವೆ ಕಾಯ್ದಿರಿಸಿ · 🛕 ದೈವಿಕ ಸನ್ನಿಧಾನದೊಂದಿಗೆ ಬೆಸೆಯಿರಿ'
                    : '🙏 Book Your Seva Online · 🛕 Connect with the Divine'}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Standard Elevated Hero Section ── */}
      <section
        id="about"
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

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <a href="#temples" className="btn-primary sheen-card shadow-lg px-7 py-3.5 text-sm font-bold text-center justify-center">
              <span className="animate-diya mr-2">🪔</span>
              {t('heroExploreTemples')}
            </a>
            <button
              onClick={() => navigateToSevas()}
              className="rounded-full border-2 border-[#d9cabb] bg-white px-7 py-3 text-sm font-bold shadow-2xs transition hover:border-[#c1440e] hover:shadow-md cursor-pointer text-[#34251e] text-center"
            >
              {t('heroBookSeva')}
            </button>
          </div>
        </div>

        {/* ── Sacred Golden Temple Visual (Animated & Cloud-Free) ── */}
        <GoldenTempleVisual />
      </section>

      {/* ── 3. Sacred Journey Steps Marquee Ticker ── */}
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

      {/* ── 4. Grand Temples Showcase (The 3 Holy Sanctuaries) ── */}
      <section id="temples" className="px-5 pt-8 pb-7 sm:pt-10 sm:pb-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e]">
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
              const isSelected = Boolean(isLoggedIn && activeTempleId && activeTempleId === originalTemple.id)
              const shrineInfo = getTempleShrineInfo(originalTemple.id, language)

              return (
                <article
                  key={temple.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 relative cursor-pointer ${
                    isSelected
                      ? 'border-[#c1440e] bg-[#fffbf7] shadow-xl ring-2 ring-[#c1440e]/30'
                      : 'border-[#eadfd1] bg-white shadow-sm hover:shadow-xl'
                  }`}
                  onClick={() => navigateToSevas(originalTemple)}
                >
                  <div>
                    {/* Temple Banner Image with Overlay */}
                    <div className="relative overflow-hidden h-64 sm:h-72">
                      <img
                        loading="lazy"
                        src={temple.image}
                        alt={temple.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                      
                      {/* Top Left: Active Badge (Only for selected temple) */}
                      {isSelected && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-600/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md border border-emerald-300/40">
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          <span>{language === 'KN' ? 'ಸಕ್ರಿಯ' : 'Active'}</span>
                        </div>
                      )}

                      {/* Top Right: Sacred Shrine Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white shadow-md border border-white/25">
                        <IonIcon name={shrineInfo.icon} className="text-[#f8d07e] text-xs" />
                        <span>{shrineInfo.label}</span>
                      </div>

                      {/* Bottom Left: Temple Name & Address Overlaid on Image */}
                      <div className="absolute bottom-3.5 left-4 right-4 text-left">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md group-hover:text-[#f8d07e] transition-colors">
                          {temple.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#f8d07e] drop-shadow-sm">
                          <IonIcon name="location-sharp" className="text-[#f8d07e] text-sm shrink-0" />
                          <span className="text-white/90">{temple.location}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action CTA */}
                  <div className="p-4 sm:p-5">
                    <button
                      type="button"
                      className={`w-full rounded-2xl py-3 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'bg-[#c1440e] text-white border-2 border-[#c1440e] hover:bg-[#a53809]'
                          : 'border-2 border-[#34251e] text-[#34251e] group-hover:border-[#c1440e] group-hover:bg-[#c1440e] group-hover:text-white'
                      }`}
                    >
                      <span>
                        {isSelected
                          ? (language === 'KN' ? 'ಸಕ್ರಿಯ ದೇವಾಲಯ · ಸೇವೆಗಳನ್ನು ನೋಡಿ' : 'Active Sanctuary · View Sevas')
                          : t('viewAvailableSevas')}
                      </span>
                      <IonIcon name="arrow-forward" className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 8. How It Works, Why Choose Us & FAQ Sections (Available For All Devotees) ── */}
      {/* How It Works Section */}
      <HowTempleSevaWorks />

      {/* Why Choose Temple Seva Section */}
      <WhyChooseTempleSeva />

      {/* Frequently Asked Questions Section */}
      <FaqSection />

    </main>
  )
}

export default HomePage
