'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useCustomerOTP } from '@/hooks/useCustomerAuth';

export default function CustomerLoginPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { customer, isAuthenticated } = useCustomerAuth();
  const { sendOTP, loading: otpLoading, error: otpError, message: otpMessage } = useCustomerOTP();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && customer) {
      router.push('/account');
    }
  }, [isAuthenticated, customer, router]);

  // Timer for OTP resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const labels = {
    en: {
      title: 'Customer Login',
      subtitle: 'Enter your phone number to continue',
      phone: 'Phone Number',
      enterPhone: '01712345678',
      sendOTP: 'Send OTP',
      otpSent: 'OTP sent successfully',
      otpSubtitle: 'Enter the 6-digit code sent to your phone',
      otp: 'OTP Code',
      enterOTP: '000000',
      verify: 'Verify OTP',
      verifying: 'Verifying...',
      resend: 'Resend OTP',
      sending: 'Sending...',
      resendIn: 'Resend in',
      seconds: 'seconds',
      invalidPhone: 'Please enter a valid phone number',
      invalidOTP: 'Please enter a valid 6-digit OTP',
      backToPhone: 'Back to Phone',
      error: 'An error occurred. Please try again.',
      success: 'Login successful! Redirecting...',
    },
    bn: {
      title: 'গ্রাহক লগইন',
      subtitle: 'চালিয়ে যেতে আপনার ফোন নম্বর প্রবেশ করুন',
      phone: 'ফোন নম্বর',
      enterPhone: '01712345678',
      sendOTP: 'OTP পাঠান',
      otpSent: 'OTP সফলভাবে পাঠানো হয়েছে',
      otpSubtitle: 'আপনার ফোনে পাঠানো 6-অঙ্কের কোড প্রবেশ করুন',
      otp: 'OTP কোড',
      enterOTP: '000000',
      verify: 'OTP যাচাই করুন',
      verifying: 'যাচাই করা হচ্ছে...',
      resend: 'OTP পুনরায় পাঠান',
      sending: 'পাঠানো হচ্ছে...',
      resendIn: 'পুনরায় পাঠান',
      seconds: 'সেকেন্ডে',
      invalidPhone: 'অনুগ্রহ করে একটি বৈধ ফোন নম্বর প্রবেশ করুন',
      invalidOTP: 'অনুগ্রহ করে একটি বৈধ 6-অঙ্কের OTP প্রবেশ করুন',
      backToPhone: 'ফোন নম্বরে ফিরে যান',
      error: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      success: 'লগইন সফল! রিডাইরেক্ট করা হচ্ছে...',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.match(/^01[0-9]{9}$/)) {
      setError(t.invalidPhone);
      return;
    }

    setError(null);
    const result = await sendOTP(phone);

    if (result.success) {
      setStep('otp');
      setTimer(60);
      setOtp('');
    } else {
      setError(result.error || t.error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.match(/^[0-9]{6}$/)) {
      setError(t.invalidOTP);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setError(null);
        // Delay redirect to show success message
        setTimeout(() => {
          router.push('/account');
        }, 1000);
      } else {
        setError(result.error || t.error);
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  placeholder={t.enterPhone}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
              >
                {otpLoading ? t.sending : t.sendOTP}
              </button>
            </form>

            {otpMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{otpMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t.verify}</h1>
            <p className="text-gray-600 mt-2">{t.otpSubtitle}</p>
            <p className="text-sm text-gray-500 mt-1">{phone}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.otp}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.slice(0, 6));
                  setError(null);
                }}
                placeholder={t.enterOTP}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || otpLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
            >
              {submitting ? t.verifying : t.verify}
            </button>
          </form>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError(null);
                setTimer(0);
              }}
              className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {t.backToPhone}
            </button>

            {timer > 0 ? (
              <button
                disabled
                className="flex-1 text-gray-400 text-sm font-medium"
              >
                {t.resendIn} {timer}s
              </button>
            ) : (
              <button
                onClick={async () => {
                  const result = await sendOTP(phone);
                  if (result.success) {
                    setTimer(60);
                  }
                }}
                disabled={otpLoading}
                className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
              >
                {otpLoading ? t.sending : t.resend}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
