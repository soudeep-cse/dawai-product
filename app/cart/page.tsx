'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">
          {language === 'bn' ? 'আপনার কার্ট' : 'Your Cart'}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-primary-navy mb-2">
            {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
          </h2>
          <p className="text-neutral-gray mb-6">
            {language === 'bn'
              ? 'ওষুধ যোগ করতে শুরু করুন'
              : 'Start adding medicines to your cart'}
          </p>
          <a
            href="/category"
            className="inline-block bg-primary-teal hover:bg-primary-mint text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {language === 'bn' ? 'ওষুধ ব্রাউজ করুন' : 'Browse Medicines'}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
