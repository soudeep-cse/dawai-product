'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminPrescriptions } from '@/hooks/usePrescriptions';

type PrescriptionStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION';

interface Prescription {
  id: string;
  customer?: {
    phone: string;
    name?: string;
  };
  status: string;
  aiExtractedData: any;
  items: any[];
  pharmacistNotes?: string;
  createdAt: string;
}

export default function AdminPrescriptionsPage() {
  const { language } = useLanguage();
  const { getPrescriptionsByStatus, reviewPrescription, loading, prescriptions } =
    useAdminPrescriptions();

  const [selectedStatus, setSelectedStatus] = useState<PrescriptionStatus>('PENDING_REVIEW');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [notes, setNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION'>(
    'APPROVED'
  );
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const labels = {
    en: {
      title: 'Prescription Review',
      status: 'Status',
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected',
      clarification: 'Needs Clarification',
      customer: 'Customer',
      extracted: 'AI Extracted Data',
      medicines: 'Medicines',
      notes: 'Pharmacist Notes',
      action: 'Action',
      review: 'Review',
      approve: 'Approve',
      reject: 'Reject',
      needsClarification: 'Needs Clarification',
      reviewing: 'Reviewing...',
      success: 'Prescription reviewed successfully',
      error: 'Error reviewing prescription',
      noData: 'No extracted data found',
      medicine: 'Medicine',
      dosage: 'Dosage',
      frequency: 'Frequency',
    },
    bn: {
      title: 'প্রেসক্রিপশন পর্যালোচনা',
      status: 'স্ট্যাটাস',
      pending: 'পর্যালোচনার অপেক্ষায়',
      approved: 'অনুমোদিত',
      rejected: 'প্রত্যাখ্যাত',
      clarification: 'স্পষ্টতা প্রয়োজন',
      customer: 'গ্রাহক',
      extracted: 'AI বের করা ডেটা',
      medicines: 'ওষুধ',
      notes: 'ফার্মাসিস্টের নোট',
      action: 'অ্যাকশন',
      review: 'পর্যালোচনা করুন',
      approve: 'অনুমোদন করুন',
      reject: 'প্রত্যাখ্যান করুন',
      needsClarification: 'স্পষ্টতা প্রয়োজন',
      reviewing: 'পর্যালোচনা করা হচ্ছে...',
      success: 'প্রেসক্রিপশন সফলভাবে পর্যালোচনা করা হয়েছে',
      error: 'প্রেসক্রিপশন পর্যালোচনা করতে ত্রুটি হয়েছে',
      noData: 'কোন বের করা ডেটা খুঁজে পাওয়া যায়নি',
      medicine: 'ওষুধ',
      dosage: 'ডোজ',
      frequency: 'ফ্রিকোয়েন্সি',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  useEffect(() => {
    getPrescriptionsByStatus(selectedStatus);
  }, [selectedStatus]);

  const handleReview = async () => {
    if (!selectedPrescription) return;

    setReviewing(true);
    setMessage(null);

    try {
      const result = await reviewPrescription({
        prescriptionId: selectedPrescription.id,
        status: reviewStatus,
        pharmacistId: 'admin-123', // Replace with actual admin ID from auth
        notes,
        items: selectedPrescription.items.map((item: any) => ({
          itemId: item.id,
          medicineId: item.medicineId,
          dosage: item.dosage,
          frequency: item.frequency,
          isVerified: true,
        })),
      });

      if (result.success) {
        setMessage({ type: 'success', text: t.success });
        setSelectedPrescription(null);
        setNotes('');
        setReviewStatus('APPROVED');

        // Refresh list
        getPrescriptionsByStatus(selectedStatus);

        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: t.error });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || t.error });
    } finally {
      setReviewing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'NEEDS_CLARIFICATION':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.title}</h1>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 font-medium border-b-2 transition ${
                  selectedStatus === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {status === 'PENDING_REVIEW' && t.pending}
                {status === 'APPROVED' && t.approved}
                {status === 'REJECTED' && t.rejected}
                {status === 'NEEDS_CLARIFICATION' && t.clarification}
              </button>
            )
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prescriptions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  {language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {language === 'bn' ? 'কোন প্রেসক্রিপশন পাওয়া যায়নি' : 'No prescriptions found'}
                </div>
              ) : (
                <div className="divide-y">
                  {prescriptions.map((prescription: Prescription) => (
                    <div
                      key={prescription.id}
                      onClick={() => setSelectedPrescription(prescription)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedPrescription?.id === prescription.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {prescription.customer?.phone}
                          </p>
                          {prescription.customer?.name && (
                            <p className="text-sm text-gray-600">{prescription.customer.name}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(prescription.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Review Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            {selectedPrescription ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t.review}</h2>

                {/* Customer Info */}
                <div className="mb-6 pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">{t.customer}</p>
                  <p className="font-medium text-gray-900">
                    {selectedPrescription.customer?.phone}
                  </p>
                  {selectedPrescription.customer?.name && (
                    <p className="text-sm text-gray-600">{selectedPrescription.customer.name}</p>
                  )}
                </div>

                {/* Extracted Data */}
                {selectedPrescription.aiExtractedData?.medicines && (
                  <div className="mb-6 pb-4 border-b">
                    <p className="text-sm font-medium text-gray-900 mb-3">{t.medicines}</p>
                    <div className="space-y-2">
                      {selectedPrescription.aiExtractedData.medicines.map(
                        (medicine: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium text-gray-900">{medicine.medicineName}</p>
                            <p className="text-xs text-gray-600">
                              {t.dosage}: {medicine.dosage}
                            </p>
                            <p className="text-xs text-gray-600">
                              {t.frequency}: {medicine.frequency}
                            </p>
                            {medicine.duration && (
                              <p className="text-xs text-gray-600">
                                {language === 'bn' ? 'সময়কাল:' : 'Duration:'} {medicine.duration}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Existing Notes */}
                {selectedPrescription.pharmacistNotes && (
                  <div className="mb-6 pb-4 border-b">
                    <p className="text-sm font-medium text-gray-900 mb-2">{t.notes}</p>
                    <p className="text-sm text-gray-600">{selectedPrescription.pharmacistNotes}</p>
                  </div>
                )}

                {/* Review Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.status}
                    </label>
                    <select
                      value={reviewStatus}
                      onChange={(e) =>
                        setReviewStatus(
                          e.target.value as 'APPROVED' | 'REJECTED' | 'NEEDS_CLARIFICATION'
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="APPROVED">{t.approve}</option>
                      <option value="REJECTED">{t.reject}</option>
                      <option value="NEEDS_CLARIFICATION">{t.needsClarification}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {t.notes}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-3 rounded text-sm ${
                        message.type === 'success'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <button
                    onClick={handleReview}
                    disabled={reviewing || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
                  >
                    {reviewing || loading ? t.reviewing : t.review}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {language === 'bn'
                  ? 'পর্যালোচনা করার জন্য একটি প্রেসক্রিপশন নির্বাচন করুন'
                  : 'Select a prescription to review'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
