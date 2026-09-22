'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrescriptions } from '@/hooks/usePrescriptions';

interface UploadedFile {
  name: string;
  size: number;
  preview: string;
}

export default function PrescriptionsPage() {
  const { language } = useLanguage();
  const { uploadPrescription, loading, error: hookError } = usePrescriptions();

  const [customerPhone, setCustomerPhone] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = {
    en: {
      title: 'Upload Prescription',
      subtitle: 'Upload your prescription image for AI analysis and pharmacist review',
      phone: 'Phone Number',
      selectFile: 'Select Prescription Image',
      dragDrop: 'Drag and drop your prescription image here',
      upload: 'Upload Prescription',
      uploading: 'Uploading...',
      success: 'Prescription uploaded successfully!',
      error: 'Error uploading prescription',
      invalidFile: 'Please select a valid image file',
      maxSize: 'File size must be less than 10MB',
      formats: 'Accepted formats: JPEG, PNG, GIF, WebP',
    },
    bn: {
      title: 'প্রেসক্রিপশন আপলোড করুন',
      subtitle: 'AI বিশ্লেষণ এবং ফার্মাসিস্ট পর্যালোচনার জন্য আপনার প্রেসক্রিপশন ছবি আপলোড করুন',
      phone: 'ফোন নম্বর',
      selectFile: 'প্রেসক্রিপশন ছবি নির্বাচন করুন',
      dragDrop: 'আপনার প্রেসক্রিপশন ছবি এখানে টেনে আনুন',
      upload: 'প্রেসক্রিপশন আপলোড করুন',
      uploading: 'আপলোড হচ্ছে...',
      success: 'প্রেসক্রিপশন সফলভাবে আপলোড হয়েছে!',
      error: 'প্রেসক্রিপশন আপলোড করতে ত্রুটি হয়েছে',
      invalidFile: 'অনুগ্রহ করে একটি বৈধ ইমেজ ফাইল নির্বাচন করুন',
      maxSize: 'ফাইল আকার 10MB এর চেয়ে কম হতে হবে',
      formats: 'গৃহীত ফর্ম্যাট: JPEG, PNG, GIF, WebP',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError(t.invalidFile);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError(t.maxSize);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFile({
        name: file.name,
        size: file.size,
        preview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone.trim()) {
      setError(language === 'bn' ? 'ফোন নম্বর প্রবেশ করুন' : 'Please enter phone number');
      return;
    }

    if (!uploadedFile) {
      setError(t.invalidFile);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await uploadPrescription({
        customerPhone,
        imageBase64: uploadedFile.preview.split(',')[1],
        mediaType: 'image/jpeg',
      });

      if (result.success) {
        setSuccess(true);
        setPrescriptionId(result.data.id);
        setCustomerPhone('');
        setUploadedFile(null);

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{t.success}</p>
            {prescriptionId && (
              <p className="text-green-700 text-sm mt-2">
                {language === 'bn' ? 'প্রেসক্রিপশন আইডি:' : 'Prescription ID:'} {prescriptionId}
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.phone}
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="01712345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.selectFile}
            </label>

            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-700 font-medium mb-2">{t.dragDrop}</p>
                <p className="text-sm text-gray-500">{t.formats}</p>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={uploadedFile.preview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      {language === 'bn' ? 'সরান' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {hookError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{hookError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || loading || !uploadedFile || !customerPhone.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
          >
            {uploading || loading ? t.uploading : t.upload}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">
            {language === 'bn' ? 'আপনার ছবি কীভাবে পাঠাবেন:' : 'How to upload:'}
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • {language === 'bn' ? 'প্রেসক্রিপশনের একটি স্পষ্ট ছবি নিন' : 'Take a clear photo of your prescription'}
            </li>
            <li>
              • {language === 'bn' ? 'নিশ্চিত করুন যে সমস্ত পাঠ দৃশ্যমান' : 'Ensure all text is clearly visible'}
            </li>
            <li>
              • {language === 'bn' ? 'ছবি JPG বা PNG ফর্ম্যাটে হতে হবে' : 'Image should be in JPG or PNG format'}
            </li>
            <li>
              • {language === 'bn' ? 'আমাদের AI আপনার ওষুধ স্বয়ংক্রিয়ভাবে বিশ্লেষণ করবে' : 'Our AI will automatically analyze your medicines'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
