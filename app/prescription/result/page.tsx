'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ExtractedMedicine {
  id: string;
  name: { bn: string; en: string };
  dosage: string;
  frequency: string; // e.g., "3 times daily", "দিনে ৩ বার"
  verified: boolean;
  pricePerUnit: number;
}

// Mock extracted medicines from prescription
const mockExtractedMedicines: ExtractedMedicine[] = [
  {
    id: 'med-001',
    name: { bn: 'নাপা এক্সটেন্ড', en: 'Napa Extend' },
    dosage: '665mg',
    frequency: 'দিনে ৩ বার / 3 times daily',
    verified: true,
    pricePerUnit: 3,
  },
  {
    id: 'med-002',
    name: { bn: 'এসিলক', en: 'Aciloc' },
    dosage: '150mg',
    frequency: 'দিনে ২ বার / 2 times daily',
    verified: true,
    pricePerUnit: 5,
  },
  {
    id: 'med-009',
    name: { bn: 'মেটফরমিন', en: 'Metformin' },
    dosage: '500mg',
    frequency: 'দিনে ২ বার / 2 times daily',
    verified: true,
    pricePerUnit: 2,
  },
];

export default function PrescriptionResultPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<5 | 7 | 14>(7);

  const durations = [
    { days: 5, label: language === 'bn' ? '৫ দিন' : '5 Days' },
    { days: 7, label: language === 'bn' ? '৭ দিন' : '7 Days' },
    { days: 14, label: language === 'bn' ? '১৪ দিন' : '14 Days' },
  ];

  // Calculate exact count and price for each medicine based on duration
  const calculateMedicineDetails = (medicine: ExtractedMedicine) => {
    const timesPerDay = parseInt(medicine.frequency.match(/\d+/)?.[0] || '1');
    const exactCount = timesPerDay * selectedDuration;
    const exactPrice = exactCount * medicine.pricePerUnit;

    return { exactCount, exactPrice };
  };

  const getTotalPrice = () => {
    return mockExtractedMedicines.reduce((total, med) => {
      const { exactPrice } = calculateMedicineDetails(med);
      return total + exactPrice;
    }, 0);
  };

  const handleAddAllToCart = () => {
    alert(`Added all medicines for ${selectedDuration} days to cart! (Mock)`);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-navy">
                {language === 'bn' ? 'প্রেসক্রিপশন যাচাইকৃত ✓' : 'Prescription Verified ✓'}
              </h1>
              <p className="text-sm text-neutral-gray">
                {language === 'bn' ? 'ফার্মাসিস্ট দ্বারা অনুমোদিত' : 'Approved by licensed pharmacist'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Prescription Preview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="font-semibold text-primary-navy mb-4">
                {language === 'bn' ? 'আপলোড করা প্রেসক্রিপশন' : 'Uploaded Prescription'}
              </h2>
              <div className="bg-gradient-to-br from-neutral-light to-white border-2 border-dashed border-neutral-light rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">📄</div>
                  <p className="text-xs text-neutral-gray">
                    {language === 'bn' ? 'প্রেসক্রিপশন ইমেজ' : 'Prescription image'}
                  </p>
                </div>
              </div>

              {/* Verification badge */}
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="font-medium">
                    {language === 'bn' ? 'ফার্মাসিস্ট: ডা. রহিম' : 'Pharmacist: Dr. Rahim'}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {language === 'bn' ? 'যাচাই সম্পন্ন হয়েছে' : 'Verification complete'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Medicine List with Duration Calculator */}
          <div className="md:col-span-2 space-y-6">
            {/* Duration Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'চিকিৎসার সময়কাল নির্বাচন করুন' : 'Choose Treatment Duration'}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {durations.map((duration) => (
                  <button
                    key={duration.days}
                    onClick={() => setSelectedDuration(duration.days as 5 | 7 | 14)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDuration === duration.days
                        ? 'border-primary-teal bg-primary-teal/10 shadow-md'
                        : 'border-neutral-light hover:border-primary-teal/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        selectedDuration === duration.days ? 'text-primary-teal' : 'text-neutral-dark'
                      }`}>
                        {duration.days}
                      </div>
                      <div className={`text-sm ${
                        selectedDuration === duration.days ? 'text-primary-teal' : 'text-neutral-gray'
                      }`}>
                        {language === 'bn' ? 'দিন' : 'days'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-accent-coral/10 border-l-4 border-accent-coral rounded-lg p-3">
                <p className="text-sm text-neutral-gray">
                  {language === 'bn'
                    ? 'আপনার পছন্দের সময়কাল নির্বাচন করুন — ঠিক যতটি ট্যাবলেট দরকার ততটি পাবেন'
                    : 'Choose your preferred duration — you\'ll get exactly the tablet count needed'}
                </p>
              </div>
            </div>

            {/* Medicine Cards */}
            {mockExtractedMedicines.map((medicine) => {
              const { exactCount, exactPrice } = calculateMedicineDetails(medicine);

              return (
                <div key={medicine.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-primary-navy">
                          {medicine.name[language]}
                        </h3>
                        {medicine.verified && (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            ✓ {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-neutral-gray">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {medicine.frequency}
                        </span>
                        <span>•</span>
                        <span>{medicine.dosage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration Calculation */}
                  <div className="bg-gradient-to-br from-primary-mint/10 to-primary-teal/10 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-neutral-gray">
                        {language === 'bn' ? 'প্রয়োজনীয় সংখ্যা' : 'Exact count needed'}
                        <span className="text-xs ml-1">({selectedDuration} {language === 'bn' ? 'দিনের জন্য' : 'days'})</span>
                      </span>
                      <span className="text-2xl font-bold text-primary-navy">
                        {exactCount} {language === 'bn' ? 'টি ট্যাবলেট' : 'tablets'}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-neutral-gray">
                        {language === 'bn' ? 'মোট মূল্য' : 'Total price'}
                      </span>
                      <span className="text-xl font-bold text-primary-teal">
                        ৳{exactPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-primary-teal/20 text-xs text-neutral-gray">
                      ৳{medicine.pricePerUnit} × {exactCount} {language === 'bn' ? 'ট্যাবলেট' : 'tablets'}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total and CTA */}
            <div className="bg-primary-navy text-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm opacity-80">
                    {language === 'bn' ? 'সর্বমোট মূল্য' : 'Total Price'}
                  </div>
                  <div className="text-sm opacity-60">
                    {selectedDuration} {language === 'bn' ? 'দিনের চিকিৎসার জন্য' : 'days of treatment'}
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  ৳{getTotalPrice().toFixed(2)}
                </div>
              </div>

              <button
                onClick={handleAddAllToCart}
                className="w-full bg-accent-coral hover:bg-accent-orange text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
              >
                {language === 'bn' ? 'সব কার্টে যোগ করুন' : 'Add All to Cart'}
              </button>

              <p className="text-xs text-center mt-3 opacity-60">
                {language === 'bn'
                  ? 'আপনি চেকআউটে সময়কাল পরিবর্তন করতে পারবেন'
                  : 'You can change duration at checkout'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
