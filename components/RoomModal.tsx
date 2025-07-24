'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { Room } from '../types'
import { formatPrice, cn } from '../lib/utils'
import { Button } from './Button'
import { ImageGallery } from './ImageGallery'
import { X, Bed, Users, Bath, Accessibility, MapPin } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

interface RoomModalProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onBook: (room: Room) => void
}

export const RoomModal: React.FC<RoomModalProps> = ({ room, isOpen, onClose, onBook }) => {
  const { t, i18n } = useTranslation()

  if (!room) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-château-dark/90 backdrop-blur-md z-50">
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-château-night/95 backdrop-blur-xl border border-château-border rounded-sm max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-sm bg-château-dark/80 text-château-parchment/60 hover:text-château-parchment transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {room.images && room.images.length > 0 && (
                  <div className="relative h-64 sm:h-96">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-château-darker z-10 pointer-events-none" />
                    <ImageGallery
                      images={room.images}
                      alt={room.name[i18n.language as 'fr' | 'en']}
                      className="h-full"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <h2 className="text-3xl font-serif text-château-parchment mb-4">
                    {room.name[i18n.language as 'fr' | 'en']}
                  </h2>
                  
                  {room.description && (
                    <p className="text-château-stone mb-6">
                      {room.description[i18n.language as 'fr' | 'en']}
                    </p>
                  )}
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-serif text-château-parchment mb-3">
                        {t('room.features')}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-château-stone">
                          <Bed className="w-4 h-4" />
                          <span>{room.features.beds}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-château-stone">
                          <Users className="w-4 h-4" />
                          <span>
                            {room.features.capacity} {room.features.capacity > 1 ? t('common.guests') : t('common.guest')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-château-stone">
                          <Bath className="w-4 h-4" />
                          <span>{t(`room.bathroom`)} {t(`room.${room.features.bathroom}`)}</span>
                        </div>
                        {room.features.accessibility && (
                          <div className="flex items-center space-x-2 text-château-stone">
                            <Accessibility className="w-4 h-4" />
                            <span>{t('room.accessible')}</span>
                          </div>
                        )}
                        {room.level && (
                          <div className="flex items-center space-x-2 text-château-stone">
                            <MapPin className="w-4 h-4" />
                            <span>{room.level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {room.features.amenities && room.features.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-serif text-château-parchment mb-3">
                          {t('room.amenities')}
                        </h3>
                        <ul className="space-y-1">
                          {room.features.amenities.map((amenity, index) => (
                            <li key={index} className="text-château-stone text-sm">
                              • {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-château-parchment/10">
                    <div>
                      <span className="text-3xl font-serif text-château-parchment">
                        {formatPrice(room.price, i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
                      </span>
                      <span className="text-château-stone ml-2">/ {t('common.night')}</span>
                    </div>
                    
                    <Button
                      onClick={() => onBook(room)}
                      variant="primary"
                      size="lg"
                      disabled={!room.available}
                      className="lowercase"
                    >
                      {room.available ? 'book this room' : 'unavailable'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}