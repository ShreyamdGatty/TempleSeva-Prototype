import { useState, useMemo } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../IonIcon'

interface FaqItem {
  id: string
  categoryId: 'booking' | 'qr' | 'account'
  questionEn: string
  questionKn: string
  answerEn: string
  answerKn: string
  stepsEn?: string[]
  stepsKn?: string[]
}

interface CategoryOption {
  id: 'all' | 'booking' | 'qr' | 'account'
  labelEn: string
  labelKn: string
  icon: string
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', labelEn: 'All Questions', labelKn: 'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು', icon: 'sparkles-outline' },
  { id: 'booking', labelEn: 'Seva Booking', labelKn: 'ಸೇವಾ ಕಾಯ್ದಿರಿಸುವಿಕೆ', icon: 'flame-outline' },
  { id: 'qr', labelEn: 'QR & Check-in', labelKn: 'ಕ್ಯೂಆರ್ ಮತ್ತು ಪ್ರವೇಶ', icon: 'qr-code-outline' },
  { id: 'account', labelEn: 'My Bookings & Account', labelKn: 'ಖಾತೆ ಮತ್ತು ವಿವರಗಳು', icon: 'person-circle-outline' },
]

/**
 * The 5 Official Guide Questions
 */
const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    categoryId: 'booking',
    questionEn: 'How do I book a seva?',
    questionKn: 'ಸೇವೆಯನ್ನು ಹೇಗೆ ಕಾಯ್ದಿರಿಸುವುದು?',
    answerEn: 'Select your desired seva on our portal, choose the date, and complete the booking.',
    answerKn: 'ನಮ್ಮ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಇಷ್ಟದ ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ದಿನಾಂಕವನ್ನು ಆರಿಸಿ ಮತ್ತು ಕಾಯ್ದಿರಿಸುವಿಕೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
    stepsEn: [
      'Choose your preferred temple and select the sacred seva.',
      'Pick an auspicious date on the panchangam calendar.',
      'Enter devotee Sankalpa details and complete secure checkout.',
    ],
    stepsKn: [
      'ನಿಮ್ಮ ಇಷ್ಟದ ದೇವಾಲಯ ಮತ್ತು ಪವಿತ್ರ ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      'ಪಂಚಾಂಗ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಶುಭ ದಿನಾಂಕವನ್ನು ಆರಿಸಿ.',
      'ಭಕ್ತರ ಸಂಕಲ್ಪ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ.',
    ],
  },
  {
    id: 'faq-2',
    categoryId: 'qr',
    questionEn: 'How do I receive my QR code?',
    questionKn: 'ನನ್ನ ಕ್ಯೂಆರ್ ಕೋಡ್ ಅನ್ನು ನಾನು ಹೇಗೆ ಪಡೆಯುವುದು?',
    answerEn: 'Your unique QR code will be instantly sent to your registered email and via SMS/WhatsApp upon successful booking.',
    answerKn: 'ಯಶಸ್ವಿ ಕಾಯ್ದಿರಿಸುವಿಕೆಯ ನಂತರ ನಿಮ್ಮ ಅನನ್ಯ ಕ್ಯೂಆರ್ ಕೋಡ್ ಅನ್ನು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಮತ್ತು SMS/WhatsApp ಮೂಲಕ ತಕ್ಷಣ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.',
  },
  {
    id: 'faq-3',
    categoryId: 'booking',
    questionEn: 'Can I book a seva for a family member?',
    questionKn: 'ಕುಟುಂಬದ ಸದಸ್ಯರ ಪರವಾಗಿ ನಾನು ಸೇವೆ ಕಾಯ್ದಿರಿಸಬಹುದೇ?',
    answerEn: 'Yes! You can add their details and book sevas on behalf of your family members and loved ones.',
    answerKn: 'ಹೌದು! ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರು ಮತ್ತು ಪ್ರೀತಿಪಾತ್ರರ ಪರವಾಗಿ ನೀವು ಅವರ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ ಸೇವೆಗಳನ್ನು ಕಾಯ್ದಿರಿಸಬಹುದು.',
  },
  {
    id: 'faq-4',
    categoryId: 'account',
    questionEn: 'How can I view my booking?',
    questionKn: 'ನನ್ನ ಕಾಯ್ದಿರಿಸುವಿಕೆಯನ್ನು ನಾನು ಹೇಗೆ ವೀಕ್ಷಿಸಬಹುದು?',
    answerEn: 'Log in to your account and go to the \'My Bookings\' section, or check the confirmation email sent to you.',
    answerKn: 'ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಆಗಿ \'ನನ್ನ ಸೇವೆಗಳು\' ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ, ಅಥವಾ ನಿಮಗೆ ಕಳುಹಿಸಲಾದ ದೃಢೀಕರಣ ಇಮೇಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ.',
  },
  {
    id: 'faq-5',
    categoryId: 'qr',
    questionEn: 'What should I bring when visiting the temple?',
    questionKn: 'ದೇವಾಲಯಕ್ಕೆ ಭೇಟಿ ನೀಡುವಾಗ ನಾನು ಏನನ್ನು ತರಬೇಕು?',
    answerEn: 'Please bring your QR code (digital or printed), a valid ID proof, and dress in traditional temple attire.',
    answerKn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕ್ಯೂಆರ್ ಕೋಡ್ (ಡಿಜಿಟಲ್ ಅಥವಾ ಮುದ್ರಿತ), ಮಾನ್ಯವಾದ ಗುರುತಿನ ಪುರಾವೆ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ದೇವಾಲಯದ ಉಡುಪನ್ನು ಧರಿಸಿ ಬನ್ನಿ.',
  },
]

const FaqSection = () => {
  const { language } = useLanguage()
  const isKn = language === 'KN'

  const [activeCategory, setActiveCategory] = useState<'all' | 'booking' | 'qr' | 'account'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>('faq-1') // Open first question by default like reference image
  const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not-helpful'>>({})

  // Filter questions based on active category and live search query
  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      // Category filter
      if (activeCategory !== 'all' && faq.categoryId !== activeCategory) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const qText = (isKn ? faq.questionKn : faq.questionEn).toLowerCase()
        const aText = (isKn ? faq.answerKn : faq.answerEn).toLowerCase()
        return qText.includes(query) || aText.includes(query)
      }
      return true
    })
  }, [activeCategory, searchQuery, isKn])

  const handleFeedback = (faqId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback((prev) => ({ ...prev, [faqId]: type }))
  }

  return (
    <section id="faq" className="border-t border-[#eadfd1] bg-[#faf5ee] pt-10 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* ── 1. Clean Light Header (No Dark Banner) ── */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2d1b14]">
            {isKn ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು' : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#7a6657]">
            {isKn
              ? 'ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ.'
              : "Have questions? We're here to help."}
          </p>

          {/* Search Bar on Clean Theme Background */}
          <div className="mt-6 relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#c1440e] pointer-events-none">
              <IonIcon name="search-outline" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isKn
                  ? 'ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ಕೀವರ್ಡ್‌ಗಳನ್ನು ಹುಡುಕಿ...'
                  : 'Search for questions, topics, or keywords...'
              }
              className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-full bg-white border border-[#e4d6c7] text-xs sm:text-sm text-[#2d1b14] placeholder-[#8c7769] shadow-xs focus:outline-none focus:border-[#c1440e] focus:ring-2 focus:ring-[#c1440e]/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#8c7769] hover:text-[#2d1b14] cursor-pointer"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── 2. Two-Column Layout (Category Sidebar on Left + Accordion on Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Category Sidebar ── */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#2d1b14] mb-3 px-1">
              {isKn ? 'ವರ್ಗಗಳು' : 'Category'}
            </h3>

            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id
                // Count questions in this category
                const count =
                  cat.id === 'all'
                    ? FAQS.length
                    : FAQS.filter((f) => f.categoryId === cat.id).length

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#fceddc] text-[#c1440e] border border-[#f5cb9e] shadow-xs'
                        : 'bg-white/60 hover:bg-white text-[#5c4a3e] border border-transparent hover:border-[#eadfd1]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`text-base ${isActive ? 'text-[#c1440e]' : 'text-[#8c7769]'}`}>
                        <IonIcon name={cat.icon} />
                      </span>
                      <span>{isKn ? cat.labelKn : cat.labelEn}</span>
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#c1440e] text-white'
                          : 'bg-[#ede2d4] text-[#705c4f]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>


          </div>

          {/* ── Right Column: Frequently Asked Questions Accordions ── */}
          <div className="lg:col-span-8">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2d1b14] mb-3.5 px-1">
              {isKn ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು' : 'Frequently Asked Questions'}
            </h3>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-[#eadfd1] bg-white p-8 text-center shadow-2xs">
                <span className="text-3xl">🔍</span>
                <p className="mt-2 text-sm font-bold text-[#2d1b14]">
                  {isKn ? 'ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching questions found'}
                </p>
                <p className="mt-1 text-xs text-[#786657]">
                  {isKn
                    ? 'ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್‌ನೊಂದಿಗೆ ಹುಡುಕಿ ಅಥವಾ ವರ್ಗವನ್ನು ಬದಲಾಯಿಸಿ.'
                    : 'Try searching with different keywords or switch categories.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-[#c1440e] text-white text-xs font-bold shadow-xs cursor-pointer hover:bg-[#a73507] transition"
                >
                  {isKn ? 'ಎಲ್ಲ ಪ್ರಶ್ನೆಗಳನ್ನು ತೋರಿಸಿ' : 'View All Questions'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openId === faq.id
                  const questionText = isKn ? faq.questionKn : faq.questionEn
                  const answerText = isKn ? faq.answerKn : faq.answerEn
                  const steps = isKn ? faq.stepsKn : faq.stepsEn
                  const userFeedback = feedback[faq.id]

                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl sm:rounded-2xl border border-[#eadfd1] bg-white overflow-hidden shadow-2xs transition-all hover:border-[#dfc9b5]"
                    >
                      {/* Accordion Question Header */}
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-serif text-sm sm:text-base font-bold text-[#2d1b14] cursor-pointer hover:bg-[#fffdfa] transition"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-4">{questionText}</span>
                        {/* Expand/Collapse Indicator matching reference image */}
                        <span className="text-lg text-[#c1440e] shrink-0 font-bold select-none">
                          {isOpen ? '⌃' : '+'}
                        </span>
                      </button>

                      {/* Accordion Answer Content */}
                      {isOpen && (
                        <div className="border-t border-[#f5ede2] px-4 sm:px-5 pb-5 pt-3 text-xs sm:text-sm text-[#614e41] leading-relaxed bg-[#fffefb] animate-fade-in">
                          <p>{answerText}</p>

                          {/* Step-by-Step Points (Like image item #1) */}
                          {steps && steps.length > 0 && (
                            <ol className="mt-3 space-y-1.5 pl-4 list-decimal text-xs text-[#523f33]">
                              {steps.map((st, i) => (
                                <li key={i}>{st}</li>
                              ))}
                            </ol>
                          )}

                          {/* "Was this helpful? 👍 👎" Section matching reference image */}
                          <div className="mt-4 pt-3 border-t border-[#f3e8dc] flex items-center gap-2.5 text-xs text-[#8c7769]">
                            {userFeedback ? (
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-fade-in">
                                <span>✓</span>
                                <span>
                                  {isKn ? 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು! 🙏' : 'Thank you for your feedback! 🙏'}
                                </span>
                              </span>
                            ) : (
                              <>
                                <span className="font-medium text-[#7a6657]">
                                  {isKn ? 'ಇದು ಸಹಾಯಕವಾಗಿದೆಯೇ?' : 'Was this helpful?'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleFeedback(faq.id, 'helpful')}
                                  className="h-7 w-7 rounded-full bg-[#fceddc] hover:bg-[#f8dec4] text-sm flex items-center justify-center transition cursor-pointer"
                                  title="Yes, this was helpful"
                                >
                                  👍
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleFeedback(faq.id, 'not-helpful')}
                                  className="h-7 w-7 rounded-full bg-[#fceddc] hover:bg-[#f8dec4] text-sm flex items-center justify-center transition cursor-pointer"
                                  title="No, this was not helpful"
                                >
                                  👎
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
