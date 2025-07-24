'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { Room } from '../types'
import { formatPrice, cn } from '../lib/utils'
import { Button } from './Button'
import { ImageGallery } from './ImageGallery'
import { Bed, Users, Bath, Accessibility } from 'lucide-react'

interface RoomCardProps {
  room: Room
  onSelect: () => void
  index: number
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, index }) => {
  const { t, i18n } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="bg-château-night/40 backdrop-blur-sm border border-château-border rounded-sm overflow-hidden transition-all duration-300 group-hover:border-château-parchment/20">
        {room.images && room.images.length > 0 && (
          <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-château-dark via-transparent to-transparent z-10 pointer-events-none" />
            <ImageGallery
              images={room.images}
              alt={room.name[i18n.language as 'fr' | 'en']}
              className="h-full"
            />
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-xl font-serif text-château-parchment mb-2">
            {room.name[i18n.language as 'fr' | 'en']}
          </h3>
          
          {room.description && (
            <p className="text-château-stone text-sm mb-4 line-clamp-2">
              {room.description[i18n.language as 'fr' | 'en']}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-château-stone">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">{room.features.capacity}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">
                  {t(`room.${room.features.bathroom}`)}
                </span>
              </div>
              {room.features.accessibility && (
                <Accessibility className="w-4 h-4" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-château-parchment">
              <span className="text-2xl font-serif">
                {formatPrice(room.price, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
              </span>
              <span className="text-sm text-château-stone ml-1">
                / {t('common.night')}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!room.available}
            >
              {room.available ? t('common.select') : t('common.unavailable')}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}