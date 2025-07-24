'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { generateStars } from '../lib/utils'

export const Starfield: React.FC = () => {
  const [stars, setStars] = useState<ReturnType<typeof generateStars>>([])

  useEffect(() => {
    setStars(generateStars(150))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-château-parchment"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}