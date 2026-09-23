import { useState, useEffect } from 'react';

interface DeliveryZone {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  fee: number;
  estimatedTimeBn: string;
  estimatedTimeEn: string;
  isActive: boolean;
}

export function useDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/delivery-zones');
        const result = await response.json();

        if (result.success) {
          setZones(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch delivery zones');
        }
      } catch (err) {
        setError('Network error while fetching delivery zones');
        console.error('Delivery zones fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  return { zones, loading, error };
}
