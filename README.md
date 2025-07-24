# Château de Vallery Booking Platform

An elegant booking platform for Château de Vallery, a magnificent French castle offering luxury accommodation for weddings and events.

## Features

- 🏰 **Multi-language Support**: Full French/English translations
- 💳 **Stripe Integration**: Secure payment processing  
- 🖼️ **High-Resolution Galleries**: Multiple images per room with gallery navigation
- ✨ **Starfield Animation**: Elegant animated background
- 📱 **Responsive Design**: Works beautifully on all devices
- ♿ **Accessibility**: Includes accessible rooms information

## Room Categories

### The Dovecote (Le Pigeonnier)
- Unique 3-level bridal suite with circular bed

### Renaissance Wing (Aile Renaissance)  
- 16 historic rooms across 4 levels
- Including Grand Condé, Henri IV, Louis XIII suites

### Oriental Space (Espace Oriental)
- Exotic themed rooms including the 150m² Loft Suite
- Sahara and Levant rooms with Middle Eastern decor

### The Palm Grove (La Palmeraie)
- 4 rooms in lush garden setting
- Nirvana, Darjeeling, Samsara, and Fig Tree rooms

### Medieval Tower (Tour Médiévale)
- 4 rooms in the 13th century tower
- Includes wheelchair accessible Grand Duke and Petit Duke rooms

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Internationalization**: next-i18next
- **Payments**: Stripe API
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── components/          # React components
├── data/               # Room data and configurations
├── lib/                # Utility functions
├── pages/              # Next.js pages and API routes
├── public/             
│   ├── images/rooms/   # Room images
│   │   └── fullres/    # High-resolution images
│   ├── locales/        # Translation files
│   └── pdfs/           # Brochures and floor plans
└── styles/             # Global styles
```

## Images

All room images have been scraped from the official Château de Vallery website and are stored in high resolution. The platform automatically prioritizes high-resolution images over thumbnails for the best visual experience.

## Deployment

This site is ready to be deployed on Vercel, Netlify, or any platform that supports Next.js applications.

---

Built with ❤️ for Château de Vallery