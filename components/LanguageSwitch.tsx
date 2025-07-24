'use client'

import React from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export const LanguageSwitch: React.FC = () => {
  const router = useRouter()
  const { locale } = router

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
          "text-xs font-serif transition-all duration-300 lowercase",
          locale === 'fr' 
            ? "text-château-parchment/80" 
            : "text-château-parchment/40 hover:text-château-parchment/60"
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={cn(
          "text-xs font-serif transition-all duration-300 lowercase",
          locale === 'en' 
            ? "text-château-parchment/80" 
            : "text-château-parchment/40 hover:text-château-parchment/60"
        )}
      >
        EN
      </button>
    </motion.div>
  )
}