'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Medicine {
  id: string;
  nameEn: string;
  nameBn: string;
  category: { nameEn: string; icon: string };
  pricePerPack: number;
  originalPricePerPack: number;
  stockQuantity: number;
  primaryImage: string;
  dosageForm: string;
  hasDiscount: boolean;
  discountValue?: number;
}

export default function MedicineListPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/admin/medicines');
      const data = await res.json();
      if (data.success) {
        setMedicines(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone from here.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/medicines/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMedicines((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(data.error || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Medicine Inventory</h1>
            <p className="text-gray-600">Total medicines: {medicines.length}</p>
          </div>
          <button
            onClick={() => router.push('/admin/medicine-add')}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
          >
            ➕ Add Medicine
          </button>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-gray-600">Loading medicines...</p>
            </div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-2xl font-semibold text-gray-600 mb-4">No medicines added yet</p>
            <p className="text-gray-500 mb-6">Start by adding your first medicine!</p>
            <button
              onClick={() => router.push('/admin/medicine-add')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              ➕ Add First Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <div key={medicine.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                {/* Image */}
                <div className="aspect-square bg-gray-200 overflow-hidden flex items-center justify-center">
                  {medicine.primaryImage ? (
                    <img
                      src={medicine.primaryImage}
                      alt={medicine.nameEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">💊</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 mb-2 text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                    <span>{medicine.category.icon}</span>
                    <span>{medicine.category.nameEn}</span>
                  </div>

                  {/* Names */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{medicine.nameEn}</h3>
                  <p className="text-sm text-gray-600 mb-3">{medicine.nameBn}</p>

                  {/* Dosage */}
                  <p className="text-xs text-gray-500 mb-4">📊 {medicine.dosageForm}</p>

                  {/* Pricing */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-teal-600">৳{medicine.pricePerPack}</span>
                      {medicine.hasDiscount && (
                        <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                          -{medicine.discountValue}%
                        </span>
                      )}
                    </div>
                    {medicine.originalPricePerPack > medicine.pricePerPack && (
                      <p className="text-sm text-gray-500 line-through">৳{medicine.originalPricePerPack}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Stock:</span>
                      <span className={`font-bold ${medicine.stockQuantity > 10 ? 'text-green-600' : 'text-red-600'}`}>
                        {medicine.stockQuantity} units
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${medicine.stockQuantity > 10 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((medicine.stockQuantity / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/admin/medicine-edit/${medicine.id}`)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id, medicine.nameEn)}
                      disabled={deletingId === medicine.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                      {deletingId === medicine.id ? '⏳ Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
