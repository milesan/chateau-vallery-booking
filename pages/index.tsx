import React, { useState, useMemo } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { Starfield } from '../components/Starfield'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { RoomCard } from '../components/RoomCard'
import { RoomModal } from '../components/RoomModal'
import { SectionFilter } from '../components/SectionFilter'
import { SimpleBookingForm } from '../components/SimpleBookingForm'
import { Room, Section } from '../types'
import roomsData from '../data/rooms.json'

export default function Home() {
  const { t } = useTranslation()
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [activeSection, setActiveSection] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const sections = Object.values(roomsData.sections) as Section[]

  const filteredRooms = useMemo(() => {
    if (activeSection === 'all') {
      return sections.flatMap(section => section.rooms)
    }
    const section = sections.find(s => s.id === activeSection)
    return section ? section.rooms : []
  }, [activeSection, sections])

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleBook = (room: Room) => {
    setIsModalOpen(false)
    setShowBookingForm(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-château-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-château-dark/50 to-château-dark" />
      <Starfield />
      <LanguageSwitch />
      
      <div className="relative z-10">
        <header className="text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl sm:text-6xl font-serif text-château-parchment mb-6 tracking-wider lowercase">
              {t('header.title')}
            </h1>
            <p className="text-lg text-château-parchment/60 font-serif mb-12">
              {t('header.subtitle')}
            </p>
            <div className="space-y-4">
              <p className="text-château-parchment/80 text-sm tracking-[0.2em] uppercase">
                september 21-26, 2025
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="/pdfs/complete-brochure.pdf" 
                  target="_blank"
                  className="text-château-parchment/40 hover:text-château-parchment/60 text-xs lowercase transition-colors"
                >
                  view full gallery
                </a>
                <span className="text-château-parchment/20">|</span>
                <a 
                  href="/pdfs/rooms-details.pdf" 
                  target="_blank"
                  className="text-château-parchment/40 hover:text-château-parchment/60 text-xs lowercase transition-colors"
                >
                  room details
                </a>
              </div>
            </div>
          </motion.div>
        </header>

        <main className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-serif text-château-parchment/80 text-center mb-16 lowercase tracking-wider">
              {t('sections.explore')}
            </h2>
            
            <SectionFilter
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map((room, index) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  index={index}
                  onSelect={() => handleRoomSelect(room)}
                />
              ))}
            </div>
          </motion.div>
        </main>

        <footer className="relative z-10 py-16 mt-32">
          <div className="container mx-auto px-4">
            <div className="text-center text-château-parchment/40 text-xs">
              <p className="mb-4">&copy; 2025 château de vallery</p>
              <div className="flex justify-center space-x-8">
                <a href="#" className="hover:text-château-parchment/60 transition-colors lowercase">
                  privacy
                </a>
                <a href="#" className="hover:text-château-parchment/60 transition-colors lowercase">
                  terms
                </a>
                <a href="#" className="hover:text-château-parchment/60 transition-colors lowercase">
                  contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <RoomModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBook={handleBook}
      />
      
      {showBookingForm && selectedRoom && (
        <SimpleBookingForm
          room={selectedRoom}
          onClose={() => {
            setShowBookingForm(false)
            setSelectedRoom(null)
          }}
        />
      )}
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient-to-t from-château-dark via-transparent to-transparent" />
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // Skip i18n on build if translations aren't available
  if (process.env.SKIP_I18N === 'true') {
    return { props: {} }
  }

  try {
    const translations = await serverSideTranslations(locale ?? 'en', ['common'])
    return {
      props: {
        ...translations,
      },
    }
  } catch (error) {
    console.error('Error loading translations for locale:', locale, error)
    // Return empty props instead of throwing
    return {
      props: {
        _nextI18Next: {
          initialI18nStore: { en: { common: {} }, fr: { common: {} } },
          initialLocale: locale ?? 'en',
          userConfig: null,
        }
      },
    }
  }
}