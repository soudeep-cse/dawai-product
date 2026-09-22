'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminMedicineForm from '@/components/AdminMedicineForm';
import { useAdminMedicines } from '@/hooks/useAdminMedicines';
import { useCategories } from '@/hooks/useCategories';

export default function AdminMedicinesPage() {
  const { language, t } = useLanguage();
  const { isAuthenticated, admin } = useAdminAuth();
  const { medicines, loading, fetchMedicines, deleteMedicine } = useAdminMedicines();
  const { categories } = useCategories();

  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedicines(selectedCategory);
    }
  }, [isAuthenticated, selectedCategory, fetchMedicines]);

  const handleDelete = async (id: string) => {
    const result = await deleteMedicine(id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="text-center">
          <p className="text-xl text-primary-navy mb-4">
            {language === 'bn' ? 'অনুগ্রহ করে লগইন করুন' : 'Please login to access this page'}
          </p>
          <a href="/admin/login" className="text-primary-teal underline">
            {language === 'bn' ? 'লগইন পৃষ্ঠায় যান' : 'Go to login'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-navy mb-2">
            {language === 'bn' ? 'ঔষধ ব্যবস্থাপনা' : 'Medicine Management'}
          </h1>
          <p className="text-neutral-gray">
            {language === 'bn'
              ? `স্বাগতম, ${admin?.name}`
              : `Welcome, ${admin?.name}`}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-primary-teal text-white'
                : 'bg-white text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            {language === 'bn' ? 'ঔষধ তালিকা' : 'Medicine List'}
          </button>
          <button
            onClick={() => {
              setView('create');
              setSelectedMedicine(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'create'
                ? 'bg-primary-teal text-white'
                : 'bg-white text-neutral-dark hover:bg-neutral-light'
            }`}
          >
            {language === 'bn' ? 'নতুন ঔষধ যোগ করুন' : 'Add New Medicine'}
          </button>
        </div>

        {/* Content */}
        {view === 'list' ? (
          <div>
            {/* Category Filter */}
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              >
                <option value="">{language === 'bn' ? 'সব বিভাগ' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-neutral-gray">
                  {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
                </p>
              </div>
            )}

            {/* Medicines Table */}
            {!loading && medicines.length > 0 && (
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                <table className="w-full">
                  <thead className="bg-neutral-light border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-primary-navy">
                        {language === 'bn' ? 'নাম' : 'Name'}
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-primary-navy">
                        {language === 'bn' ? 'মূল্য' : 'Price'}
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-primary-navy">
                        {language === 'bn' ? 'স্টক' : 'Stock'}
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-primary-navy">
                        {language === 'bn' ? 'ছাড়' : 'Discount'}
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-primary-navy">
                        {language === 'bn' ? 'অ্যাকশন' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((medicine) => (
                      <tr key={medicine.id} className="border-b hover:bg-neutral-light/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-primary-navy">
                              {language === 'bn' ? medicine.nameBn : medicine.nameEn}
                            </p>
                            <p className="text-sm text-neutral-gray">
                              {medicine.genericNameBn || medicine.genericNameEn || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-primary-teal">
                            ৳{medicine.pricePerPack.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              medicine.stockQuantity > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {medicine.stockQuantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {medicine.hasDiscount ? (
                            <span className="px-3 py-1 bg-primary-mint/20 text-primary-mint rounded-full text-sm font-medium">
                              {medicine.discountType === 'PERCENTAGE'
                                ? `${medicine.discountValue}%`
                                : `Tk ${medicine.discountValue}`}
                            </span>
                          ) : (
                            <span className="text-neutral-gray text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedMedicine(medicine.id);
                              setView('edit');
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                          >
                            {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(medicine.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                          >
                            {language === 'bn' ? 'মুছুন' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!loading && medicines.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <div className="text-7xl mb-4">📦</div>
                <p className="text-neutral-gray text-lg">
                  {language === 'bn' ? 'কোনো ঔষধ পাওয়া যায়নি' : 'No medicines found'}
                </p>
              </div>
            )}
          </div>
        ) : view === 'create' ? (
          <AdminMedicineForm
            onSuccess={() => {
              setView('list');
              fetchMedicines(selectedCategory);
            }}
          />
        ) : (
          <AdminMedicineForm
            medicineId={selectedMedicine || ''}
            onSuccess={() => {
              setView('list');
              fetchMedicines(selectedCategory);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
              <h3 className="text-lg font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'মুছতে নিশ্চিত?' : 'Confirm Delete?'}
              </h3>
              <p className="text-neutral-gray mb-6">
                {language === 'bn'
                  ? 'এই ঔষধটি মুছে ফেলা হবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।'
                  : 'This medicine will be deleted. This action cannot be undone.'}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-neutral-light text-primary-navy rounded-lg font-medium hover:bg-neutral-light/80"
                >
                  {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  {language === 'bn' ? 'মুছুন' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
