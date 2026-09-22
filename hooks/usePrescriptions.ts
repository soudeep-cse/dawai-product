import { useState } from 'react';

export interface PrescriptionUploadData {
  customerPhone: string;
  imageBase64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

export function usePrescriptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const uploadPrescription = async (data: PrescriptionUploadData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to upload prescription');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while uploading prescription';
      setError(errorMsg);
      console.error('Upload error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptions = async (customerPhone: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/prescriptions?customerPhone=${encodeURIComponent(customerPhone)}`
      );

      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch prescriptions');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while fetching prescriptions';
      setError(errorMsg);
      console.error('Fetch error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptionById = async (prescriptionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/prescriptions?prescriptionId=${encodeURIComponent(prescriptionId)}`
      );

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch prescription');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while fetching prescription';
      setError(errorMsg);
      console.error('Fetch error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    prescriptions,
    uploadPrescription,
    getPrescriptions,
    getPrescriptionById,
  };
}

export function useAdminPrescriptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const getPrescriptionsByStatus = async (
    status: 'PENDING_AI' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION'
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/admin/prescriptions?status=${encodeURIComponent(status)}`
      );

      const result = await response.json();

      if (result.success) {
        setPrescriptions(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to fetch prescriptions');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while fetching prescriptions';
      setError(errorMsg);
      console.error('Fetch error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const reviewPrescription = async (data: {
    prescriptionId: string;
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION';
    pharmacistId: string;
    notes?: string;
    items?: Array<{
      itemId: string;
      medicineId?: string;
      dosage: string;
      frequency: string;
      isVerified: boolean;
    }>;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/prescriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Failed to review prescription');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while reviewing prescription';
      setError(errorMsg);
      console.error('Review error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    prescriptions,
    getPrescriptionsByStatus,
    reviewPrescription,
  };
}
