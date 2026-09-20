# Dawai (দাওয়াই) - Medicine Delivery Platform

A responsive medicine delivery website for the Gazipur-Mymensingh corridor in Bangladesh.

## Features

- **Bilingual Support**: Instant switching between Bangla and English
- **Exact-Quantity Selling**: Buy medicines by exact unit count, not just full strips
- **Prescription Upload**: AI-powered medicine extraction with pharmacist verification
- **Six Core Categories**: Prescription Medicine, Daily & OTC, Chronic Care, Baby & Mom, Women's Care, Emergency Needs
- **Discreet Packaging**: Automatic for sensitive items
- **Responsive Design**: Works seamlessly on desktop and mobile browsers

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dawai-website/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── category/          # Category browsing pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Site header with language toggle
│   ├── Footer.tsx         # Site footer
│   └── ...
├── contexts/              # React contexts
│   └── LanguageContext.tsx # Bilingual support
├── data/                  # Mock data
│   ├── medicines.ts       # Medicine catalog
│   └── translations.ts    # UI copy in Bangla/English
└── public/               # Static assets
    ├── logo.png          # Brand logo
    └── hero-banner.jpg   # Homepage banner
```

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **State Management**: React Context API
- **Fonts**: Inter (English) + Noto Sans Bengali (Bangla)

## Brand Colors

- Primary Teal: `#1DA599`
- Primary Mint: `#5DD4B8`
- Primary Navy: `#0F3C5C`
- Accent Coral: `#FF8B6D`

## Development Notes

This is an **interactive prototype** with:
- Mock data for medicines and orders
- Simulated AI prescription reading
- All core UI/UX flows fully functional
- No real payment or backend integration

## Next Steps for Production

1. Integrate real OCR API for prescription reading
2. Build pharmacist verification admin panel
3. Connect payment gateways (bKash, Nagad, card)
4. Set up backend API and database
5. Add user authentication
6. Implement delivery zone mapping

## License

Private - All rights reserved
