'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCT_TYPES, getProductType } from '@/lib/productTypes';

interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
}

export default function MedicineAddPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState('');

  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    categoryId: '',
    pricePerPack: '',
    originalPricePerPack: '',
    pricePerUnit: '',
    packSize: '1',
    stockQuantity: '0',
    dosageForm: 'Tablet',
    manufacturer: '',
    description: '',
    hasDiscount: false,
    discountType: 'PERCENTAGE',
    discountValue: '',
    requiresPrescription: false,
    primaryImage: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleProductTypeChange = (productTypeId: string) => {
    setSelectedProductType(productTypeId);
    const productType = getProductType(productTypeId);

    if (productType) {
      const category = categories.find((c) => c.nameEn === productType.categoryName);
      setFormData((prev) => ({
        ...prev,
        categoryId: category?.id || '',
        dosageForm: productType.requiresDosageForm ? prev.dosageForm : 'Other',
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetch('/api/admin/medicines/upload-image', {
        method: 'POST',
        body: formDataObj,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, primaryImage: data.url }));
      }
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      const formDataObj = new FormData();
      formDataObj.append('file', file);

      setUploadingImage(true);
      fetch('/api/admin/medicines/upload-image', {
        method: 'POST',
        body: formDataObj,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFormData((prev) => ({ ...prev, primaryImage: data.url }));
          }
        })
        .finally(() => setUploadingImage(false));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerPack: parseFloat(formData.pricePerPack),
          originalPricePerPack: parseFloat(formData.originalPricePerPack),
          pricePerUnit: parseFloat(formData.pricePerUnit),
          packSize: parseInt(formData.packSize),
          stockQuantity: parseInt(formData.stockQuantity),
          discountValue: formData.discountValue ? parseFloat(formData.discountValue) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Medicine added successfully!');
        router.push('/admin/medicine-list');
      } else {
        alert('❌ Error: ' + (data.error || 'Failed to add medicine'));
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('❌ Error: ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  const selectedProductTypeObj = selectedProductType ? getProductType(selectedProductType) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💊 Add New Medicine</h1>
          <p className="text-gray-600">Select product type, add details and pricing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Product Type Selection */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Product Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {PRODUCT_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => handleProductTypeChange(pt.id)}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    selectedProductType === pt.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{pt.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{pt.nameEn}</div>
                  <div className="text-xs text-gray-500">{pt.nameBn}</div>
                </button>
              ))}
            </div>
          </section>

          {selectedProductTypeObj && (
            <>
              {/* Image Upload Section */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Product Image</h2>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDragDrop}
                  className="border-2 border-dashed border-teal-300 rounded-xl p-8 text-center bg-teal-50 hover:bg-teal-100 transition cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded-lg" />
                      {uploadingImage && <p className="text-sm text-teal-600">Uploading...</p>}
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">Drag image here or click</p>
                      <p className="text-sm text-gray-500">Support: JPG, PNG (max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="block mt-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-input')?.click()}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Choose Image
                    </button>
                  </label>
                </div>
              </section>

              {/* Basic Info */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">ℹ️ Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder={selectedProductTypeObj.nameEn}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">নাম (Bengali)</label>
                    <input
                      type="text"
                      value={formData.nameBn}
                      onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                      placeholder={selectedProductTypeObj.nameBn}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={selectedProductTypeObj.categoryName}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                    <input
                      type="text"
                      value={selectedProductTypeObj.subcategoryName}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>

                {selectedProductTypeObj.requiresDosageForm && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Form</label>
                    <select
                      value={formData.dosageForm}
                      onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Injection</option>
                      <option>Liquid</option>
                      <option>Cream</option>
                      <option>Oil</option>
                      <option>Inhaler</option>
                      <option>Powder</option>
                    </select>
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Brand/Manufacturer name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing & Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (TK)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPricePerPack}
                      onChange={(e) => setFormData({ ...formData, originalPricePerPack: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (TK)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerPack}
                      onChange={(e) => setFormData({ ...formData, pricePerPack: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Price (TK)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pack Size</label>
                    <input
                      type="number"
                      value={formData.packSize}
                      onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed Amount (TK)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Checkboxes */}
              <section>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasDiscount}
                      onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-2"
                    />
                    <span className="font-medium text-gray-700">Apply Discount</span>
                  </label>
                  {formData.hasDiscount && (
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Discount value"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  )}

                  {selectedProductTypeObj.categoryName === 'Prescription Medicine' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requiresPrescription}
                        onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                        className="w-5 h-5 text-red-600 rounded focus:ring-2"
                      />
                      <span className="font-medium text-gray-700">⚠️ Requires Prescription</span>
                    </label>
                  )}
                </div>
              </section>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {loading ? '⏳ Adding...' : '✅ Add ' + selectedProductTypeObj.nameEn}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-4 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {!selectedProductType && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">👆 Select a product type above to continue</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
