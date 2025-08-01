import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Starfield } from '../components/Starfield'
import roomsData from '../data/rooms.json'

// Simple version without i18n
export default function SimpleHome() {
  const [activeSection, setActiveSection] = useState('all')
  const sections = Object.values(roomsData.sections)

  return (
    <div className="min-h-screen relative overflow-hidden bg-château-dark">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-château-dark/50 to-château-dark" />
      <Starfield />
      
      <div className="relative z-10">
        <header className="text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl sm:text-6xl font-serif text-château-parchment mb-6 tracking-wider lowercase">
              Château de Vallery
            </h1>
            <p className="text-lg text-château-parchment/60 font-serif mb-12">
              A Unique Experience
            </p>
            <div className="space-y-4">
              <p className="text-château-parchment/80 text-sm tracking-[0.2em] uppercase">
                September 21-26, 2025
              </p>
            </div>
          </motion.div>
        </header>

        <main className="container mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-château-parchment/80 lowercase tracking-wider">
              Available Rooms
            </h2>
            <p className="text-château-parchment/60 mt-4">
              {sections.reduce((acc, section) => acc + section.rooms.length, 0)} rooms across {sections.length} unique sections
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {sections.map((section) => (
              <div key={section.id} className="bg-château-night/50 border border-château-border p-6 rounded-sm">
                <h3 className="text-xl font-serif text-château-parchment mb-2">
                  {section.name.en}
                </h3>
                <p className="text-château-parchment/60 text-sm mb-4">
                  {section.description.en}
                </p>
                <p className="text-château-parchment/40 text-xs">
                  {section.rooms.length} room{section.rooms.length > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </main>

        <footer className="relative z-10 py-16 mt-32">
          <div className="container mx-auto px-4">
            <div className="text-center text-château-parchment/40 text-xs">
              <p className="mb-4">&copy; 2025 Château de Vallery</p>
              <p className="text-château-parchment/30">
                Note: This is a simplified version without internationalization.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}