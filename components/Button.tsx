import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-serif transition-all duration-300 relative overflow-hidden'
  
  const variants = {
    primary: 'bg-château-parchment/10 text-château-parchment border border-château-parchment/20 hover:bg-château-parchment/15 hover:border-château-parchment/30',
    ghost: 'text-château-parchment/60 hover:text-château-parchment',
    outline: 'border border-château-parchment/20 text-château-parchment hover:bg-château-parchment/5 hover:border-château-parchment/30'
  }
  
  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        'rounded-sm',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={props.onClick}
      type={props.type}
      name={props.name}
      value={props.value}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-château-parchment/5"
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
})

Button.displayName = 'Button'