'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
}

interface Subcategory {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
}

export default function MedicineAddV2Page() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    categoryId: '',
    subcategoryId: '',
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

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
      subcategoryId: '',
      nameEn: '',
      nameBn: '',
    }));
    setImagePreview('');

    try {
      const res = await fetch(`/api/admin/subcategories?categoryId=${category.id}`);
      const data = await res.json();
      if (data.success) {
        setSubcategories(data.subcategories);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData((prev) => ({
      ...prev,
      subcategoryId: subcategory.id,
    }));

    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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

  const shouldShowDosageForm = ['Tablets', 'Syrups', 'Injections', 'Inhalers', 'Insulin', 'Fever & Cold', 'Pain Relief', 'Gastric & Digestive'].includes(selectedSubcategory?.nameEn || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💊 Add New Medicine</h1>
          <p className="text-gray-600">Select category, then sub-category, then fill in medicine details</p>
        </div>

        {/* Step 1: Category Selection */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📂 Select Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className={`rounded-xl p-6 shadow-md hover:shadow-lg border-2 transition text-left ${
                  selectedCategory?.id === category.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white hover:border-teal-300'
                }`}
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-bold text-gray-900">{category.nameEn}</h3>
                <p className="text-sm text-gray-600 mt-2">{category.nameBn}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Subcategory Selection */}
        {selectedCategory && subcategories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📋 Select Sub-Category for {selectedCategory.nameEn}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className={`rounded-xl p-4 shadow-md hover:shadow-lg border-2 transition text-left ${
                    selectedSubcategory?.id === subcategory.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{subcategory.icon}</div>
                  <h3 className="text-base font-bold text-gray-900">{subcategory.nameEn}</h3>
                  <p className="text-xs text-gray-600 mt-1">{subcategory.nameBn}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Medicine Form (appears on same page) */}
        {selectedSubcategory && (
          <div ref={formRef} className="mb-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
              {/* Selected Path */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">
                  📂 <strong>{selectedCategory?.nameEn}</strong> → <strong>{selectedSubcategory?.nameEn}</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedCategory?.nameBn} → {selectedSubcategory?.nameBn}
                </p>
              </div>

              {/* Image Upload */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="e.g., Paracetamol 500mg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">নাম (Bengali) *</label>
                    <input
                      type="text"
                      value={formData.nameBn}
                      onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                      placeholder="e.g., প্যারাসিটামল ৫০০মিগ্রা"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="Brand/Manufacturer name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  {shouldShowDosageForm && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Form</label>
                      <select
                        value={formData.dosageForm}
                        onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option>Tablet</option>
                        <option>Capsule</option>
                        <option>Syrup</option>
                        <option>Injection</option>
                        <option>Inhaler</option>
                        <option>Powder</option>
                        <option>Cream</option>
                        <option>Oil</option>
                      </select>
                    </div>
                  )}
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing & Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (TK) *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (TK) *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Per Unit Price (TK) *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pack Size *</label>
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

              {/* Discount */}
              <section>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasDiscount}
                      onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
                      className="w-5 h-5 text-teal-600 rounded"
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

                  {selectedCategory?.nameEn === 'Prescription Medicine' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requiresPrescription}
                        onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <span className="font-medium text-gray-700">⚠️ Requires Prescription</span>
                    </label>
                  )}
                </div>
              </section>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {loading ? '⏳ Adding...' : '✅ Add ' + selectedSubcategory?.nameEn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setFormData({
                      nameEn: '',
                      nameBn: '',
                      categoryId: '',
                      subcategoryId: '',
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
                    setImagePreview('');
                  }}
                  className="px-6 py-4 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
