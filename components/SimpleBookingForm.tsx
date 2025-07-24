'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { loadStripe } from '@stripe/stripe-js'
import { Room } from '../types'
import { formatPrice } from '../lib/utils'
import { Button } from './Button'
import { X, User, Mail, Phone } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SimpleBookingFormProps {
  room: Room
  onClose: () => void
}

export const SimpleBookingForm: React.FC<SimpleBookingFormProps> = ({ room, onClose }) => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // Fixed event dates
  const checkIn = '2025-09-21'
  const checkOut = '2025-09-26'
  const nights = 5
  const totalPrice = nights * room.price

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
          checkIn,
          checkOut,
          ...formData,
          nights,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-château-dark/95 backdrop-blur-xl"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-château-night/90 backdrop-blur-xl border border-château-border rounded-sm max-w-2xl w-full p-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-serif text-château-parchment mb-2 lowercase">
                booking
              </h2>
              <p className="text-château-parchment/60">
                {room.name[i18n.language as 'fr' | 'en']}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-sm text-château-parchment/60 hover:text-château-parchment transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-8 p-6 bg-château-dark/30 border border-château-border rounded-sm">
            <div className="text-château-parchment/80 space-y-2">
              <p className="text-sm uppercase tracking-wider">event dates</p>
              <p className="text-2xl font-serif">september 21-26, 2025</p>
              <p className="text-sm text-château-parchment/60">check-in: 3:00 pm • check-out: 11:30 am</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-château-parchment/60 text-sm mb-2">
                <User className="w-4 h-4" />
                <span>full name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-château-dark/50 border border-château-border rounded-sm text-château-mist placeholder-château-stone/50 focus:border-château-parchment/30 focus:outline-none transition-colors"
                placeholder="enter your name"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-château-parchment/60 text-sm mb-2">
                <Mail className="w-4 h-4" />
                <span>email</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-château-dark/50 border border-château-border rounded-sm text-château-mist placeholder-château-stone/50 focus:border-château-parchment/30 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-château-parchment/60 text-sm mb-2">
                <Phone className="w-4 h-4" />
                <span>phone</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-château-dark/50 border border-château-border rounded-sm text-château-mist placeholder-château-stone/50 focus:border-château-parchment/30 focus:outline-none transition-colors"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="border-t border-château-border pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-château-parchment/60 text-sm">5 nights</p>
                  <p className="text-2xl font-serif text-château-parchment">
                    {formatPrice(totalPrice, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-château-parchment/60 text-sm">per night</p>
                  <p className="text-lg text-château-parchment/80">
                    {formatPrice(room.price, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1"
                >
                  cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'processing...' : 'proceed to payment'}
                </Button>
              </div>

              <p className="text-center text-château-parchment/40 text-xs mt-4">
                secure payment by stripe
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}