'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { loadStripe } from '@stripe/stripe-js'
import { Room } from '../types'
import { formatPrice, cn } from '../lib/utils'
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingFormProps {
  room: Room
  onClose: () => void
}

export const BookingForm: React.FC<BookingFormProps> = ({ room, onClose }) => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  })

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const totalPrice = calculateNights() * room.price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          roomName: room.name[i18n.language as 'fr' | 'en'],
          ...formData,
          nights: calculateNights(),
          totalPrice,
          locale: i18n.language,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error(error)
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-château-dark/95 backdrop-blur-xl"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-château-darker/90 border border-château-parchment/20 rounded-lg max-w-2xl w-full p-8">
          <h2 className="text-3xl font-serif text-château-parchment mb-6">
            {t('booking.title')} - {room.name[i18n.language as 'fr' | 'en']}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-château-parchment mb-2 font-serif">
                {t('booking.selectDates')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{t('booking.checkIn')}</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{t('booking.checkOut')}</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    min={formData.checkIn}
                    className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-château-parchment mb-2 font-serif">
                {t('booking.personalInfo')}
              </label>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                    <User className="w-4 h-4" />
                    <span>{t('booking.name')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    <span>{t('booking.email')}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    <span>{t('booking.phone')}</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-château-stone text-sm mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>{t('booking.specialRequests')}</span>
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-château-dark/50 border border-château-parchment/20 rounded text-château-mist focus:border-château-parchment/50 focus:outline-none resize-none"
              />
            </div>

            {calculateNights() > 0 && (
              <div className="bg-château-dark/30 border border-château-parchment/10 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-château-stone">
                    <span>
                      {formatPrice(room.price, i18n.language === 'fr' ? 'fr-FR' : 'en-US')} × {calculateNights()} {calculateNights() > 1 ? t('common.nights') : t('common.night')}
                    </span>
                    <span>{formatPrice(totalPrice, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                  </div>
                  <div className="border-t border-château-parchment/10 pt-2">
                    <div className="flex justify-between text-château-parchment text-lg font-serif">
                      <span>{t('common.total')}</span>
                      <span>{formatPrice(totalPrice, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 border border-château-parchment/30 rounded text-château-parchment font-serif hover:bg-château-parchment/10 transition-colors"
              >
                {t('common.back')}
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || calculateNights() === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex-1 px-6 py-3 rounded font-serif transition-all",
                  loading || calculateNights() === 0
                    ? "bg-château-stone/20 text-château-stone cursor-not-allowed"
                    : "bg-château-parchment text-château-dark hover:bg-château-gold"
                )}
              >
                {loading ? '...' : t('booking.confirm')}
              </motion.button>
            </div>

            <p className="text-center text-château-stone text-sm">
              {t('booking.securePayment')}
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  )
}