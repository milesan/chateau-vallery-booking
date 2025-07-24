# Château de Vallery Booking Platform

An elegant, high-touch booking platform for Château de Vallery's exclusive event, featuring 28 unique rooms across 5 distinct sections.

## Features

- **Bilingual Support**: Full French/English translation
- **Elegant Design**: Inspired by castle.community aesthetic with mystical, sophisticated dark theme
- **Room Showcase**: 28 rooms across 5 sections (Pigeonnier, Renaissance, Oriental, Palmeraie, Medieval)
- **Stripe Integration**: Secure payment processing
- **Responsive Design**: Optimized for all devices
- **Smooth Animations**: Framer Motion for elegant transitions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your Stripe keys:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

3. Run development server:
```bash
npm run dev
```

## Room Images

Add room images to `public/images/` directory. Image filenames should match those in `data/rooms.json`.

## Customization

- Room data: Edit `data/rooms.json`
- Translations: Edit `translations/fr.json` and `translations/en.json`
- Colors: Customize in `tailwind.config.js`
- Styling: Global styles in `styles/globals.css`

## Production

```bash
npm run build
npm start
```