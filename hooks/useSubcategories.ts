import { useState, useEffect } from 'react';

interface Subcategory {
  id: string;
  categoryId: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  icon: string;
}

export function useSubcategories(categoryId: string | undefined) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/subcategories?categoryId=${categoryId}`);
        const result = await response.json();

        if (result.success) {
          setSubcategories(result.data);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error('Subcategories fetch error:', err);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  return { subcategories, loading };
}
