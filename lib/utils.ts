import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, locale: string = 'fr-FR'): string {
  const currency = locale === 'fr-FR' ? 'EUR' : 'EUR'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export const generateStars = (count: number = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }))
}