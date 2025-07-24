import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

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
    } = req.body

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
    console.error('Stripe error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}