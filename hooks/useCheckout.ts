import { useState } from 'react';

interface OrderData {
  customerName: string;
  customerEmail?: string;
  deliveryZoneId: string;
  deliveryAddress: string;
  items: Array<{
    medicineId: string;
    quantity: number;
    pricePerUnit: number;
  }>;
  paymentMethod: 'COD' | 'BKASH' | 'NAGAD' | 'CARD';
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const createOrder = async (data: OrderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.id);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to create order');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while creating order';
      setError(errorMsg);
      console.error('Checkout error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    orderId,
    createOrder,
  };
}
