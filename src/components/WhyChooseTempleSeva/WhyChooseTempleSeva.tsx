import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export const WhyChooseTempleSeva: React.FC = () => {
  const { language } = useLanguage()
  const isKn = language === 'KN'

  const features = [
    {
      id: 'convenient-booking',
      title: isKn ? 'ಅನುಕೂಲಕರ ಬುಕಿಂಗ್' : 'Convenient Booking',
      sub: isKn ? 'ಎಲ್ಲಿಂದಲಾದರೂ ಬುಕ್ ಮಾಡಿ.' : 'Book from anywhere.',
      desc: isKn
        ? 'ನಿಮ್ಮ ಮನೆಯಿಂದಲೇ ಅಥವಾ ಪ್ರಯಾಣದಲ್ಲಿರುವಾಗ ನಿಮ್ಮ ಸೇವೆಗಳು, ಪೂಜೆಗಳು ಮತ್ತು ದರ್ಶನಗಳನ್ನು ಸುಲಭವಾಗಿ ಬುಕ್ ಮಾಡಿ.'
        : 'Book your sevas, poojas, and darshans from the comfort of your home or on the go.',
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Saffron Globe */}
          <circle cx="27" cy="35" r="19" stroke="#c1440e" strokeWidth="2.5" fill="#fffcf6" />
          <ellipse cx="27" cy="35" rx="9" ry="19" stroke="#c1440e" strokeWidth="1.8" fill="none" />
          <line x1="8" y1="35" x2="46" y2="35" stroke="#c1440e" strokeWidth="1.8" />
          <line x1="27" y1="16" x2="27" y2="54" stroke="#c1440e" strokeWidth="1.8" />
          {/* Amber Calendar */}
          <rect x="34" y="11" width="22" height="19" rx="3" fill="#d49e4d" />
          <rect x="37" y="17" width="16" height="10" rx="1" fill="#fff" />
          <line x1="39" y1="8" x2="39" y2="13" stroke="#c1440e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="51" y1="8" x2="51" y2="13" stroke="#c1440e" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="41" cy="20.5" r="1" fill="#c1440e" />
          <circle cx="45" cy="20.5" r="1" fill="#c1440e" />
          <circle cx="49" cy="20.5" r="1" fill="#c1440e" />
          <circle cx="41" cy="24" r="1" fill="#c1440e" />
          <circle cx="45" cy="24" r="1" fill="#c1440e" />
          <circle cx="49" cy="24" r="1" fill="#c1440e" />
          {/* Golden Amber Pointer Hand */}
          <path
            d="M42 37 L42 45 C42 49 46 52 50 52 C54 52 56 49 56 45 L56 42 C56 41 55 40 54 40 C53 40 52.5 40.8 52.5 41.5 L52.5 40.5 C52.5 39.5 51.5 39 50.5 39 C49.5 39 49 39.8 49 40.5 L49 39.5 C49 38.5 48 38 47 38 C46 38 45.5 38.8 45.5 39.5 L45.5 37 C45.5 35.8 44 35 43 35.8 C42.2 36.4 42 37 42 37 Z"
            fill="#d49e4d"
            stroke="#92400e"
            strokeWidth="1"
          />
        </svg>
      ),
    },
    {
      id: 'secure-payments',
      title: isKn ? 'ಸುರಕ್ಷಿತ ಪಾವತಿಗಳು' : 'Secure Payments',
      sub: isKn ? 'ಸುರಕ್ಷಿತ ಗೇಟ್‌ವೇ ಮೂಲಕ ಪಾವತಿಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.' : 'Complete payments through a secure gateway.',
      desc: isKn
        ? 'ವಹಿವಾಟುಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದ್ದು, UPI, ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಬೆಂಬಲಿಸುತ್ತವೆ.'
        : 'Transactions are fully encrypted and safe, supporting UPI, cards, and net banking.',
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Shield in Saffron Vermilion */}
          <path
            d="M12 18 C12 18 24 13 26 13 C28 13 40 18 40 18 C40 34 26 44 26 44 C26 44 12 34 12 18 Z"
            fill="#c1440e"
          />
          {/* Checkmark inside shield */}
          <path
            d="M19 28 L24 33 L33 22"
            stroke="#fde68a"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Credit Card in Rich Saffron & Cream */}
          <rect x="29" y="27" width="28" height="18" rx="3" fill="#c1440e" stroke="#fffcf6" strokeWidth="1.5" />
          <rect x="29" y="32" width="28" height="4" fill="#782006" />
          <rect x="33" y="39.5" width="8" height="2" fill="#d49e4d" rx="0.5" />
          {/* Padlock in Amber Gold */}
          <rect x="43" y="38" width="12" height="13" rx="2" fill="#d49e4d" stroke="#92400e" strokeWidth="1" />
          <path d="M46 38 V34.5 C46 32 52 32 52 34.5 V38" stroke="#d49e4d" strokeWidth="2.5" fill="none" />
          <circle cx="49" cy="43.5" r="1.3" fill="#782006" />
        </svg>
      ),
    },
    {
      id: 'qr-confirmation',
      title: isKn ? 'ಕ್ಯೂಆರ್ ಆಧಾರಿತ ದೃಢೀಕರಣ' : 'QR-Based Confirmation',
      sub: isKn ? 'ನಿಮ್ಮ ಬುಕಿಂಗ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ಪಡೆಯಿರಿ.' : 'Access your booking QR code.',
      desc: isKn
        ? 'ದೇವಾಲಯದಲ್ಲಿ ತ್ವರಿತ, ಸಂಪರ್ಕರಹಿತ ಪರಿಶೀಲನೆಗಾಗಿ QR ಕೋಡ್‌ನೊಂದಿಗೆ ತ್ವರಿತ ಡಿಜಿಟಲ್ ಪಾಸ್ ಪಡೆಯಿರಿ.'
        : 'Get instant digital tickets with QR codes for fast, contact-free check-ins at the temple.',
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Website / Desktop Browser Frame in Saffron */}
          <rect x="7" y="10" width="50" height="40" rx="4" fill="#c1440e" />
          {/* Browser Navigation Bar (3 dots) */}
          <circle cx="13" cy="15" r="1.5" fill="#fde68a" />
          <circle cx="18" cy="15" r="1.5" fill="#fde68a" />
          <circle cx="23" cy="15" r="1.5" fill="#fde68a" />
          {/* Browser URL / Address Bar */}
          <rect x="28" y="13" width="25" height="4.5" rx="2.25" fill="#782006" />
          <rect x="31" y="14.8" width="13" height="1" rx="0.5" fill="#fde68a" opacity="0.85" />

          {/* Webpage Canvas inside browser */}
          <rect x="10" y="20.5" width="44" height="26.5" rx="2" fill="#fffdfa" />

          {/* Website Header Bar with Sanctum Brand Accent */}
          <rect x="12.5" y="22.5" width="39" height="3" rx="1" fill="#fdeddb" />
          <circle cx="15" cy="24" r="0.9" fill="#c1440e" />
          <rect x="17.5" y="23.3" width="10" height="1.4" rx="0.7" fill="#701a23" />
          <rect x="44.5" y="23.3" width="5" height="1.4" rx="0.7" fill="#d49e4d" />

          {/* Webpage Content: Left Booking Summary */}
          <rect x="13" y="28" width="15" height="2.2" rx="0.8" fill="#701a23" />
          <rect x="13" y="32" width="18" height="1.4" rx="0.7" fill="#d49e4d" />
          <rect x="13" y="35" width="13" height="1.2" rx="0.6" fill="#9e8c80" />
          <rect x="13" y="38" width="11" height="1.2" rx="0.6" fill="#9e8c80" />
          {/* Confirmed Status Pill on Webpage */}
          <rect x="13" y="41.5" width="14" height="3.5" rx="1.75" fill="#ecfdf5" stroke="#10b981" strokeWidth="0.6" />
          <circle cx="15.5" cy="43.2" r="0.9" fill="#10b981" />
          <rect x="17.5" y="42.6" width="7" height="1.2" rx="0.6" fill="#047857" />

          {/* Webpage Content: Right Digital Pass Card with QR Code */}
          <rect x="33.5" y="27.5" width="18" height="18" rx="2" fill="#fff9f2" stroke="#c1440e" strokeWidth="0.9" />

          {/* QR Code inside the Website */}
          {/* Top-Left Finder */}
          <rect x="35.5" y="29.5" width="4.5" height="4.5" fill="#701a23" />
          <rect x="36.5" y="30.5" width="2.5" height="2.5" fill="#fff" />
          <rect x="37.2" y="31.2" width="1.1" height="1.1" fill="#701a23" />
          {/* Top-Right Finder */}
          <rect x="44.5" y="29.5" width="4.5" height="4.5" fill="#701a23" />
          <rect x="45.5" y="30.5" width="2.5" height="2.5" fill="#fff" />
          <rect x="46.2" y="31.2" width="1.1" height="1.1" fill="#701a23" />
          {/* Bottom-Left Finder */}
          <rect x="35.5" y="37.5" width="4.5" height="4.5" fill="#701a23" />
          <rect x="36.5" y="38.5" width="2.5" height="2.5" fill="#fff" />
          <rect x="37.2" y="39.2" width="1.1" height="1.1" fill="#701a23" />
          {/* Inner QR Matrix Bits */}
          <rect x="41.5" y="30" width="1.4" height="1.4" fill="#c1440e" />
          <rect x="41.5" y="32.5" width="1.4" height="1.4" fill="#d49e4d" />
          <rect x="41.5" y="37.5" width="1.4" height="1.4" fill="#c1440e" />
          <rect x="41.5" y="40" width="1.4" height="1.4" fill="#701a23" />
          <rect x="44.5" y="35.5" width="1.8" height="1.4" fill="#c1440e" />
          <rect x="47" y="35.5" width="1.8" height="1.4" fill="#d49e4d" />
          <rect x="44.5" y="38" width="1.8" height="1.4" fill="#701a23" />
          <rect x="47" y="40" width="1.8" height="1.4" fill="#c1440e" />

          {/* Desktop Monitor Stand Base */}
          <rect x="27" y="50" width="10" height="3" rx="0.5" fill="#782006" />
          <rect x="22" y="53" width="20" height="2.5" rx="1.25" fill="#c1440e" />
        </svg>
      ),
    },
    {
      id: 'easy-management',
      title: isKn ? 'ಸುಲಭ ಬುಕಿಂಗ್ ನಿರ್ವಹಣೆ' : 'Easy Booking Management',
      sub: isKn ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಬುಕಿಂಗ್‌ಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ವೀಕ್ಷಿಸಿ.' : 'View your bookings in one place.',
      desc: isKn
        ? 'ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಸಕ್ರಿಯ ಮತ್ತು ಹಿಂದಿನ ಬುಕಿಂಗ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ಬುಕ್ ಮಾಡಿ ಅಥವಾ ವೀಕ್ಷಿಸಿ.'
        : 'Easily book or view your active and past bookings anytime.',
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          {/* Browser Window in Saffron */}
          <rect x="10" y="16" width="38" height="28" rx="4" fill="#c1440e" />
          {/* 3 browser dots */}
          <circle cx="16" cy="22" r="1.5" fill="#fde68a" />
          <circle cx="21" cy="22" r="1.5" fill="#fde68a" />
          <circle cx="26" cy="22" r="1.5" fill="#fde68a" />
          {/* Content area */}
          <rect x="13.5" y="26.5" width="31" height="14" rx="2" fill="#782006" />
          {/* Lines / rows */}
          <rect x="16.5" y="29.5" width="12" height="2" rx="0.5" fill="#d49e4d" />
          <rect x="16.5" y="33.5" width="25" height="1.5" rx="0.5" fill="#fff" opacity="0.85" />
          <rect x="16.5" y="36.5" width="19" height="1.5" rx="0.5" fill="#fff" opacity="0.65" />
          {/* Amber Clock on bottom right */}
          <circle cx="44" cy="42" r="11" fill="#d49e4d" stroke="#fffcf6" strokeWidth="2.5" />
          {/* Clock hands */}
          <path d="M44 36 V42 L48 44" stroke="#782006" strokeWidth="2" strokeLinecap="round" />
          <circle cx="44" cy="42" r="1.2" fill="#782006" />
        </svg>
      ),
    },
  ]

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-gradient-to-b from-[#fcf7ef] via-[#faf1e4] to-[#fbf5eb] pt-7 sm:pt-9 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#eadfd1] scroll-mt-20"
    >
      {/* Anchor aliases for smooth navigation */}
      <span id="why-temple-seva" className="absolute -top-20" />
      <span id="trust" className="absolute -top-20" />
      {/* Decorative Subtle Corner Mandalas */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-[0.06] pointer-events-none select-none -translate-x-12 -translate-y-12">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="#c1440e" strokeWidth="1.5">
          <circle cx="100" cy="100" r="80" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="20" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="100"
              x2={100 + 80 * Math.cos((deg * Math.PI) / 180)}
              y2={100 + 80 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.06] pointer-events-none select-none translate-x-12 -translate-y-12">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="#c1440e" strokeWidth="1.5">
          <circle cx="100" cy="100" r="80" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="20" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="100"
              x2={100 + 80 * Math.cos((deg * Math.PI) / 180)}
              y2={100 + 80 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Section Header (Identical Styling to How Temple Seva Works) ── */}
        <div className="text-center max-w-3xl mx-auto mb-9 sm:mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e]">
            {isKn ? 'ಟೆಂಪಲ್ ಸೇವಾವನ್ನು ಏಕೆ ಆರಿಸಬೇಕು?' : 'Why Choose Temple Seva?'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b584c] font-medium leading-relaxed">
            {isKn
              ? 'ನಮ್ಮ ಸುಲಭ ಸೇವೆಗಳೊಂದಿಗೆ ತಡೆರಹಿತ ಭಕ್ತಿಯನ್ನು ಅನುಭವಿಸಿ.'
              : 'Experience seamless devotion with our hassle-free services.'}
          </p>
        </div>

        {/* ── 2x2 Feature Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-4 sm:gap-5 rounded-2xl bg-white p-6 sm:p-7 border border-[#eadfd1] shadow-sm hover:shadow-md hover:border-[#c1440e] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Left Icon Container in Temple Gold / Cream Palette */}
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-gradient-to-b from-[#fffaf2] to-[#faedd9] border border-[#e5b875]/80 flex items-center justify-center p-2.5 shrink-0 shadow-sm group-hover:scale-105 group-hover:border-[#c1440e] transition-all duration-300">
                {item.icon}
              </div>

              {/* Right Text Block */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#34251e] group-hover:text-[#c1440e] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-[#c1440e] mt-1 leading-snug">
                  {item.sub}
                </p>
                <p className="text-xs sm:text-[13px] text-[#786657] leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseTempleSeva
