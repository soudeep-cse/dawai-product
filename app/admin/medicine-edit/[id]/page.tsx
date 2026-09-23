'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';

export default function MedicineEditPage() {
  const params = useParams();
  const router = useRouter();
  const { categories } = useCategories();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    genericNameBn: '',
    genericNameEn: '',
    categoryId: '',
    subcategoryId: '',
    packSize: '',
    originalPricePerPack: '',
    pricePerPack: '',
    pricePerUnit: '',
    stockQuantity: '',
    requiresPrescription: false,
    dosageForm: '',
    strength: '',
    manufacturer: '',
    descriptionBn: '',
    descriptionEn: '',
    hasDiscount: false,
    discountType: 'PERCENTAGE',
    discountValue: '',
    primaryImage: '',
  });

  const { subcategories } = useSubcategories(formData.categoryId || undefined);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await fetch(`/api/admin/medicines/${params.id}`);
        const result = await res.json();

        if (result.success) {
          const m = result.data;
          setFormData({
            nameBn: m.nameBn || '',
            nameEn: m.nameEn || '',
            genericNameBn: m.genericNameBn || '',
            genericNameEn: m.genericNameEn || '',
            categoryId: m.categoryId || '',
            subcategoryId: m.subcategoryId || '',
            packSize: String(m.packSize ?? ''),
            originalPricePerPack: String(m.originalPricePerPack ?? ''),
            pricePerPack: String(m.pricePerPack ?? ''),
            pricePerUnit: String(m.pricePerUnit ?? ''),
            stockQuantity: String(m.stockQuantity ?? ''),
            requiresPrescription: !!m.requiresPrescription,
            dosageForm: m.dosageForm || '',
            strength: m.strength || '',
            manufacturer: m.manufacturer || '',
            descriptionBn: m.descriptionBn || '',
            descriptionEn: m.descriptionEn || '',
            hasDiscount: !!m.hasDiscount,
            discountType: m.discountType || 'PERCENTAGE',
            discountValue: m.discountValue ? String(m.discountValue) : '',
            primaryImage: m.primaryImage || '',
          });
          setImagePreview(m.primaryImage || '');
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Fetch medicine error:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchMedicine();
  }, [params.id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/medicines/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subcategoryId: formData.subcategoryId || undefined,
          packSize: parseInt(formData.packSize),
          originalPricePerPack: parseFloat(formData.originalPricePerPack),
          pricePerPack: parseFloat(formData.pricePerPack),
          pricePerUnit: parseFloat(formData.pricePerUnit),
          stockQuantity: parseInt(formData.stockQuantity),
          discountValue: formData.hasDiscount && formData.discountValue ? parseFloat(formData.discountValue) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/medicine-list');
      } else {
        alert(data.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Update medicine error:', error);
      alert('Failed to update medicine');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading medicine...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">Medicine not found</p>
          <button
            onClick={() => router.push('/admin/medicine-list')}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/admin/medicine-list')}
          className="mb-4 text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Back to Inventory
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">✏️ Edit Medicine</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">💊</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              {uploadingImage && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input
                type="text"
                required
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Bangla) *</label>
              <input
                type="text"
                required
                value={formData.nameBn}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name (English)</label>
              <input
                type="text"
                value={formData.genericNameEn}
                onChange={(e) => setFormData({ ...formData, genericNameEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name (Bangla)</label>
              <input
                type="text"
                value={formData.genericNameBn}
                onChange={(e) => setFormData({ ...formData, genericNameBn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category / Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                value={formData.subcategoryId}
                onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!formData.categoryId}
              >
                <option value="">None</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dosage form / strength / manufacturer */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form *</label>
              <input
                type="text"
                required
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
              <input
                type="text"
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size (units/strip) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price/Pack *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.originalPricePerPack}
                onChange={(e) => setFormData({ ...formData, originalPricePerPack: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price/Pack *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.pricePerPack}
                onChange={(e) => setFormData({ ...formData, pricePerPack: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price/Unit *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hasDiscount}
                onChange={(e) => setFormData({ ...formData, hasDiscount: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Has Discount</span>
            </label>
            {formData.hasDiscount && (
              <>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Discount value"
                  step="0.01"
                  min="0"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </>
            )}
          </div>

          {/* Stock / Prescription */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <label className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                checked={formData.requiresPrescription}
                onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Requires Prescription</span>
            </label>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                rows={3}
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Bangla)</label>
              <textarea
                rows={3}
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3 rounded-lg transition"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/medicine-list')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
