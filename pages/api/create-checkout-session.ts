import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      roomId,
      roomName,
      checkIn,
      checkOut,
      name,
      email,
      phone,
      specialRequests,
      nights,
      totalPrice,
      locale,
      demoMode,
    } = req.body

    // Validate required fields
    if (!roomId || !roomName || !checkIn || !checkOut || !name || !email || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate totalPrice is a positive number
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return res.status(400).json({ error: 'Invalid price' })
    }

    // DEMO MODE: Return mock booking ID without Stripe
    if (demoMode) {
      // Generate a mock booking ID
      const bookingId = `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      console.log('Demo booking created:', {
        bookingId,
        roomName,
        guestName: name,
        checkIn,
        checkOut,
        totalPrice,
      })

      // Return mock booking response
      return res.status(200).json({ 
        bookingId,
        demoMode: true,
        message: 'Demo booking created successfully'
      })
    }

    // Production mode: Currently disabled for testing
    return res.status(503).json({ 
      error: 'Payment system is temporarily disabled for deployment testing. Please use demo mode.' 
    })
    
  } catch (error: any) {
    console.error('Booking error:', error)
    const errorMessage = error?.message || 'Failed to create booking'
    res.status(500).json({ error: errorMessage })
  }
}