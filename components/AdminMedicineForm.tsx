'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminMedicines } from '@/hooks/useAdminMedicines';
import { useCategories } from '@/hooks/useCategories';

interface MedicineFormProps {
  medicineId?: string;
  onSuccess?: () => void;
}

export default function AdminMedicineForm({ medicineId, onSuccess }: MedicineFormProps) {
  const { language, t } = useLanguage();
  const { createMedicine, updateMedicine, uploadImage, loading } = useAdminMedicines();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    genericNameBn: '',
    genericNameEn: '',
    categoryId: '',
    packSize: 1,
    originalPricePerPack: 0,
    pricePerPack: 0,
    pricePerUnit: 0,
    hasDiscount: false,
    discountType: 'PERCENTAGE',
    discountValue: 0,
    discountStartDate: '',
    discountEndDate: '',
    stockQuantity: 0,
    requiresPrescription: false,
    dosageForm: '',
    strength: '',
    manufacturer: '',
    descriptionBn: '',
    descriptionEn: '',
    usageBn: '',
    usageEn: '',
    primaryImage: '',
    featured: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [discountPreview, setDiscountPreview] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate discount preview
  useEffect(() => {
    if (!formData.hasDiscount) {
      setDiscountPreview(0);
      return;
    }

    let discounted = formData.originalPricePerPack;
    if (formData.discountType === 'PERCENTAGE') {
      discounted = formData.originalPricePerPack * (1 - formData.discountValue / 100);
    } else if (formData.discountType === 'FIXED_AMOUNT') {
      discounted = formData.originalPricePerPack - formData.discountValue;
    }
    setDiscountPreview(Math.max(0, discounted));
  }, [formData.hasDiscount, formData.originalPricePerPack, formData.discountType, formData.discountValue]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    const result = await uploadImage(selectedImage);
    if (result.success) {
      setFormData({ ...formData, primaryImage: result.data.url });
      setSelectedImage(null);
    } else {
      setError(result.error || 'Failed to upload image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedImage && !formData.primaryImage) {
      setError('Please upload the image first');
      return;
    }

    const submitData = {
      ...formData,
      packSize: Number(formData.packSize),
      originalPricePerPack: Number(formData.originalPricePerPack),
      pricePerPack: Number(formData.pricePerPack),
      pricePerUnit: Number(formData.pricePerUnit),
      stockQuantity: Number(formData.stockQuantity),
      discountValue: formData.hasDiscount ? Number(formData.discountValue) : 0,
    };

    const result = medicineId
      ? await updateMedicine(medicineId, submitData)
      : await createMedicine(submitData as any);

    if (result.success) {
      setSuccess(medicineId ? 'Medicine updated successfully!' : 'Medicine created successfully!');
      if (!medicineId) {
        setFormData({
          nameBn: '',
          nameEn: '',
          genericNameBn: '',
          genericNameEn: '',
          categoryId: '',
          packSize: 1,
          originalPricePerPack: 0,
          pricePerPack: 0,
          pricePerUnit: 0,
          hasDiscount: false,
          discountType: 'PERCENTAGE',
          discountValue: 0,
          discountStartDate: '',
          discountEndDate: '',
          stockQuantity: 0,
          requiresPrescription: false,
          dosageForm: '',
          strength: '',
          manufacturer: '',
          descriptionBn: '',
          descriptionEn: '',
          usageBn: '',
          usageEn: '',
          primaryImage: '',
          featured: false,
        });
        setImagePreview('');
      }
      onSuccess?.();
    } else {
      setError(result.error || 'Failed to save medicine');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
      {/* Alerts */}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>}

      {/* Section 1: Basic Info */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'মৌলিক তথ্য' : 'Basic Information'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={language === 'bn' ? 'ঔষধ নাম (বাংলা)' : 'Medicine Name (Bengali)'}
            value={formData.nameBn}
            onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            required
          />
          <input
            type="text"
            placeholder="Medicine Name (English)"
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            required
          />
          <input
            type="text"
            placeholder={language === 'bn' ? 'সাধারণ নাম (বাংলা)' : 'Generic Name (Bengali)'}
            value={formData.genericNameBn}
            onChange={(e) => setFormData({ ...formData, genericNameBn: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
          <input
            type="text"
            placeholder="Generic Name (English)"
            value={formData.genericNameEn}
            onChange={(e) => setFormData({ ...formData, genericNameEn: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
        </div>
      </div>

      {/* Section 2: Category & Dosage */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'বিভাগ ও ফর্ম' : 'Category & Form'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Dosage Form (e.g., Tablet, Capsule)"
            value={formData.dosageForm}
            onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            required
          />
          <input
            type="text"
            placeholder="Strength (e.g., 500mg)"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
          <input
            type="text"
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
          />
        </div>
      </div>

      {/* Section 3: Pricing & Stock */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'মূল্য ও স্টক' : 'Pricing & Stock'}
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Pack Size</label>
            <input
              type="number"
              min="1"
              value={formData.packSize}
              onChange={(e) => setFormData({ ...formData, packSize: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Original Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.originalPricePerPack}
              onChange={(e) => setFormData({ ...formData, originalPricePerPack: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Selling Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerPack}
              onChange={(e) => setFormData({ ...formData, pricePerPack: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price Per Unit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 4: Discount System */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'ছাড় ব্যবস্থা' : 'Discount System'}
        </h2>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.hasDiscount}
            onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
            className="mr-2 w-4 h-4"
          />
          <span className="font-medium">Enable Discount</span>
        </label>

        {formData.hasDiscount && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED_AMOUNT">Fixed Amount (Tk)</option>
              <option value="BUY_X_GET_Y">Buy X Get Y</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
            <div className="px-4 py-2 bg-primary-mint/20 rounded-lg">
              <p className="text-sm font-medium">Final Price: Tk {discountPreview.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Image Upload */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'ছবি' : 'Image'}
        </h2>
        <input type="file" accept="image/*" onChange={handleImageSelect} className="mb-4" />
        {selectedImage && (
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={loading}
            className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-mint disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        )}
        {(imagePreview || formData.primaryImage) && (
          <div className="mt-4">
            <img
              src={imagePreview || formData.primaryImage}
              alt="Medicine"
              className="max-w-xs h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Section 6: Descriptions */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'বিবরণ' : 'Descriptions'}
        </h2>
        <textarea
          placeholder={language === 'bn' ? 'বিবরণ (বাংলা)' : 'Description (Bengali)'}
          value={formData.descriptionBn}
          onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal mb-4"
        />
        <textarea
          placeholder="Description (English)"
          value={formData.descriptionEn}
          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
        />
      </div>

      {/* Section 7: Usage & Side Effects */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'ব্যবহার ও পার্শ্ব প্রতিক্রিয়া' : 'Usage & Side Effects'}
        </h2>
        <textarea
          placeholder={language === 'bn' ? 'ব্যবহার (বাংলা)' : 'Usage (Bengali)'}
          value={formData.usageBn}
          onChange={(e) => setFormData({ ...formData, usageBn: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal mb-4"
        />
        <textarea
          placeholder="Usage (English)"
          value={formData.usageEn}
          onChange={(e) => setFormData({ ...formData, usageEn: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
        />
      </div>

      {/* Section 8: Flags */}
      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-primary-navy">
          {language === 'bn' ? 'অপশন' : 'Options'}
        </h2>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.requiresPrescription}
            onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
            className="mr-2 w-4 h-4"
          />
          <span className="font-medium">Requires Prescription</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="mr-2 w-4 h-4"
          />
          <span className="font-medium">Featured Medicine</span>
        </label>
      </div>

      {/* Section 9: Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary-teal text-white font-semibold rounded-lg hover:bg-primary-mint disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : medicineId ? 'Update Medicine' : 'Create Medicine'}
        </button>
      </div>
    </form>
  );
}
