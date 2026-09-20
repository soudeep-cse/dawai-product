# Dawai Website - Setup Guide

This guide will help you get the Dawai medicine delivery website up and running.

## Prerequisites

Before you begin, ensure you have:
- **Node.js** version 18 or higher installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)

## Quick Start

### 1. Add Your Brand Images

First, copy your brand assets to the `public` folder:

```
dawai-website/public/
├── logo.png           ← Your Dawai logo
├── hero-banner.jpg    ← Your hero banner image
└── favicon.ico        ← Browser tab icon
```

You uploaded these images in our chat. Find them in your uploads and copy them to the `public` folder.

**Image specifications:**
- `logo.png` - Transparent background preferred, ~300x150px
- `hero-banner.jpg` - 1920x800px recommended for best desktop quality
- `favicon.ico` - 32x32px or 48x48px

### 2. Install Dependencies

Open your terminal in the `dawai-website` folder and run:

```bash
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, etc.)

### 3. Start the Development Server

```bash
npm run dev
```

The site will start at **http://localhost:3000**

Open this URL in your browser to see the website!

### 4. Test the Bilingual Toggle

- Click the language toggle button in the top-right corner
- All text should instantly switch between Bangla and English
- No page reload should occur

## What's Included

### ✅ Working Pages

- **Homepage** (`/`) - Hero section, category tiles, trust badges
- **Category Browsing** (`/category`) - Filterable medicine catalog
- **Prescription Upload** (`/prescription`) - Upload flow placeholder
- **Account** (`/account`) - Login placeholder
- **Cart** (`/cart`) - Shopping cart placeholder

### ✅ Key Features

- **Bilingual Support** - Instant Bangla/English switching
- **Six Categories** - All categories with mock medicines
- **Responsive Design** - Works on desktop and mobile
- **Exact-Quantity Messaging** - Value proposition prominently displayed
- **Discreet Packaging Indicators** - Automatic for sensitive items
- **Mock Data** - 22 realistic medicine listings across all categories

### 📦 Mock Data

Check `data/medicines.ts` for the complete catalog:
- Prescription medicines
- Daily & OTC (including ointments/oils)
- Chronic care (diabetes, BP, thyroid, heart)
- Baby & mom care
- Women's care
- Emergency needs (with `isSensitive: true`)

## File Structure

```
dawai-website/
├── app/
│   ├── page.tsx              # Homepage
│   ├── category/page.tsx     # Category browsing
│   ├── prescription/page.tsx # Prescription upload
│   ├── account/page.tsx      # Account/login
│   ├── cart/page.tsx         # Shopping cart
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── Header.tsx            # Site header with nav
│   ├── Footer.tsx            # Site footer
│   ├── CategoryCard.tsx      # Category tile component
│   └── MedicineCard.tsx      # Product card
├── contexts/
│   └── LanguageContext.tsx   # Bilingual state management
├── data/
│   └── medicines.ts          # Mock medicine catalog
├── public/
│   └── [your images go here]
└── [config files]
```

## Customization

### Change Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    teal: '#1DA599',    // Your primary teal
    mint: '#5DD4B8',    // Your mint green
    navy: '#0F3C5C',    // Your navy blue
  },
  accent: {
    coral: '#FF8B6D',   // Your coral accent
  },
}
```

### Add More Medicines

Edit `data/medicines.ts` and add to the `medicines` array:

```typescript
{
  id: 'med-023',
  name: { bn: 'বাংলা নাম', en: 'English Name' },
  category: 'daily-otc',
  packSize: 10,
  pricePerPack: 50,
  pricePerUnit: 5,
  inStock: true,
  requiresPrescription: false,
  dosageForm: 'tablet',
}
```

### Add/Edit Translations

Edit `contexts/LanguageContext.tsx` in the `translations` object:

```typescript
const translations = {
  bn: {
    'your.key': 'বাংলা টেক্সট',
  },
  en: {
    'your.key': 'English text',
  },
};
```

Then use in components: `{t('your.key')}`

## Building for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

To test the production build locally:

```bash
npm run start
```

## Deployment

You can deploy to:
- **Vercel** (recommended, built by Next.js creators) - [vercel.com](https://vercel.com)
- **Netlify** - [netlify.com](https://netlify.com)
- **Any Node.js hosting** (AWS, DigitalOcean, etc.)

### Deploy to Vercel (easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js and deploys!

## Next Steps for Production

This is an **interactive prototype**. To make it production-ready:

### Phase 1: Backend & Database
- [ ] Set up PostgreSQL or MongoDB database
- [ ] Build REST API or GraphQL backend
- [ ] User authentication (phone OTP via Twilio/SMS provider)
- [ ] Medicine inventory management

### Phase 2: Prescription AI
- [ ] Integrate OCR API (Google Vision, AWS Textract, or Tesseract)
- [ ] Build pharmacist verification admin panel
- [ ] Prescription approval workflow
- [ ] Duration calculator logic (5/7/14 days)

### Phase 3: Payments & Orders
- [ ] bKash payment gateway integration
- [ ] Nagad integration
- [ ] Card payments (SSLCommerz or similar)
- [ ] Order management system
- [ ] SMS notifications for order status

### Phase 4: Delivery
- [ ] Delivery zone mapping (Gazipur to Mymensingh)
- [ ] Delivery fee calculator by zone
- [ ] Rider assignment and tracking
- [ ] Real-time order tracking

### Phase 5: Polish
- [ ] User reviews and ratings
- [ ] Reorder chronic medications flow
- [ ] Medicine search autocomplete
- [ ] Promotional codes/discounts
- [ ] Analytics and reporting

## Troubleshooting

### Port already in use
If you see "Port 3000 is already in use":
```bash
# Kill the process on port 3000 (Windows)
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind classes not working
```bash
# Restart the dev server
# Press Ctrl+C to stop, then npm run dev again
```

## Support

- **Next.js docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React docs**: [react.dev](https://react.dev)

## License

Private - All rights reserved by Dawai
