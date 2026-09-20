'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bn'); // Default to Bangla

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === 'bn' ? 'bengali' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Complete translations for all UI copy
const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Header
    'site.name': 'দাওয়াই',
    'nav.home': 'হোম',
    'nav.categories': 'ক্যাটাগরি',
    'nav.prescription': 'প্রেসক্রিপশন',
    'nav.account': 'একাউন্ট',
    'nav.cart': 'কার্ট',
    'language.toggle': 'English',

    // Hero section
    'hero.title': 'ঠিক যতটুকু দরকার, ততটুকুই কিনুন',
    'hero.subtitle': 'পূর্ণ স্ট্রিপ নয় — শুধু প্রয়োজনীয় ট্যাবলেটের সংখ্যা অনুযায়ী দাম',
    'hero.cta': 'অর্ডার করুন',
    'hero.upload': 'প্রেসক্রিপশন আপলোড করুন',

    // Categories
    'category.prescription': 'প্রেসক্রিপশন মেডিসিন',
    'category.daily-otc': 'দৈনিক ও OTC',
    'category.chronic': 'ক্রনিক কেয়ার',
    'category.baby-mom': 'শিশু ও মা',
    'category.women': 'নারী স্বাস্থ্য',
    'category.emergency': 'জরুরি প্রয়োজন',

    // Category descriptions
    'category.prescription.desc': 'ডাক্তারের প্রেসক্রিপশন প্রয়োজন',
    'category.daily-otc.desc': 'ব্যথানাশক, সর্দি-কাশি, মলম ও তেল',
    'category.chronic.desc': 'ডায়াবেটিস, উচ্চরক্তচাপ, থাইরয়েড, হার্ট',
    'category.baby-mom.desc': 'ফর্মুলা, ডায়াপার, প্রসবপূর্ব ভিটামিন',
    'category.women.desc': 'স্যানিটারি পণ্য, গর্ভাবস্থা পরীক্ষা',
    'category.emergency.desc': 'গোপনীয় প্যাকেজিং সহ',

    // Trust section
    'trust.title': 'কেন দাওয়াই?',
    'trust.exact.title': 'ঠিক প্রয়োজন অনুযায়ী',
    'trust.exact.desc': 'পূর্ণ স্ট্রিপ কিনতে বাধ্য নন — ১১-১৩টি ট্যাবলেট দরকার? ঠিক ততটুকুই পাবেন, প্রতি ইউনিট দাম অনুযায়ী',
    'trust.verified.title': 'ফার্মাসিস্ট যাচাইকৃত',
    'trust.verified.desc': 'প্রেসক্রিপশন আপলোড করুন — আমাদের AI ওষুধ শনাক্ত করবে, তারপর লাইসেন্সপ্রাপ্ত ফার্মাসিস্ট নিশ্চিত করবেন সব ঠিক আছে',
    'trust.delivery.title': 'দ্রুত ডেলিভারি',
    'trust.delivery.desc': 'গাজীপুর থেকে ময়মনসিংহ পর্যন্ত — আপনার এলাকার জন্য সময় ও খরচ দেখুন',
    'trust.discreet.title': 'গোপনীয়তা রক্ষা',
    'trust.discreet.desc': 'জরুরি পণ্যগুলি স্বয়ংক্রিয়ভাবে সাদামাটা প্যাকেজে আসবে — কোনো লেবেল নেই',

    // Filters
    'filter.all': 'সব',
    'filter.in-stock': 'স্টকে আছে',
    'filter.prescription-only': 'শুধুমাত্র প্রেসক্রিপশন',
    'filter.otc': 'OTC',
    'filter.subcategory': 'সাব-ক্যাটাগরি',

    // Product card
    'product.per-unit': 'প্রতি ইউনিট',
    'product.per-strip': 'প্রতি স্ট্রিপ',
    'product.in-stock': 'স্টকে আছে',
    'product.out-of-stock': 'স্টক শেষ',
    'product.prescription-required': 'প্রেসক্রিপশন প্রয়োজন',
    'product.add-to-cart': 'কার্টে যোগ করুন',
    'product.units': 'ইউনিট',

    // Footer
    'footer.about': 'দাওয়াই সম্পর্কে',
    'footer.contact': 'যোগাযোগ',
    'footer.terms': 'শর্তাবলী',
    'footer.privacy': 'গোপনীয়তা নীতি',
    'footer.delivery': 'ডেলিভারি এলাকা',
    'footer.copyright': '© ২০২৬ দাওয়াই। সর্বস্বত্ব সংরক্ষিত।',

    // Common
    'loading': 'লোড হচ্ছে...',
    'search': 'খুঁজুন',
    'search.placeholder': 'ওষুধ খুঁজুন...',
  },
  en: {
    // Header
    'site.name': 'Dawai',
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.prescription': 'Prescription',
    'nav.account': 'Account',
    'nav.cart': 'Cart',
    'language.toggle': 'বাংলা',

    // Hero section
    'hero.title': 'Buy Exactly What You Need',
    'hero.subtitle': 'No full strips — pay per tablet, priced by exact unit count',
    'hero.cta': 'Order Now',
    'hero.upload': 'Upload Prescription',

    // Categories
    'category.prescription': 'Prescription Medicine',
    'category.daily-otc': 'Daily & OTC',
    'category.chronic': 'Chronic Care',
    'category.baby-mom': 'Baby & Mom',
    'category.women': 'Women\'s Care',
    'category.emergency': 'Emergency Needs',

    // Category descriptions
    'category.prescription.desc': 'Requires doctor\'s prescription',
    'category.daily-otc.desc': 'Pain relief, cold & flu, ointments & oils',
    'category.chronic.desc': 'Diabetes, blood pressure, thyroid, heart',
    'category.baby-mom.desc': 'Formula, diapers, prenatal vitamins',
    'category.women.desc': 'Sanitary products, pregnancy tests',
    'category.emergency.desc': 'With discreet packaging',

    // Trust section
    'trust.title': 'Why Dawai?',
    'trust.exact.title': 'Exact Quantities',
    'trust.exact.desc': 'No forced full-strip purchases — need 11-13 tablets? Get exactly that, priced per unit',
    'trust.verified.title': 'Pharmacist Verified',
    'trust.verified.desc': 'Upload prescription — our AI extracts medicines, then a licensed pharmacist confirms everything is correct',
    'trust.delivery.title': 'Fast Delivery',
    'trust.delivery.desc': 'Gazipur to Mymensingh corridor — see delivery time and cost for your zone',
    'trust.discreet.title': 'Privacy Protected',
    'trust.discreet.desc': 'Emergency items come in plain packaging automatically — no labels',

    // Filters
    'filter.all': 'All',
    'filter.in-stock': 'In Stock',
    'filter.prescription-only': 'Prescription Only',
    'filter.otc': 'OTC',
    'filter.subcategory': 'Subcategory',

    // Product card
    'product.per-unit': 'per unit',
    'product.per-strip': 'per strip',
    'product.in-stock': 'In Stock',
    'product.out-of-stock': 'Out of Stock',
    'product.prescription-required': 'Prescription Required',
    'product.add-to-cart': 'Add to Cart',
    'product.units': 'units',

    // Footer
    'footer.about': 'About Dawai',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.delivery': 'Delivery Zones',
    'footer.copyright': '© 2026 Dawai. All rights reserved.',

    // Common
    'loading': 'Loading...',
    'search': 'Search',
    'search.placeholder': 'Search for medicines...',
  },
};
