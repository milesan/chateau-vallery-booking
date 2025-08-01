# Deployment Guide for Château de Vallery Booking Platform

## Netlify Deployment Checklist

### 1. Environment Variables
You MUST set these environment variables in Netlify:

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the following variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_test_`)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_`)
   - `NODE_VERSION` - Set to `18`

### 2. Build Settings
Verify these settings in Netlify Dashboard → Site Settings → Build & Deploy:

- **Base directory**: Leave empty
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `netlify/functions`

### 3. Required Files
Ensure these files are present in your repository:
- `netlify.toml` - Netlify configuration
- `.env.example` - Environment variable template
- `package.json` - With all dependencies

### 4. Common Issues

#### "Internal Server Error"
- Check that environment variables are set in Netlify
- Verify Stripe keys are valid
- Check the function logs in Netlify

#### "Quirks Mode" Warning
- This should be resolved with the latest _document.tsx changes
- Clear browser cache and hard refresh

#### Build Failures
- Ensure NODE_VERSION is set to 18
- Check build logs for specific errors
- Verify all dependencies are in package.json

### 5. Testing
After deployment:
1. Visit `/test` to verify basic Next.js functionality
2. Try booking a room (requires valid Stripe keys)
3. Check browser console for errors

### 6. Debug Steps
If issues persist:
1. Check Netlify function logs: Functions → View logs
2. Check build logs: Deploys → Click on deploy → View logs
3. Verify environment variables are accessible: Add a test endpoint

## Local Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Stripe keys to .env.local

# Run development server
npm run dev

# Visit http://localhost:3000
```

## Support
- Netlify Docs: https://docs.netlify.com/
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/
- Stripe Test Keys: https://dashboard.stripe.com/test/apikeys