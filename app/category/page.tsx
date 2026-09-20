'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicineCard from '@/components/MedicineCard';
import { categories, medicines, Medicine, Category } from '@/data/medicines';

function CategoryContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('cat') as Category | null;

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(categoryParam || 'all');
  const [filterStock, setFilterStock] = useState<'all' | 'in-stock'>('all');
  const [filterPrescription, setFilterPrescription] = useState<'all' | 'prescription' | 'otc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter medicines
  const filteredMedicines = medicines.filter((med) => {
    // Category filter
    if (selectedCategory !== 'all' && med.category !== selectedCategory) {
      return false;
    }

    // Stock filter
    if (filterStock === 'in-stock' && !med.inStock) {
      return false;
    }

    // Prescription filter
    if (filterPrescription === 'prescription' && !med.requiresPrescription) {
      return false;
    }
    if (filterPrescription === 'otc' && med.requiresPrescription) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = med.name[language].toLowerCase();
      const genericName = med.genericName?.[language]?.toLowerCase() || '';
      return name.includes(query) || genericName.includes(query);
    }

    return true;
  });

  const handleAddToCart = (medicine: Medicine, quantity: number) => {
    // Mock add to cart - in real app, this would update cart state
    alert(`Added ${quantity} ${medicine.name[language]} to cart! (Mock)`);
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-navy mb-2">
            {selectedCategory === 'all'
              ? t('nav.categories')
              : categories.find((c) => c.id === selectedCategory)?.name[language]}
          </h1>
          <p className="text-neutral-gray">
            {filteredMedicines.length} {language === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'products found'}
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-primary-teal text-white'
                  : 'bg-white text-neutral-dark hover:bg-neutral-light'
              }`}
            >
              {t('filter.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-primary-teal text-white'
                    : 'bg-white text-neutral-dark hover:bg-neutral-light'
                }`}
              >
                {cat.icon} {cat.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              />
            </div>

            {/* Stock filter */}
            <div>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value as 'all' | 'in-stock')}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="in-stock">{t('filter.in-stock')}</option>
              </select>
            </div>

            {/* Prescription filter */}
            <div>
              <select
                value={filterPrescription}
                onChange={(e) => setFilterPrescription(e.target.value as 'all' | 'prescription' | 'otc')}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              >
                <option value="all">{t('filter.all')}</option>
                <option value="prescription">{t('filter.prescription-only')}</option>
                <option value="otc">{t('filter.otc')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exact-quantity selling explainer (only show on first visit or for certain categories) */}
        {(selectedCategory === 'all' || selectedCategory === 'prescription' || selectedCategory === 'chronic') && (
          <div className="bg-gradient-to-r from-primary-mint/20 to-primary-teal/20 border-l-4 border-primary-teal rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary-teal flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-primary-navy mb-1">
                  {language === 'bn' ? 'ঠিক প্রয়োজন অনুযায়ী কিনুন' : 'Buy Exactly What You Need'}
                </h3>
                <p className="text-sm text-neutral-gray">
                  {language === 'bn'
                    ? 'অধিকাংশ ফার্মেসি শুধু পূর্ণ স্ট্রিপ বিক্রি করে। আমরা ভিন্ন — আপনার প্রয়োজন অনুযায়ী সঠিক সংখ্যক ট্যাবলেট পাবেন, প্রতি ইউনিট দাম অনুযায়ী। ১১টি দরকার? ঠিক ১১টি পাবেন, ১০টি নয়।'
                    : 'Most pharmacies only sell full strips. We\'re different — you get the exact tablet count you need, priced per unit. Need 11? Get exactly 11, not 10.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-neutral-dark mb-2">
              {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
            </h3>
            <p className="text-neutral-gray">
              {language === 'bn'
                ? 'অন্য ফিল্টার ব্যবহার করে দেখুন বা সব ক্যাটাগরি দেখুন'
                : 'Try different filters or browse all categories'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setFilterStock('all');
                setFilterPrescription('all');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-mint transition-colors"
            >
              {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-neutral-gray">Loading...</p>
        </div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
