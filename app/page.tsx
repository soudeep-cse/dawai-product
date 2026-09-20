'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/medicines';
import Link from 'next/link';

export default function Home() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-navy to-primary-teal text-white overflow-hidden">
        {/* Background pattern/image placeholder */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-hero-pattern"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Hero copy */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-primary-mint">
                {t('hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/category"
                  className="bg-accent-coral hover:bg-accent-orange text-white px-8 py-3 rounded-lg font-semibold text-center transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/prescription"
                  className="bg-white hover:bg-neutral-light text-primary-navy px-8 py-3 rounded-lg font-semibold text-center transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('hero.upload')}
                </Link>
              </div>
            </div>

            {/* Right: Hero image placeholder */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-80 flex items-center justify-center">
                {/* Placeholder for hero banner image */}
                <div className="text-center">
                  <div className="text-6xl mb-4">💊</div>
                  <p className="text-sm opacity-75">
                    {language === 'bn' ? 'হিরো ব্যানার ছবি এখানে যাবে' : 'Hero banner image goes here'}
                  </p>
                  <p className="text-xs opacity-50 mt-2">hero-banner.jpg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl font-bold text-primary-navy mb-8 text-center">
          {t('nav.categories')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </div>
      </section>

      {/* Trust/Value Proposition Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-navy mb-12 text-center">
            {t('trust.title')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Exact Quantities */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-mint rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-navy">
                {t('trust.exact.title')}
              </h3>
              <p className="text-sm text-neutral-gray">
                {t('trust.exact.desc')}
              </p>
            </div>

            {/* Pharmacist Verified */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-teal rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-navy">
                {t('trust.verified.title')}
              </h3>
              <p className="text-sm text-neutral-gray">
                {t('trust.verified.desc')}
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent-coral rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-navy">
                {t('trust.delivery.title')}
              </h3>
              <p className="text-sm text-neutral-gray">
                {t('trust.delivery.desc')}
              </p>
            </div>

            {/* Privacy Protected */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-navy rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-navy">
                {t('trust.discreet.title')}
              </h3>
              <p className="text-sm text-neutral-gray">
                {t('trust.discreet.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Prescription Flow Explainer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-br from-primary-teal/10 to-primary-mint/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-8 text-center">
            {language === 'bn' ? 'কীভাবে কাজ করে?' : 'How It Works'}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-primary-teal">1</div>
              <h3 className="font-semibold text-primary-navy">
                {language === 'bn' ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription'}
              </h3>
              <p className="text-sm text-neutral-gray">
                {language === 'bn'
                  ? 'আপনার ডাক্তারের প্রেসক্রিপশনের ছবি বা PDF আপলোড করুন'
                  : 'Upload a photo or PDF of your doctor\'s prescription'}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-primary-teal">2</div>
              <h3 className="font-semibold text-primary-navy">
                {language === 'bn' ? 'AI + ফার্মাসিস্ট যাচাই' : 'AI + Pharmacist Review'}
              </h3>
              <p className="text-sm text-neutral-gray">
                {language === 'bn'
                  ? 'AI ওষুধ শনাক্ত করবে, ফার্মাসিস্ট নিশ্চিত করবেন'
                  : 'AI extracts medicines, pharmacist verifies accuracy'}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl font-bold text-primary-teal">3</div>
              <h3 className="font-semibold text-primary-navy">
                {language === 'bn' ? 'সঠিক পরিমাণ পান' : 'Get Exact Amount'}
              </h3>
              <p className="text-sm text-neutral-gray">
                {language === 'bn'
                  ? 'সময়কাল নির্বাচন করুন (৫/৭/১৪ দিন) — ঠিক যতটুকু দরকার ততটুকুই'
                  : 'Choose duration (5/7/14 days) — get exactly what you need'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
