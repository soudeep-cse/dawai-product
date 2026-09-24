'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { toE164 } from '@/lib/phone';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

function CustomerLoginForm() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const { customer, isAuthenticated } = useCustomerAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (isAuthenticated && customer) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, customer, router, redirectTo]);

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
      sending: 'Sending...',
      otpSubtitle: 'Enter the 6-digit code sent to your phone',
      otp: 'OTP Code',
      enterOTP: '000000',
      verify: 'Verify OTP',
      verifying: 'Verifying...',
      resend: 'Resend OTP',
      resendIn: 'Resend in',
      seconds: 'seconds',
      invalidPhone: 'Please enter a valid phone number',
      invalidOTP: 'Please enter a valid 6-digit OTP',
      backToPhone: 'Back to Phone',
      error: 'An error occurred. Please try again.',
      orDivider: 'OR',
      google: 'Continue with Google',
    },
    bn: {
      title: 'গ্রাহক লগইন',
      subtitle: 'চালিয়ে যেতে আপনার ফোন নম্বর প্রবেশ করুন',
      phone: 'ফোন নম্বর',
      enterPhone: '01712345678',
      sendOTP: 'OTP পাঠান',
      sending: 'পাঠানো হচ্ছে...',
      otpSubtitle: 'আপনার ফোনে পাঠানো 6-অঙ্কের কোড প্রবেশ করুন',
      otp: 'OTP কোড',
      enterOTP: '000000',
      verify: 'OTP যাচাই করুন',
      verifying: 'যাচাই করা হচ্ছে...',
      resend: 'OTP পুনরায় পাঠান',
      resendIn: 'পুনরায় পাঠান',
      seconds: 'সেকেন্ডে',
      invalidPhone: 'অনুগ্রহ করে একটি বৈধ ফোন নম্বর প্রবেশ করুন',
      invalidOTP: 'অনুগ্রহ করে একটি বৈধ 6-অঙ্কের OTP প্রবেশ করুন',
      backToPhone: 'ফোন নম্বরে ফিরে যান',
      error: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      orDivider: 'অথবা',
      google: 'Google দিয়ে চালিয়ে যান',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const verifyWithBackend = async (idToken: string) => {
    const response = await fetch('/api/auth/firebase-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include',
    });
    const result = await response.json();

    if (result.success) {
      setTimeout(() => router.push(redirectTo), 500);
    } else {
      setError(result.error || t.error);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.match(/^01[0-9]{9}$/)) {
      setError(t.invalidPhone);
      return;
    }

    setError(null);
    setSendingOtp(true);

    try {
      const e164Phone = toE164(phone);
      const verifier = getRecaptcha();
      confirmationRef.current = await signInWithPhoneNumber(getFirebaseAuth(), e164Phone, verifier);
      setStep('otp');
      setTimer(60);
      setOtp('');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || t.error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.match(/^[0-9]{6}$/)) {
      setError(t.invalidOTP);
      return;
    }
    if (!confirmationRef.current) {
      setError(t.error);
      return;
    }

    setError(null);
    setVerifying(true);

    try {
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();
      await verifyWithBackend(idToken);
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || t.error);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSendingOtp(true);
    try {
      const e164Phone = toE164(phone);
      const verifier = getRecaptcha();
      confirmationRef.current = await signInWithPhoneNumber(getFirebaseAuth(), e164Phone, verifier);
      setTimer(60);
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      await verifyWithBackend(idToken);
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || t.error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {step === 'phone' ? (
            <>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
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
                  disabled={sendingOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
                >
                  {sendingOtp ? t.sending : t.sendOTP}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{t.orDivider}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t.google}
              </button>
            </>
          ) : (
            <>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.otp}</label>
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
                  disabled={verifying}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
                >
                  {verifying ? t.verifying : t.verify}
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
                  <button disabled className="flex-1 text-gray-400 text-sm font-medium">
                    {t.resendIn} {timer}s
                  </button>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={sendingOtp}
                    className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                  >
                    {sendingOtp ? t.sending : t.resend}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={null}>
      <CustomerLoginForm />
    </Suspense>
  );
}
