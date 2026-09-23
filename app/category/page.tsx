'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MedicineCard from '@/components/MedicineCard';
import { useCategories } from '@/hooks/useCategories';
import { useMedicines } from '@/hooks/useMedicines';
import { useMedicineSearch } from '@/hooks/useMedicineSearch';

function CategoryContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(categoryParam || 'all');
  const [filterPrescription, setFilterPrescription] = useState<'all' | 'prescription' | 'otc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { categories, loading: categoriesLoading } = useCategories();
  const { medicines, loading: medicinesLoading } = useMedicines({
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    requiresPrescription:
      filterPrescription === 'prescription' ? true : filterPrescription === 'otc' ? false : undefined,
  });
  const { results: searchResults, search, clear: clearSearch } = useMedicineSearch();

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Filter medicines based on local search
  const filteredMedicines = searchQuery
    ? searchResults.filter((med) => {
        const query = searchQuery.toLowerCase();
        const name = med.nameEn?.toLowerCase() || med.nameBn?.toLowerCase() || '';
        const genericName = med.genericNameEn?.toLowerCase() || med.genericNameBn?.toLowerCase() || '';
        return name.includes(query) || genericName.includes(query);
      })
    : medicines;

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      search(searchQuery);
    } else {
      clearSearch();
    }
  }, [searchQuery, search, clearSearch]);

  const handleAddToCart = (medicine: any, quantity: number) => {
    const name = language === 'bn' ? medicine.nameBn : medicine.nameEn;
    alert(`Added ${quantity} ${name} to cart! (Mock)`);
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-navy mb-3">
            {selectedCategory === 'all'
              ? t('nav.categories')
              : categories.find((c) => c.id === selectedCategory)?.[language === 'bn' ? 'nameBn' : 'nameEn']}
          </h1>
          <p className="text-lg text-neutral-gray font-medium">
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
                {cat.icon} {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Loading state */}
        {(categoriesLoading || medicinesLoading) && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-neutral-gray">{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        )}

        {/* Products grid */}
        {!medicinesLoading && filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in">
            {filteredMedicines.map((medicine) => {
              const mockMedicine = {
                id: medicine.id,
                name: { bn: medicine.nameBn, en: medicine.nameEn },
                genericName: medicine.genericNameBn && medicine.genericNameEn ? { bn: medicine.genericNameBn, en: medicine.genericNameEn } : undefined,
                category: 'prescription' as const,
                subcategory: medicine.category?.nameEn || '',
                packSize: medicine.packSize,
                pricePerPack: Number(medicine.pricePerPack),
                pricePerUnit: Number(medicine.pricePerUnit),
                dosageForm: medicine.dosageForm,
                image: medicine.primaryImage || '/images/placeholder.jpg',
                inStock: medicine.stockQuantity > 0,
                requiresPrescription: medicine.requiresPrescription,
              };
              return <MedicineCard key={medicine.id} medicine={mockMedicine} onAddToCart={handleAddToCart} />;
            })}
          </div>
        ) : !medicinesLoading ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm fade-in">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-primary-navy mb-3">
              {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
            </h3>
            <p className="text-lg text-neutral-gray mb-6">
              {language === 'bn'
                ? 'অন্য ফিল্টার ব্যবহার করে দেখুন বা সব ক্যাটাগরি দেখুন'
                : 'Try different filters or browse all categories'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setFilterPrescription('all');
                setSearchQuery('');
              }}
              className="px-8 py-3 bg-primary-teal text-white rounded-lg font-semibold hover:bg-primary-mint transition-all hover:shadow-lg"
            >
              {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          </div>
        ) : null}
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
