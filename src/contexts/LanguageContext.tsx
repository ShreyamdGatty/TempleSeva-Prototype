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

      if (id === 'ananthapura') {
        name = t('t_ananthapura_name')
        location = t('t_ananthapura_loc')
        description = t('t_ananthapura_desc')
      } else if (id === 'udupi-krishna') {
        name = t('t_udupi_name')
        location = t('t_udupi_loc')
        description = t('t_udupi_desc')
      } else if (id === 'mangaladevi') {
        name = t('t_mangaladevi_name')
        location = t('t_mangaladevi_loc')
        description = t('t_mangaladevi_desc')
      } else if (id === 'kateel') {
        name = t('t_kateel_name')
        location = t('t_kateel_loc')
        description = t('t_kateel_desc')
      } else if (id === 'meenakshi') {
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
      } else if (language === 'KN') {
        if (id === 'meenakshi-pushpanjali') {
          name = 'ಸಹಸ್ರನಾಮ ಅರ್ಚನೆ ಮತ್ತು ಪುಷ್ಪಾಂಜಲಿ'
          description = '೧೦೦೮ ತಾಜಾ ಮಲ್ಲಿಗೆ ಮತ್ತು ಕಮಲದ ಹೂವುಗಳ ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಸಹಸ್ರನಾಮ ಪಠಣ.'
        } else if (id === 'meenakshi-chandi-homam') {
          name = 'ಚಂಡಿ ಹೋಮ ಮತ್ತು ನವಾಕ್ಷರಿ ಮಹಾಯಾಗ'
          description = 'ಆರೋಗ್ಯ, ಜಯ ಮತ್ತು ಸಂಕಷ್ಟ ನಿವಾರಣೆಗಾಗಿ ಪವಿತ್ರ ಮಹಾಯಾಗ ಹೋಮ.'
        } else if (id === 'meenakshi-golden-palanquin') {
          name = 'ತಂಗ ಪಲ್ಲಕ್ಕಿ (ಚಿನ್ನದ ಪಲ್ಲಕ್ಕಿ) ಸೇವೆ'
          description = 'ದೇವಸ್ಥಾನದ ಪ್ರಾಕಾರದಲ್ಲಿ ಚಿನ್ನದ ಪಲ್ಲಕ್ಕಿಯ ಭವ್ಯ ಸಂಜೆ ಮೆರವಣಿಗೆ.'
        } else if (id === 'meenakshi-navagraha-pooja') {
          name = 'ನವಗ್ರಹ ಶಾಂತಿ ಪೂಜೆ'
          description = 'ನವಗ್ರಹ ದೋಷ ನಿವಾರಣೆ ಮತ್ತು ಶುಭ ಫಲಗಳಿಗಾಗಿ ವಿಶೇಷ ಪೂಜೆ.'
        } else if (id === 'meenakshi-annadhanam') {
          name = 'ಮಹಾ ಅನ್ನದಾನ ಸೇವೆ'
          description = 'ಮೀನಾಕ್ಷಿ ಅಮ್ಮನವರ ದರ್ಶನಕ್ಕೆ ಬರುವ ಭಕ್ತರಿಗೆ ಪವಿತ್ರ ಪ್ರಸಾದ ಭೋಜನ ಸಮರ್ಪಣೆ.'
        } else if (id === 'ananthapura-panchamritha') {
          name = 'ಪಂಚಾಮೃತ ಅಭಿಷೇಕ'
          description = 'ಹಾಲು, ಜೇನು, ಮೊಸರು, ತುಪ್ಪ ಮತ್ತು ಸಕ್ಕರೆಯಿಂದ ಶ್ರೀ ಅನಂತಪದ್ಮನಾಭ ಸ್ವಾಮಿಗೆ ಪವಿತ್ರ ಸ್ನಾನ ಸೇವೆ.'
        } else if (id === 'ananthapura-sarovara') {
          name = 'ಸರೋವರ ಪುಷ್ಪಾಂಜಲಿ ಮತ್ತು ನೈವೇದ್ಯ'
          description = 'ಪವಿತ್ರ ಸರೋವರದ ಸನ್ನಿಧಿಯಲ್ಲಿ ನಿಮ್ಮ ಗೋತ್ರ-ನಾಮಗಳಲ್ಲಿ ಪುಷ್ಪಾರ್ಚನೆ ಮತ್ತು ನೈವೇದ್ಯ ಸಮರ್ಪಣೆ.'
        } else if (id === 'ananthapura-babia-naivedya') {
          name = 'ಬಬಿಯಾ ಸರೋವರ ನೈವೇದ್ಯ ಮತ್ತು ಪ್ರಸಾದ ಸೇವೆ'
          description = 'ಐತಿಹಾಸಿಕ ರಕ್ಷಕ ಬಬಿಯಾನ ಪವಿತ್ರ ಸರೋವರ ಸನ್ನಿಧಿಯಲ್ಲಿ ಬೆಲ್ಲದ ಪಾಯಸ ಹಾಗೂ ಅನ್ನ ನೈವೇದ್ಯ ಸೇವೆ.'
        } else if (id === 'ananthapura-deepotsava') {
          name = 'ಸರೋವರ ದೀಪೋತ್ಸವ ಮತ್ತು ಸಹಸ್ರ ದೀಪ'
          description = 'ಸರೋವರ ಸನ್ನಿಧಾನದಲ್ಲಿ ೧೦೮ ಸಾಂಪ್ರದಾಯಿಕ ತುಪ್ಪದ ದೀಪಗಳನ್ನು ಬೆಳಗಿಸುವ ಭವ್ಯ ಸಂಜೆ ದೀಪಾರಾಧನೆ.'
        } else if (id === 'ananthapura-sahasranama') {
          name = 'ಶ್ರೀ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಮತ್ತು ತುಳಸಿ ಅರ್ಚನೆ'
          description = '೧೦೦೮ ಪವಿತ್ರ ತುಳಸಿ ಎಲೆಗಳು ಹಾಗೂ ಕಮಲದ ಹೂವುಗಳಿಂದ ಶ್ರೀ ಅನಂತಪದ್ಮನಾಭ ಸ್ವಾಮಿಗೆ ಸಹಸ್ರನಾಮ ಅರ್ಚನೆ.'
        } else if (id === 'ananthapura-ksheera-abhishekam') {
          name = 'ಕ್ಷೀರ ಧಾರೆ ಮತ್ತು ಕಲಶಾಭಿಷೇಕ'
          description = 'ಪುರುಷ ಸೂಕ್ತ ಪಠಣೆಯೊಂದಿಗೆ ನಿರಂತರ ಪವಿತ್ರ ಗೋಕ್ಷೀರ ಸ್ನಾನ ಮತ್ತು ಪುಣ್ಯ ಕಲಶಾಭಿಷೇಕ.'
        } else if (id === 'ananthapura-maha-homam') {
          name = 'ಸರ್ವ ಕಷ್ಟ ನಿವಾರಣಾ ಮಹಾ ಹೋಮ'
          description = 'ಗ್ರಹದೋಷ, ವಿಘ್ನ ನಿವಾರಣೆ ಹಾಗೂ ಕುಟುಂಬ ಸಮೃದ್ಧಿಗಾಗಿ ಯಾಗಶಾಲೆಯಲ್ಲಿ ೧೦೮ ಆಹುತಿಗಳ ವೈದಿಕ ಮಹಾಯಾಗ.'
        }
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
