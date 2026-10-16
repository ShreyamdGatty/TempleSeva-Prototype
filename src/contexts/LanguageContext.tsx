import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { translations, type TranslationKey, type Language } from '../i18n/translations'
import type { Temple, Seva } from '../types'

const STORAGE_LANG = 'temple-seva.language'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: TranslationKey) => string
  translateTemple: (temple: Temple) => Temple
  translateSeva: (seva: Seva) => Seva
  translateCategory: (cat: string) => string
  formatDateLocalized: (date: Date) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem(STORAGE_LANG)
    return saved === 'KN' ? 'KN' : 'EN'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_LANG, language)
    document.documentElement.lang = language === 'KN' ? 'kn' : 'en'
  }, [language])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'EN' ? 'KN' : 'EN'))
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = translations[language] || translations.EN
      return (dict as Record<string, string>)[key] || translations.EN[key] || key
    },
    [language]
  )

  const translateCategory = useCallback(
    (cat: string): string => {
      const lower = cat.toLowerCase()
      if (lower === 'all') return t('catAll')
      if (lower === 'pooja') return t('catPooja')
      if (lower === 'homam') return t('catHomam')
      if (lower === 'archana') return t('catArchana')
      if (lower === 'special') return t('catSpecial')
      return cat
    },
    [t]
  )

  const translateTemple = useCallback(
    (temple: Temple): Temple => {
      const id = temple.id
      let name = temple.name
      let location = temple.location
      let description = temple.description

      if (id === 'meenakshi') {
        name = t('t_meenakshi_name')
        location = t('t_meenakshi_loc')
        description = t('t_meenakshi_desc')
      } else if (id === 'venkateswara') {
        name = t('t_venkateswara_name')
        location = t('t_venkateswara_loc')
        description = t('t_venkateswara_desc')
      } else if (id === 'kashi') {
        name = t('t_kashi_name')
        location = t('t_kashi_loc')
        description = t('t_kashi_desc')
      }

      return { ...temple, name, location, description }
    },
    [t]
  )

  const translateSeva = useCallback(
    (seva: Seva): Seva => {
      const id = seva.id
      let name = seva.name
      let description = seva.description

      if (id === 'abhishekam') {
        name = t('s_abhishekam_name')
        description = t('s_abhishekam_desc')
      } else if (id === 'archana') {
        name = t('s_archana_name')
        description = t('s_archana_desc')
      } else if (id === 'sahasranamam') {
        name = t('s_sahasranamam_name')
        description = t('s_sahasranamam_desc')
      } else if (id === 'deepa') {
        name = t('s_deepa_name')
        description = t('s_deepa_desc')
      } else if (id === 'ganapathi-homam') {
        name = t('s_ganapathi_name')
        description = t('s_ganapathi_desc')
      } else if (id === 'navagraha-homam') {
        name = t('s_navagraha_name')
        description = t('s_navagraha_desc')
      } else if (id === 'kumkumarchana') {
        name = t('s_kumkumarchana_name')
        description = t('s_kumkumarchana_desc')
      } else if (id === 'rudra-abhishekam') {
        name = t('s_rudra_name')
        description = t('s_rudra_desc')
      }

      return { ...seva, name, description }
    },
    [t]
  )

  const formatDateLocalized = useCallback(
    (date: Date): string => {
      const day = date.getDate()
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthsKn = ['ಜನ', 'ಫೆಬ್ರ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗ', 'ಸೆಪ್ಟೆಂ', 'ಅಕ್ಟೋ', 'ನವೆಂ', 'ಡಿಸೆಂ']
      const month = language === 'KN' ? monthsKn[date.getMonth()] : monthsEn[date.getMonth()]
      return `${day} ${month}`
    },
    [language]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateTemple,
      translateSeva,
      translateCategory,
      formatDateLocalized,
    }),
    [language, setLanguage, toggleLanguage, t, translateTemple, translateSeva, translateCategory, formatDateLocalized]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
