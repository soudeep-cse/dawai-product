'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrescriptionPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-navy mb-2">
            {t('hero.upload')}
          </h1>
          <p className="text-neutral-gray">
            {language === 'bn'
              ? 'আপনার ডাক্তারের প্রেসক্রিপশন আপলোড করুন এবং আমরা বাকিটা সামলাব'
              : 'Upload your doctor\'s prescription and we\'ll handle the rest'}
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-2 border-dashed border-primary-teal rounded-lg p-12 text-center hover:bg-primary-teal/5 transition-colors cursor-pointer">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-primary-navy mb-2">
              {language === 'bn' ? 'এখানে ক্লিক করুন বা ছবি টেনে আনুন' : 'Click here or drag and drop'}
            </h3>
            <p className="text-sm text-neutral-gray mb-4">
              {language === 'bn' ? 'JPG, PNG বা PDF (সর্বোচ্চ 10MB)' : 'JPG, PNG or PDF (max 10MB)'}
            </p>
            <button className="bg-primary-teal hover:bg-primary-mint text-white px-6 py-2 rounded-lg transition-colors">
              {language === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Select File'}
            </button>
          </div>

          {/* How it works */}
          <div className="mt-10 space-y-4">
            <h3 className="text-lg font-bold text-primary-navy mb-6">
              {language === 'bn' ? 'সুরক্ষিত প্রক্রিয়া: কীভাবে কাজ করে?' : 'Secure Process: How It Works'}
            </h3>

            <div className="space-y-3">
              {/* Step 1: AI Analysis */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-mint rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary-navy">
                    {language === 'bn' ? '🤖 AI বিশ্লেষণ' : '🤖 AI Analysis'}
                  </h4>
                  <p className="text-sm text-neutral-gray mt-1">
                    {language === 'bn'
                      ? 'আমাদের AI প্রযুক্তি দ্রুত ওষুধের নাম, মাত্রা এবং নির্দেশনা চিনে নেয়'
                      : 'Our AI technology quickly identifies medicine names, dosages, and instructions'}
                  </p>
                </div>
              </div>

              {/* Step 2: Pharmacist Verification - HIGHLIGHTED */}
              <div className="border-l-4 border-primary-teal bg-primary-teal/5 pl-4 py-3 rounded-r-lg flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-teal rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary-navy flex items-center gap-2">
                    ✅ {language === 'bn' ? 'ফার্মাসিস্ট ১০০% যাচাই' : '✅ Pharmacist 100% Verifies'}
                  </h4>
                  <p className="text-sm text-neutral-dark mt-1 font-medium">
                    {language === 'bn'
                      ? 'প্রতিটি AI পড়া বিষয় একজন লাইসেন্সপ্রাপ্ত ফার্মাসিস্ট হাতে হাত মিলিয়ে যাচাই এবং অনুমোদন করেন — কোনো ভুল নেই'
                      : 'Every AI reading is personally verified and approved by a licensed pharmacist — zero errors'}
                  </p>
                </div>
              </div>

              {/* Step 3: Choose Duration */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent-coral rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary-navy">
                    {language === 'bn' ? '💊 সময়কাল ও পরিমাণ বাছুন' : '💊 Choose Duration & Quantity'}
                  </h4>
                  <p className="text-sm text-neutral-gray mt-1">
                    {language === 'bn'
                      ? '৫, ৭, বা ১৪ দিনের চিকিৎসা চয়ন করুন এবং ঠিক যতটুকু দরকার সেটাই দেখুন'
                      : 'Pick 5, 7, or 14 days of treatment and see the exact count you need'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-neutral-light">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-gray">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {language === 'bn' ? 'সুরক্ষিত ও গোপনীয়' : 'Secure & Private'}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {language === 'bn' ? 'দ্রুত প্রক্রিয়াকরণ' : 'Fast Processing'}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {language === 'bn' ? 'ফার্মাসিস্ট যাচাইকৃত' : 'Pharmacist Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-neutral-gray mt-6">
          {language === 'bn'
            ? 'এটি একটি প্রোটোটাইপ — প্রকৃত আপলোড ও AI বিশ্লেষণ এখনো সংযুক্ত নয়'
            : 'This is a prototype — actual upload and AI analysis not yet integrated'}
        </p>
      </div>

      <Footer />
    </div>
  );
}
