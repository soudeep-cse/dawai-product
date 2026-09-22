import { useState, useCallback } from 'react';

interface Medicine {
  id: string;
  nameBn: string;
  nameEn: string;
  genericNameBn?: string;
  genericNameEn?: string;
  originalPricePerPack: number;
  pricePerPack: number;
  hasDiscount: boolean;
  discountValue?: number;
  stockQuantity: number;
  primaryImage?: string;
  category: {
    nameBn: string;
    nameEn: string;
  };
}

export function useMedicineSearch() {
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();

      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error during search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
