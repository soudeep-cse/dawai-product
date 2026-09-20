'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">
          {language === 'bn' ? 'আমার একাউন্ট' : 'My Account'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold text-primary-navy mb-2">
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </h2>
          <p className="text-neutral-gray mb-6">
            {language === 'bn'
              ? 'আপনার অর্ডার, প্রেসক্রিপশন এবং সংরক্ষিত ওষুধ দেখুন'
              : 'View your orders, prescriptions, and saved medicines'}
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <input
              type="tel"
              placeholder={language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile number'}
              className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
            <button className="w-full bg-primary-teal hover:bg-primary-mint text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {language === 'bn' ? 'OTP পাঠান' : 'Send OTP'}
            </button>
          </div>

          <p className="text-xs text-neutral-gray mt-6">
            {language === 'bn'
              ? 'প্রোটোটাইপ — প্রকৃত লগইন সংযুক্ত নয়'
              : 'Prototype — actual login not integrated'}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
