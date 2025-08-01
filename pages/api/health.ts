import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NODE_VERSION: process.version,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublicStripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    headers: req.headers,
  })
}