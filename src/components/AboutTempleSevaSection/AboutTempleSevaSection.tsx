import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

export const AboutTempleSevaSection: React.FC = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isKn = language === 'KN'

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-[#fffcf7] via-[#faf3e6] to-[#fbf5eb] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#eadfd1]">
      {/* Decorative Traditional Background Ambient Rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f8d7b0]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#c1440e]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left Content Column (6 cols) ── */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag / Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5b875] bg-[#fffaf2] px-3.5 py-1 text-xs font-bold uppercase tracking-[.2em] text-[#c1440e] shadow-2xs mb-4">
              <span className="text-sm">🪔</span>
              <span>{isKn ? 'ಟೆಂಪಲ್ ಸೇವಾ ಕುರಿತು' : 'About Temple Seva'}</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e] leading-[1.15] tracking-tight">
              {isKn ? 'ಭಕ್ತಿಯನ್ನು ನಿಮ್ಮ ಸನಿಹಕ್ಕೆ ತರುತ್ತಿದ್ದೇವೆ' : 'Bringing Devotion Closer to You'}
            </h2>

            {/* Platform Purpose Explanation */}
            <p className="mt-5 text-base sm:text-lg text-[#5c4a40] leading-relaxed font-normal">
              {isKn
                ? 'ಟೆಂಪಲ್ ಸೇವಾ ಎಂಬುದು ಪ್ರಪಂಚದಾದ್ಯಂತದ ಭಕ್ತರನ್ನು ಭಾರತದ ಪವಿತ್ರ ಮತ್ತು ಪ್ರಾಚೀನ ದೇವಾಲಯಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ವಿಶ್ವಾಸಾರ್ಹ ಆಧ್ಯಾತ್ಮಿಕ ವೇದಿಕೆಯಾಗಿದೆ. ಅಧಿಕೃತ ದೇವಾಲಯಗಳ ಸಹಭಾಗಿತ್ವದೊಂದಿಗೆ, ನಿಮ್ಮ ಮನೆಯಿಂದಲೇ ಶಾಸ್ತ್ರೋಕ್ತ ಸೇವೆಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲು, ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಲು ಮತ್ತು ದೈವಿಕ ಪ್ರಸಾದವನ್ನು ಸ್ವೀಕರಿಸಲು ನಾವು ನೆರವಾಗುತ್ತೇವೆ.'
                : 'TempleSeva is a dedicated spiritual platform connecting devotees across the world with ancient, participating temples. Through authenticated temple partnerships, we empower you to reserve authentic Vedic rituals, partake in holy sevas with personalized Gotra sankalpa, and receive consecrated prasadam—seamlessly bridging tradition and devotion.'}
            </p>

            {/* 3 Pillars / Key Benefits Feature List */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="rounded-2xl border border-[#eadfd1] bg-white/90 backdrop-blur-xs p-4 shadow-2xs hover:border-[#c1440e] transition-colors">
                <div className="text-xl mb-1.5">🛕</div>
                <h3 className="font-bold text-sm text-[#34251e]">
                  {isKn ? 'ನೇರ ದೇವಾಲಯ ಸಂಪರ್ಕ' : 'Sanctum Partnership'}
                </h3>
                <p className="text-xs text-[#786657] mt-1 leading-snug">
                  {isKn ? 'ಪ್ರಮಾಣೀಕೃತ ದೇವಾಲಯಗಳೊಂದಿಗೆ ನೇರ ಸಹಭಾಗಿತ್ವ.' : 'Authentic rituals in sanctum sanctorum.'}
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadfd1] bg-white/90 backdrop-blur-xs p-4 shadow-2xs hover:border-[#c1440e] transition-colors">
                <div className="text-xl mb-1.5">📜</div>
                <h3 className="font-bold text-sm text-[#34251e]">
                  {isKn ? 'ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪ' : 'Vedic Sankalpa'}
                </h3>
                <p className="text-xs text-[#786657] mt-1 leading-snug">
                  {isKn ? 'ನಿಮ್ಮ ಗೋತ್ರ ಮತ್ತು ಹೆಸರಿನಲ್ಲಿ ಪೂಜೆ.' : 'Your Gotra & name recited by priests.'}
                </p>
              </div>

              <div className="rounded-2xl border border-[#eadfd1] bg-white/90 backdrop-blur-xs p-4 shadow-2xs hover:border-[#c1440e] transition-colors">
                <div className="text-xl mb-1.5">📦</div>
                <h3 className="font-bold text-sm text-[#34251e]">
                  {isKn ? 'ಪವಿತ್ರ ಪ್ರಸಾದ' : 'Blessed Prasadam'}
                </h3>
                <p className="text-xs text-[#786657] mt-1 leading-snug">
                  {isKn ? 'ಶುದ್ಧ ಪ್ಯಾಕಿಂಗ್‌ನಲ್ಲಿ ಮನೆಗೆ ತಲುಪಿಸಲಾಗುತ್ತದೆ.' : 'Hygienically dispatched to your door.'}
                </p>
              </div>
            </div>

            {/* CTA Button: Learn More About Us */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#c1440e] to-[#df5619] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:shadow-xl hover:from-[#a53809] hover:to-[#c1440e] transition-all duration-300 cursor-pointer active:scale-95"
              >
                <span>{isKn ? 'ನಮ್ಮ ಕುರಿತು ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ' : 'Learn More About Us'}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>
            </div>
          </div>

          {/* ── Right Creative Visual Showcase Column (5 cols) ── */}
          <div className="lg:col-span-5 relative">
            {/* Outer Golden Glow & Decorative Framing */}
            <div className="relative mx-auto max-w-md">
              {/* Decorative Background Temple Architecture Halo */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#e5b875]/40 via-[#fcd34d]/20 to-[#c1440e]/20 blur-xl opacity-70" />

              {/* Main Visual Glassmorphism Showcase Card */}
              <div className="relative rounded-3xl border-2 border-[#e5b875] bg-white/95 backdrop-blur-md p-6 shadow-xl overflow-hidden">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-[#f0e3d0] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-[#c1440e] uppercase tracking-wider">
                      {isKn ? 'ಲೈವ್ ದೈವಿಕ ಸಂಪರ್ಕ' : 'Spiritual Connectivity'}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-serif text-[#786657]">Vedic Tradition</span>
                </div>

                {/* Creative Visual: Devotee to Temple Bridge Diagram */}
                <div className="space-y-3">
                  {/* Step 1: Devotee Worldwide */}
                  <div className="flex items-center gap-3 rounded-2xl bg-[#fdfaf5] border border-[#eadfd1] p-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-lg shrink-0">
                      🙏
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#34251e]">
                        {isKn ? 'ಭಕ್ತರು (ಪ್ರಪಂಚದಾದ್ಯಂತ)' : 'Devotees Worldwide'}
                      </p>
                      <p className="text-[11px] text-[#786657] truncate">
                        {isKn ? 'ಮನೆಯಿಂದಲೇ ಆನ್‌ಲೈನ್ ಸೇವಾ ಬುಕಿಂಗ್' : 'Book Sevas & Gotra Sankalpa online'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                      Step 1
                    </span>
                  </div>

                  {/* Flow Bridge Indicator */}
                  <div className="flex items-center justify-center py-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#c1440e] font-bold">
                      <span className="w-6 h-[1.5px] bg-[#c1440e]/40" />
                      <span className="text-xs">ॐ</span>
                      <span className="text-[11px] uppercase tracking-widest text-[#786657]">
                        {isKn ? 'ನೇರ ಸಂಪರ್ಕ' : 'Live Gateway'}
                      </span>
                      <span className="text-xs">ॐ</span>
                      <span className="w-6 h-[1.5px] bg-[#c1440e]/40" />
                    </div>
                  </div>

                  {/* Step 2: Participating Heritage Temples */}
                  <div className="flex items-center gap-3 rounded-2xl bg-[#fffbf2] border-2 border-[#e5b875] p-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c1440e] to-[#df5619] text-white flex items-center justify-center text-lg shrink-0 shadow-2xs">
                      🛕
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#c1440e]">
                        {isKn ? 'ಭಾಗವಹಿಸುವ ಪವಿತ್ರ ದೇವಾಲಯಗಳು' : 'Participating Temples'}
                      </p>
                      <p className="text-[11px] text-[#786657] truncate">
                        {isKn ? 'ವೇದ ಪುರೋಹಿತರಿಂದ ಗರ್ಭಗುಡಿ ಸೇವೆ' : 'Priests perform rituals in the sanctum'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      ✓ Active
                    </span>
                  </div>

                  {/* Step 3: Blessings & Prasadam Received */}
                  <div className="flex items-center gap-3 rounded-2xl bg-[#fdfaf5] border border-[#eadfd1] p-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-lg shrink-0">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#34251e]">
                        {isKn ? 'ದೈವಿಕ ಆಶೀರ್ವಾದ & ಪ್ರಸಾದ' : 'Divine Blessings & Prasadam'}
                      </p>
                      <p className="text-[11px] text-[#786657] truncate">
                        {isKn ? 'ಮನೆ ಬಾಗಿಲಿಗೆ ರವಾನೆಯಾದ ಪ್ರಸಾದ' : 'Blessed prasadam delivered to your doorstep'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Step 3
                    </span>
                  </div>
                </div>

                {/* Bottom Quote Banner */}
                <div className="mt-4 pt-3 border-t border-[#f0e3d0] flex items-center justify-between text-[11px] text-[#786657]">
                  <span className="flex items-center gap-1">
                    <span className="text-[#c1440e]">✨</span>
                    <span>100% Authentic Sankalpa</span>
                  </span>
                  <span className="font-bold text-[#c1440e]">Vedic Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutTempleSevaSection
