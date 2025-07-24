export interface Room {
  id: string
  name: {
    fr: string
    en: string
  }
  description?: {
    fr: string
    en: string
  }
  features: {
    beds: string
    capacity: number
    bathroom: 'private' | 'shared'
    size?: string
    amenities: string[]
    accessibility?: boolean
  }
  price: number
  level?: string
  images?: string[]
  available: boolean
}

export interface Section {
  id: string
  name: {
    fr: string
    en: string
  }
  description: {
    fr: string
    en: string
  }
  rooms: Room[]
}

export interface Booking {
  id: string
  roomId: string
  checkIn: Date
  checkOut: Date
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests?: string
  totalPrice: number
  stripeSessionId?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
}