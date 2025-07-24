import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Starfield } from '../../components/Starfield'
import { LanguageSwitch } from '../../components/LanguageSwitch'

export default function BookingSuccess() {
  const { t } = useTranslation()
  const router = useRouter()
  const { session_id } = router.query
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    if (session_id) {
      // In a real app, you would fetch booking details from your backend
      // using the session_id
      setTimeout(() => {
        setBookingDetails({
          confirmationNumber: 'CHV-' + Math.random().toString(36).substring(7).toUpperCase(),
        })
        setLoading(false)
      }, 1000)
    }
  }, [session_id])

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <Starfield />
      <LanguageSwitch />
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-24 h-24 text-château-parchment mx-auto mb-6" />
          
          <h1 className="text-4xl font-serif text-château-parchment mb-4">
            {t('booking.success.title', 'Réservation Confirmée')}
          </h1>
          
          <p className="text-château-stone mb-8 max-w-md mx-auto">
            {t('booking.success.message', 'Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation sous peu.')}
          </p>
          
          {bookingDetails && (
            <div className="bg-château-dark/40 backdrop-blur-sm border border-château-parchment/20 rounded-lg p-6 max-w-sm mx-auto mb-8">
              <p className="text-château-stone text-sm mb-2">
                {t('booking.success.confirmationNumber', 'Numéro de confirmation')}
              </p>
              <p className="text-2xl font-serif text-château-parchment">
                {bookingDetails.confirmationNumber}
              </p>
            </div>
          )}
          
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-château-parchment text-château-dark rounded font-serif hover:bg-château-gold transition-colors"
          >
            {t('common.back', 'Retour')}
          </motion.button>
        </motion.div>
      </div>
      
      <div className="fixed inset-0 bg-radial-château pointer-events-none" />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
    },
  }
}