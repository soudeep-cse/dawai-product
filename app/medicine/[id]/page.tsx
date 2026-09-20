'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicineCard from '@/components/MedicineCard';
import { getMedicineById, medicines, Medicine } from '@/data/medicines';

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  const medicine = getMedicineById(params.id as string);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary-navy mb-4">
            {language === 'bn' ? 'ওষুধ পাওয়া যায়নি' : 'Medicine not found'}
          </h1>
          <button
            onClick={() => router.push('/category')}
            className="bg-primary-teal text-white px-6 py-2 rounded-lg hover:bg-primary-mint transition-colors"
          >
            {language === 'bn' ? 'ক্যাটাগরিতে ফিরে যান' : 'Back to Categories'}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPrice = (medicine.pricePerUnit * quantity).toFixed(2);
  const relatedMedicines = medicines
    .filter(m => m.category === medicine.category && m.id !== medicine.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${medicine.name[language]} to cart! (Mock)`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-gray mb-6">
          <button onClick={() => router.push('/')} className="hover:text-primary-teal">
            {t('nav.home')}
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/category?cat=${medicine.category}`)} className="hover:text-primary-teal">
            {language === 'bn'
              ? medicines.find(m => m.category === medicine.category)?.category
              : medicine.category}
          </button>
          <span>/</span>
          <span className="text-primary-navy">{medicine.name[language]}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-gradient-to-br from-primary-mint/20 to-primary-teal/20 rounded-lg h-96 flex items-center justify-center">
              <div className="text-9xl">💊</div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <h1 className="text-3xl font-bold text-primary-navy mb-2">
                {medicine.name[language]}
              </h1>
              {medicine.genericName && (
                <p className="text-lg text-neutral-gray">
                  {medicine.genericName[language]}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {medicine.inStock ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {t('product.in-stock')}
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {t('product.out-of-stock')}
                </span>
              )}
              {medicine.requiresPrescription && (
                <span className="bg-accent-coral/20 text-accent-coral px-3 py-1 rounded-full text-sm font-medium">
                  Rx {t('product.prescription-required')}
                </span>
              )}
              {medicine.isSensitive && (
                <span className="bg-primary-navy/10 text-primary-navy px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {language === 'bn' ? 'গোপনীয় প্যাকেজিং' : 'Discreet Packaging'}
                </span>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-primary-teal/10 to-primary-mint/10 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-gray">{t('product.per-unit')}</span>
                <span className="text-3xl font-bold text-primary-teal">৳{medicine.pricePerUnit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-neutral-gray">
                  {t('product.per-strip')} ({medicine.packSize} {t('product.units')})
                </span>
                <span className="text-neutral-gray">৳{medicine.pricePerPack}</span>
              </div>
            </div>

            {/* Exact Quantity Explainer */}
            <div className="bg-accent-coral/10 border-l-4 border-accent-coral rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-accent-coral flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <strong className="text-primary-navy">
                    {language === 'bn' ? 'ঠিক প্রয়োজন অনুযায়ী কিনুন' : 'Buy Exactly What You Need'}
                  </strong>
                  <p className="text-neutral-gray mt-1">
                    {language === 'bn'
                      ? 'পূর্ণ স্ট্রিপ কিনতে বাধ্য নন। যতটি দরকার ততটি নিন, প্রতি ইউনিট দাম অনুযায়ী।'
                      : 'No forced full-strip purchase. Buy exactly what you need, priced per unit.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {medicine.inStock && !medicine.requiresPrescription && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-navy mb-2">
                    {language === 'bn' ? 'পরিমাণ নির্বাচন করুন' : 'Select Quantity'}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-primary-teal rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-4 py-3 text-primary-teal hover:bg-primary-teal hover:text-white transition-colors text-xl font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center text-xl font-semibold border-x-2 border-primary-teal py-3 focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-4 py-3 text-primary-teal hover:bg-primary-teal hover:text-white transition-colors text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-neutral-gray">
                      {quantity} {medicine.dosageForm}
                      {quantity > 1 && 's'}
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-primary-navy text-white rounded-lg p-4 flex justify-between items-center">
                  <span className="text-lg">
                    {language === 'bn' ? 'মোট মূল্য' : 'Total Price'}
                  </span>
                  <span className="text-2xl font-bold">৳{totalPrice}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-teal hover:bg-primary-mint text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('product.add-to-cart')}
                </button>
              </div>
            )}

            {/* Prescription Required Message */}
            {medicine.requiresPrescription && (
              <div className="bg-accent-coral/10 border border-accent-coral rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-accent-coral mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-accent-coral font-semibold mb-3">
                  {t('product.prescription-required')}
                </p>
                <button
                  onClick={() => router.push('/prescription')}
                  className="bg-accent-coral hover:bg-accent-orange text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {t('hero.upload')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary-navy mb-6">
            {language === 'bn' ? 'পণ্যের তথ্য' : 'Product Information'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary-navy mb-2">
                {language === 'bn' ? 'ফর্ম' : 'Dosage Form'}
              </h3>
              <p className="text-neutral-gray capitalize">{medicine.dosageForm}</p>
            </div>

            {medicine.strength && (
              <div>
                <h3 className="font-semibold text-primary-navy mb-2">
                  {language === 'bn' ? 'শক্তি' : 'Strength'}
                </h3>
                <p className="text-neutral-gray">{medicine.strength}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-primary-navy mb-2">
                {language === 'bn' ? 'প্যাক সাইজ' : 'Pack Size'}
              </h3>
              <p className="text-neutral-gray">
                {medicine.packSize} {medicine.dosageForm}
                {medicine.packSize > 1 && 's'} {language === 'bn' ? 'প্রতি স্ট্রিপে' : 'per strip'}
              </p>
            </div>

            {medicine.manufacturer && (
              <div>
                <h3 className="font-semibold text-primary-navy mb-2">
                  {language === 'bn' ? 'প্রস্তুতকারক' : 'Manufacturer'}
                </h3>
                <p className="text-neutral-gray">{medicine.manufacturer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Medicines */}
        {relatedMedicines.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              {language === 'bn' ? 'সম্পর্কিত ওষুধ' : 'Related Medicines'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMedicines.map((med) => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
