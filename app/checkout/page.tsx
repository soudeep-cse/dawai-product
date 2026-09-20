'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  name: { bn: string; en: string };
  quantity: number;
  pricePerUnit: number;
  isSensitive?: boolean;
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: 'med-001',
    name: { bn: 'নাপা এক্সটেন্ড', en: 'Napa Extend' },
    quantity: 21,
    pricePerUnit: 3,
  },
  {
    id: 'med-002',
    name: { bn: 'এসিলক', en: 'Aciloc' },
    quantity: 14,
    pricePerUnit: 5,
  },
  {
    id: 'med-020',
    name: { bn: 'ইকন', en: 'Econ' },
    quantity: 1,
    pricePerUnit: 30,
    isSensitive: true,
  },
];

const deliveryZones = [
  {
    id: 'gazipur',
    name: { bn: 'গাজীপুর সিটি', en: 'Gazipur City' },
    fee: 30,
    estimatedTime: { bn: '১-২ ঘণ্টা', en: '1-2 hours' },
  },
  {
    id: 'tongi',
    name: { bn: 'টঙ্গী', en: 'Tongi' },
    fee: 40,
    estimatedTime: { bn: '২-৩ ঘণ্টা', en: '2-3 hours' },
  },
  {
    id: 'mymensingh',
    name: { bn: 'ময়মনসিংহ সিটি', en: 'Mymensingh City' },
    fee: 100,
    estimatedTime: { bn: '৪-৬ ঘণ্টা', en: '4-6 hours' },
  },
  {
    id: 'tangail',
    name: { bn: 'টাঙ্গাইল', en: 'Tangail' },
    fee: 80,
    estimatedTime: { bn: '৩-৪ ঘণ্টা', en: '3-4 hours' },
  },
];

const paymentMethods = [
  {
    id: 'cod',
    name: { bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery' },
    icon: '💵',
    description: { bn: 'পণ্য পেয়ে টাকা দিন', en: 'Pay when you receive' },
  },
  {
    id: 'bkash',
    name: { bn: 'বিকাশ', en: 'bKash' },
    icon: '📱',
    description: { bn: 'মোবাইল পেমেন্ট', en: 'Mobile payment' },
  },
  {
    id: 'nagad',
    name: { bn: 'নগদ', en: 'Nagad' },
    icon: '📱',
    description: { bn: 'মোবাইল পেমেন্ট', en: 'Mobile payment' },
  },
  {
    id: 'card',
    name: { bn: 'ক্রেডিট/ডেবিট কার্ড', en: 'Credit/Debit Card' },
    icon: '💳',
    description: { bn: 'অনলাইন পেমেন্ট', en: 'Online payment' },
  },
];

export default function CheckoutPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState(deliveryZones[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const hasSensitiveItem = mockCartItems.some(item => item.isSensitive);

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const deliveryFee = selectedZone.fee;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!phoneNumber || !address) {
      alert(language === 'bn' ? 'দয়া করে সব তথ্য পূরণ করুন' : 'Please fill in all information');
      return;
    }
    router.push('/order/success');
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">
          {language === 'bn' ? 'চেকআউট' : 'Checkout'}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={language === 'bn' ? '০১৭xxxxxxxx' : '01xxxxxxxxx'}
                    className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    {language === 'bn' ? 'সম্পূর্ণ ঠিকানা' : 'Full Address'}
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'bn' ? 'বাড়ি নং, রাস্তা, এলাকা...' : 'House no, street, area...'}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'ডেলিভারি এলাকা' : 'Delivery Zone'}
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {deliveryZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedZone.id === zone.id
                        ? 'border-primary-teal bg-primary-teal/10'
                        : 'border-neutral-light hover:border-primary-teal/50'
                    }`}
                  >
                    <div className="font-semibold text-primary-navy mb-1">
                      {zone.name[language]}
                    </div>
                    <div className="text-sm text-neutral-gray mb-2">
                      {language === 'bn' ? 'সময়' : 'Time'}: {zone.estimatedTime[language]}
                    </div>
                    <div className="text-sm font-medium text-primary-teal">
                      {language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}: ৳{zone.fee}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Discreet Packaging Notice */}
            {hasSensitiveItem && (
              <div className="bg-primary-navy/5 border-l-4 border-primary-navy rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-primary-navy flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-primary-navy mb-1">
                      {language === 'bn' ? 'গোপনীয় প্যাকেজিং' : 'Discreet Packaging'}
                    </h3>
                    <p className="text-sm text-neutral-gray">
                      {language === 'bn'
                        ? 'আপনার অর্ডারে একটি সংবেদনশীল পণ্য রয়েছে। এটি সাদামাটা, লেবেলহীন প্যাকেজিংয়ে পাঠানো হবে।'
                        : 'Your order contains a sensitive item. It will be shipped in plain, unlabeled packaging.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method)}
                    className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all ${
                      selectedPayment.id === method.id
                        ? 'border-primary-teal bg-primary-teal/10'
                        : 'border-neutral-light hover:border-primary-teal/50'
                    }`}
                  >
                    <span className="text-3xl">{method.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-primary-navy">
                        {method.name[language]}
                      </div>
                      <div className="text-sm text-neutral-gray">
                        {method.description[language]}
                      </div>
                    </div>
                    {selectedPayment.id === method.id && (
                      <svg className="w-6 h-6 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              {selectedPayment.id === 'cod' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  <strong>{language === 'bn' ? 'জনপ্রিয় পছন্দ:' : 'Popular choice:'}</strong>{' '}
                  {language === 'bn'
                    ? 'পণ্য পাওয়ার সময় নগদ টাকা দিন'
                    : 'Pay cash when you receive your order'}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-neutral-light">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-primary-navy">
                        {item.name[language]}
                      </div>
                      <div className="text-neutral-gray">
                        {item.quantity} × ৳{item.pricePerUnit}
                      </div>
                    </div>
                    <div className="font-semibold text-primary-navy">
                      ৳{(item.quantity * item.pricePerUnit).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-2 mb-4 pb-4 border-b border-neutral-light text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-gray">{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">
                    {language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}{' '}
                    <span className="text-xs">({selectedZone.name[language]})</span>
                  </span>
                  <span className="font-medium">৳{deliveryFee}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 text-lg">
                <span className="font-bold text-primary-navy">{language === 'bn' ? 'মোট' : 'Total'}</span>
                <span className="font-bold text-2xl text-primary-teal">৳{total.toFixed(2)}</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-primary-teal hover:bg-primary-mint text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
              >
                {language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Place Order'}
              </button>

              {/* Estimated Time */}
              <div className="mt-4 text-center text-sm text-neutral-gray">
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {language === 'bn' ? 'আনুমানিক ডেলিভারি:' : 'Estimated delivery:'}{' '}
                {selectedZone.estimatedTime[language]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
