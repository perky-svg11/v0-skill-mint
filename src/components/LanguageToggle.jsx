import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LanguageToggle = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ur' : 'en'
    i18n.changeLanguage(newLang)
    
    // Update document direction for RTL support
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLang
    
    // Add/remove RTL class to body
    if (newLang === 'ur') {
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
    }
  }

  return (
    <button
      onClick={toggleLanguage}
      className="lang-toggle"
      title={i18n.language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      <Globe size={16} />
    </button>
  )
}

export default LanguageToggle

