import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

// Check if Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    })
  : null

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check if Stripe is properly initialized
  if (!stripe) {
    console.error('Stripe is not initialized. Check your STRIPE_SECRET_KEY.')
    return res.status(500).json({ error: 'Payment system is not configured' })
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
    } = req.body

    // Validate required fields
    if (!roomId || !roomName || !checkIn || !checkOut || !name || !email || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate totalPrice is a positive number
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return res.status(400).json({ error: 'Invalid price' })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: roomName,
              description: `${checkIn} - ${checkOut} (${nights} ${nights > 1 ? 'nuits' : 'nuit'})`,
              metadata: {
                roomId,
                checkIn,
                checkOut,
              },
            },
            unit_amount: totalPrice * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      customer_email: email,
      locale: locale === 'fr' ? 'fr' : 'en',
      metadata: {
        roomId,
        checkIn,
        checkOut,
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        specialRequests: specialRequests || '',
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe API error:', error)
    
    // Provide more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error type:', error.type)
      console.error('Stripe error code:', error.code)
      console.error('Stripe error message:', error.message)
      
      // Common Stripe errors
      if (error.type === 'StripeAuthenticationError') {
        return res.status(500).json({ error: 'Invalid API key. Please check your Stripe configuration.' })
      }
      if (error.type === 'StripeInvalidRequestError') {
        return res.status(400).json({ error: 'Invalid request to payment system' })
      }
    }
    
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}