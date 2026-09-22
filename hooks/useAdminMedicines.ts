import { useState, useCallback } from 'react';

interface Medicine {
  id: string;
  nameBn: string;
  nameEn: string;
  genericNameBn?: string;
  genericNameEn?: string;
  originalPricePerPack: number;
  pricePerPack: number;
  packSize: number;
  hasDiscount: boolean;
  discountType?: string;
  discountValue?: number;
  stockQuantity: number;
  requiresPrescription: boolean;
  categoryId: string;
  isActive: boolean;
}

interface CreateMedicineData {
  nameBn: string;
  nameEn: string;
  genericNameBn?: string;
  genericNameEn?: string;
  categoryId: string;
  packSize: number;
  originalPricePerPack: number;
  pricePerPack: number;
  pricePerUnit: number;
  [key: string]: any;
}

export function useAdminMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch medicines for admin
  const fetchMedicines = useCallback(async (categoryId?: string, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      params.append('page', String(page));
      params.append('limit', '50');

      const response = await fetch(`/api/admin/medicines?${params}`, {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setMedicines(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch medicines');
      }
    } catch (err) {
      setError('Network error while fetching medicines');
      console.error('Fetch medicines error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create medicine
  const createMedicine = useCallback(async (data: CreateMedicineData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setMedicines([result.data, ...medicines]);
        setError(null);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create medicine');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while creating medicine';
      setError(errorMsg);
      console.error('Create medicine error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [medicines]);

  // Update medicine
  const updateMedicine = useCallback(async (id: string, data: Partial<CreateMedicineData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/medicines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setMedicines(medicines.map(m => m.id === id ? result.data : m));
        setError(null);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to update medicine');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while updating medicine';
      setError(errorMsg);
      console.error('Update medicine error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [medicines]);

  // Delete medicine
  const deleteMedicine = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/medicines/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setMedicines(medicines.filter(m => m.id !== id));
        setError(null);
        return { success: true };
      } else {
        setError(result.error || 'Failed to delete medicine');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while deleting medicine';
      setError(errorMsg);
      console.error('Delete medicine error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [medicines]);

  // Upload image
  const uploadImage = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setError(null);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to upload image');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while uploading image';
      setError(errorMsg);
      console.error('Upload image error:', err);
      return { success: false, error: errorMsg };
    }
  }, []);

  return {
    medicines,
    loading,
    error,
    fetchMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    uploadImage,
  };
}
