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
    'hero.title': 'প্রেসক্রিপশন ফটো → AI পড়ে → ফার্মাসিস্ট অনুমোদন করে → সঠিক দাম',
    'hero.title-secondary': 'ঠিক যতটুকু দরকার, ততটুকুই কিনুন',
    'hero.subtitle': 'আপনার ডাক্তারের প্রেসক্রিপশনের ছবি আপলোড করুন। আমাদের AI ওষুধ চিনবে, লাইসেন্সপ্রাপ্ত ফার্মাসিস্ট অনুমোদন করবেন, এবং আপনি যেটা দরকার শুধু সেটাই পাবেন।',
    'hero.cta': 'আপনার প্রেসক্রিপশন আপলোড করুন',
    'hero.cta-secondary': 'কিছু ছাড়াই কিনুন',
    'hero.upload': 'প্রেসক্রিপশন আপলোড করুন',

    // Prescription flow
    'prescription.step1': 'প্রেসক্রিপশন আপলোড',
    'prescription.step1.desc': 'ডাক্তারের প্রেসক্রিপশনের ছবি বা PDF শেয়ার করুন',
    'prescription.step2': 'AI ওষুধ চেনে',
    'prescription.step2.desc': 'আমাদের AI প্রতিটি ওষুধ, মাত্রা এবং সময়কাল বের করে',
    'prescription.step3': 'ফার্মাসিস্ট যাচাই করে',
    'prescription.step3.desc': 'লাইসেন্সপ্রাপ্ত ফার্মাসিস্ট ১০০% যাচাই করে এবং অনুমোদন দেয়',
    'prescription.step4': 'সঠিক পরিমাণ পান',
    'prescription.step4.desc': 'ঠিক যতটুকু দরকার ততটুকুই, প্রতি ট্যাবলেট দামে',

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

    // Subcategories - Prescription
    'subcategory.capsule': 'ক্যাপসুল',
    'subcategory.syrup': 'সিরাপ',
    'subcategory.injection': 'ইনজেকশন',
    'subcategory.inhaler': 'ইনহেলার',
    'subcategory.insulin': 'ইনসুলিন',

    // Subcategories - Daily & OTC
    'subcategory.cold-flu': 'জ্বর/সর্দি',
    'subcategory.bethanashok': 'ব্যথানাশক/মলম',
    'subcategory.gastric-digestive': 'গ্যাস্ট্রিক/হজন',

    // Subcategories - Chronic Care
    'subcategory.diabetes': 'ডায়াবেটিস',
    'subcategory.blood-pressure': 'উচ্চরক্তচাপ',
    'subcategory.thyroid': 'থাইরয়েড',
    'subcategory.heart-cardiac': 'হার্ট/কার্ডিয়াক',

    // Subcategories - Baby & Mom
    'subcategory.formula': 'শিশুর ফর্মুলা/দুধ',
    'subcategory.diapers': 'ডায়াপার',
    'subcategory.baby-skin-care': 'শিশু ত্বকের যত্ন',
    'subcategory.prenatal': 'প্রসবপূর্ব ভিটামিন',
    'subcategory.maternity': 'মাতৃত্ব যত্ন',
    'subcategory.wipes': 'ওয়েট টিস্যু/টিস্যু',

    // Subcategories - Women's Care
    'subcategory.sanitary': 'স্যানিটারি প্যাড',
    'subcategory.feminine-hygiene': 'নারী স্বাস্থ্যবিধি',
    'subcategory.women-vitamins': 'নারী ভিটামিন/সাপ্লিমেন্ট',
    'subcategory.pregnancy-test': 'গর্ভাবস্থা পরীক্ষা',

    // Subcategories - Emergency
    'subcategory.emergency-contraceptive': 'জরুরি জন্মনিয়ন্ত্রণ',
    'subcategory.condom': 'কনডম',
    'subcategory.lubricant': 'লুব্রিক্যান্ট/জেল',

    // Product card
    'product.per-unit': 'প্রতি ইউনিট',
    'product.per-strip': 'প্রতি স্ট্রিপ',
    'product.in-stock': 'স্টকে আছে',
    'product.out-of-stock': 'স্টক শেষ',
    'product.prescription-required': 'প্রেসক্রিপশন প্রয়োজন',
    'product.add-to-cart': 'কার্টে যোগ করুন',
    'product.units': 'ইউনিট',

    // Footer
    'footer.company': 'কোম্পানি',
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
    'hero.title': 'Prescription Photo → AI Reads → Pharmacist Approves → Exact Price',
    'hero.title-secondary': 'Buy Exactly What You Need',
    'hero.subtitle': 'Upload a photo of your doctor\'s prescription. Our AI identifies the medicines, a licensed pharmacist verifies and approves, and you get only what you need.',
    'hero.cta': 'Upload Your Prescription',
    'hero.cta-secondary': 'Browse Without Prescription',
    'hero.upload': 'Upload Prescription',

    // Prescription flow
    'prescription.step1': 'Upload Prescription',
    'prescription.step1.desc': 'Share a photo or PDF of your doctor\'s prescription',
    'prescription.step2': 'AI Reads Medicines',
    'prescription.step2.desc': 'Our AI extracts each medicine, dosage, and duration',
    'prescription.step3': 'Pharmacist Verifies',
    'prescription.step3.desc': 'Licensed pharmacist 100% verifies and approves',
    'prescription.step4': 'Get Exact Amount',
    'prescription.step4.desc': 'Only what you need, priced per tablet',

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

    // Subcategories - Prescription
    'subcategory.capsule': 'Capsules',
    'subcategory.syrup': 'Syrups',
    'subcategory.injection': 'Injections',
    'subcategory.inhaler': 'Inhalers',
    'subcategory.insulin': 'Insulin',

    // Subcategories - Daily & OTC
    'subcategory.cold-flu': 'Fever & Cold',
    'subcategory.bethanashok': 'Painkillers/Ointments',
    'subcategory.gastric-digestive': 'Gastric/Digestive',

    // Subcategories - Chronic Care
    'subcategory.diabetes': 'Diabetes',
    'subcategory.blood-pressure': 'Blood Pressure',
    'subcategory.thyroid': 'Thyroid',
    'subcategory.heart-cardiac': 'Heart/Cardiac',

    // Subcategories - Baby & Mom
    'subcategory.formula': 'Baby Formula/Milk',
    'subcategory.diapers': 'Diapers',
    'subcategory.baby-skin-care': 'Baby Skin Care',
    'subcategory.prenatal': 'Prenatal Vitamins',
    'subcategory.maternity': 'Maternity Care',
    'subcategory.wipes': 'Wet Tissue/Tissue',

    // Subcategories - Women's Care
    'subcategory.sanitary': 'Sanitary Pads',
    'subcategory.feminine-hygiene': 'Feminine Hygiene',
    'subcategory.women-vitamins': 'Women\'s Vitamins/Supplements',
    'subcategory.pregnancy-test': 'Pregnancy Tests',

    // Subcategories - Emergency
    'subcategory.emergency-contraceptive': 'Emergency Contraceptive',
    'subcategory.condom': 'Condoms',
    'subcategory.lubricant': 'Lubricant/Gel',

    // Product card
    'product.per-unit': 'per unit',
    'product.per-strip': 'per strip',
    'product.in-stock': 'In Stock',
    'product.out-of-stock': 'Out of Stock',
    'product.prescription-required': 'Prescription Required',
    'product.add-to-cart': 'Add to Cart',
    'product.units': 'units',

    // Footer
    'footer.company': 'Company',
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
