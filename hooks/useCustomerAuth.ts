import { useState } from 'react';

export function useCustomerOTP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sendOTP = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('OTP sent successfully. Valid for 10 minutes.');
        return { success: true, expiresIn: result.data.expiresIn };
      } else {
        setError(result.error || 'Failed to send OTP');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = 'Network error while sending OTP';
      setError(errorMsg);
      console.error('Send OTP error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setMessage(null);
  };

  return {
    sendOTP,
    loading,
    error,
    message,
    clearMessages,
  };
}

export function useCustomerAddresses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  const getAddresses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/customers/addresses', {
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setAddresses(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch addresses');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = 'Network error while fetching addresses';
      setError(errorMsg);
      console.error('Get addresses error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data: {
    label: string;
    address: string;
    zoneId: string;
    isDefault?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/customers/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setAddresses((prev) => [result.data, ...prev]);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to add address');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = 'Network error while adding address';
      setError(errorMsg);
      console.error('Add address error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    getAddresses,
    addAddress,
    addresses,
    loading,
    error,
  };
}

export function useCustomerOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const getOrders = async (status?: string, limit = 20, offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/customers/orders?limit=${limit}&offset=${offset}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setOrders(result.data.orders);
        setTotal(result.data.total);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch orders');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = 'Network error while fetching orders';
      setError(errorMsg);
      console.error('Get orders error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    getOrders,
    orders,
    total,
    loading,
    error,
  };
}

export function useCustomerPrescriptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const getPrescriptions = async (status?: string, limit = 20, offset = 0) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/customers/prescriptions?limit=${limit}&offset=${offset}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url, {
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data.prescriptions);
        setTotal(result.data.total);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch prescriptions');
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const errorMsg = 'Network error while fetching prescriptions';
      setError(errorMsg);
      console.error('Get prescriptions error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    getPrescriptions,
    prescriptions,
    total,
    loading,
    error,
  };
}
