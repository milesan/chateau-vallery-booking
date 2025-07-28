import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useTranslation } from 'next-i18next'

export const LanguageSwitch: React.FC = () => {
  const router = useRouter()
  const { locale } = router
  const { t } = useTranslation()

  const switchLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <motion.div 
      className="fixed top-8 right-8 z-50 flex space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <button
        onClick={() => switchLanguage('fr')}
        className={cn(
          "text-sm font-serif transition-all duration-300 px-2 py-1",
          locale === 'fr' 
            ? "text-château-parchment/80" 
            : "text-château-parchment/40 hover:text-château-parchment/60"
        )}
        aria-label="Passer en français"
        aria-current={locale === 'fr' ? 'true' : 'false'}
      >
        FR
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={cn(
          "text-sm font-serif transition-all duration-300 px-2 py-1",
          locale === 'en' 
            ? "text-château-parchment/80" 
            : "text-château-parchment/40 hover:text-château-parchment/60"
        )}
        aria-label="Switch to English"
        aria-current={locale === 'en' ? 'true' : 'false'}
      >
        EN
      </button>
    </motion.div>
  )
}