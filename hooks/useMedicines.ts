import { useState, useEffect } from 'react';

interface Medicine {
  id: string;
  nameBn: string;
  nameEn: string;
  genericNameBn?: string;
  genericNameEn?: string;
  originalPricePerPack: number;
  pricePerPack: number;
  pricePerUnit: number;
  packSize: number;
  dosageForm: string;
  hasDiscount: boolean;
  discountType?: string;
  discountValue?: number;
  stockQuantity: number;
  primaryImage?: string;
  requiresPrescription: boolean;
  category: {
    id: string;
    nameBn: string;
    nameEn: string;
  };
}

interface UseMedicinesOptions {
  categoryId?: string;
  subcategoryId?: string;
  requiresPrescription?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
}

interface MedicineResponse {
  medicines: Medicine[];
  total: number;
  pages: number;
  currentPage: number;
}

export function useMedicines(options: UseMedicinesOptions = {}) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pagination, setPagination] = useState({
    page: options.page || 1,
    limit: options.limit || 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (options.categoryId) params.append('categoryId', options.categoryId);
        if (options.subcategoryId) params.append('subcategoryId', options.subcategoryId);
        if (options.requiresPrescription !== undefined)
          params.append('requiresPrescription', String(options.requiresPrescription));
        if (options.featured !== undefined) params.append('featured', String(options.featured));
        params.append('page', String(options.page || 1));
        params.append('limit', String(options.limit || 20));

        const response = await fetch(`/api/medicines?${params}`);
        const result = await response.json();

        if (result.success) {
          setMedicines(result.data);
          setPagination({
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            pages: result.pagination.pages,
          });
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch medicines');
        }
      } catch (err) {
        setError('Network error while fetching medicines');
        console.error('Medicines fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [options.categoryId, options.subcategoryId, options.requiresPrescription, options.featured, options.page, options.limit]);

  return { medicines, pagination, loading, error };
}
