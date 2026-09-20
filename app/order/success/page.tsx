'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Mock order data
const mockOrder = {
  orderNumber: 'DWI-20260921-0042',
  placedAt: '21 Sep 2026, 2:45 PM',
  estimatedDelivery: '21 Sep 2026, 5-7 PM',
  status: 'confirmed' as 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered',
  items: [
    { name: { bn: 'নাপা এক্সটেন্ড', en: 'Napa Extend' }, quantity: 21, price: 63 },
    { name: { bn: 'এসিলক', en: 'Aciloc' }, quantity: 14, price: 70 },
    { name: { bn: 'ইকন', en: 'Econ' }, quantity: 1, price: 30 },
  ],
  subtotal: 163,
  deliveryFee: 30,
  total: 193,
  deliveryAddress: 'House 12, Road 3, Gazipur City',
  phoneNumber: '01700000000',
  paymentMethod: { bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery' },
};

const orderStatuses = [
  {
    id: 'pending',
    label: { bn: 'অপেক্ষমাণ', en: 'Pending' },
    icon: '📝',
    description: { bn: 'অর্ডার গৃহীত হয়েছে', en: 'Order received' },
  },
  {
    id: 'confirmed',
    label: { bn: 'নিশ্চিত', en: 'Confirmed' },
    icon: '✓',
    description: { bn: 'ওষুধ প্যাক করা হচ্ছে', en: 'Medicines being packed' },
  },
  {
    id: 'out_for_delivery',
    label: { bn: 'পথে আছে', en: 'Out for Delivery' },
    icon: '🏍️',
    description: { bn: 'ডেলিভারিম্যান রওনা দিয়েছে', en: 'Delivery rider on the way' },
  },
  {
    id: 'delivered',
    label: { bn: 'ডেলিভারি সম্পন্ন', en: 'Delivered' },
    icon: '✅',
    description: { bn: 'অর্ডার ডেলিভার হয়েছে', en: 'Order delivered' },
  },
];

export default function OrderSuccessPage() {
  const { language } = useLanguage();

  const currentStatusIndex = orderStatuses.findIndex(s => s.id === mockOrder.status);

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-primary-navy mb-2">
            {language === 'bn' ? 'অর্ডার সফল!' : 'Order Successful!'}
          </h1>
          <p className="text-neutral-gray mb-6">
            {language === 'bn'
              ? 'আপনার অর্ডার নিশ্চিত হয়েছে এবং শীঘ্রই ডেলিভার হবে'
              : 'Your order has been confirmed and will be delivered soon'}
          </p>

          <div className="bg-primary-teal/10 rounded-lg p-4 inline-block">
            <div className="text-sm text-neutral-gray mb-1">
              {language === 'bn' ? 'অর্ডার নম্বর' : 'Order Number'}
            </div>
            <div className="text-2xl font-bold text-primary-teal">
              {mockOrder.orderNumber}
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-primary-navy mb-6">
            {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
          </h2>

          <div className="relative">
            {orderStatuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={status.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Connector Line */}
                  {index < orderStatuses.length - 1 && (
                    <div
                      className={`absolute left-6 top-12 w-0.5 h-full ${
                        index < currentStatusIndex ? 'bg-primary-teal' : 'bg-neutral-light'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      isCompleted
                        ? 'bg-primary-teal text-white'
                        : 'bg-neutral-light text-neutral-gray'
                    } ${isCurrent ? 'ring-4 ring-primary-teal/30' : ''}`}
                  >
                    {status.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3
                      className={`font-semibold mb-1 ${
                        isCompleted ? 'text-primary-navy' : 'text-neutral-gray'
                      }`}
                    >
                      {status.label[language]}
                    </h3>
                    <p className="text-sm text-neutral-gray">
                      {status.description[language]}
                    </p>
                    {isCurrent && (
                      <div className="mt-2 inline-block bg-accent-coral/20 text-accent-coral px-3 py-1 rounded-full text-xs font-medium">
                        {language === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Delivery */}
          <div className="mt-6 pt-6 border-t border-neutral-light">
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-neutral-gray">
                  {language === 'bn' ? 'আনুমানিক ডেলিভারি:' : 'Estimated Delivery:'}
                </span>{' '}
                <span className="font-semibold text-primary-navy">
                  {mockOrder.estimatedDelivery}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-primary-navy mb-6">
            {language === 'bn' ? 'অর্ডার বিবরণ' : 'Order Details'}
          </h2>

          {/* Items */}
          <div className="space-y-3 mb-6 pb-6 border-b border-neutral-light">
            {mockOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <div className="font-medium text-primary-navy">
                    {item.name[language]}
                  </div>
                  <div className="text-sm text-neutral-gray">
                    {language === 'bn' ? 'পরিমাণ' : 'Quantity'}: {item.quantity}
                  </div>
                </div>
                <div className="font-semibold text-primary-navy">
                  ৳{item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-2 mb-6 pb-6 border-b border-neutral-light">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-gray">{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
              <span>৳{mockOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-gray">{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
              <span>৳{mockOrder.deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg mb-6">
            <span className="font-bold text-primary-navy">{language === 'bn' ? 'মোট' : 'Total'}</span>
            <span className="font-bold text-2xl text-primary-teal">৳{mockOrder.total.toFixed(2)}</span>
          </div>

          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-neutral-light">
            <div>
              <h3 className="font-semibold text-primary-navy mb-2">
                {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
              </h3>
              <p className="text-sm text-neutral-gray">
                {mockOrder.deliveryAddress}
              </p>
              <p className="text-sm text-neutral-gray mt-1">
                📱 {mockOrder.phoneNumber}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary-navy mb-2">
                {language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
              </h3>
              <p className="text-sm text-neutral-gray">
                {mockOrder.paymentMethod[language]}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-primary-teal hover:bg-primary-mint text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {language === 'bn' ? 'হোমপেজে ফিরুন' : 'Back to Home'}
          </Link>
          <button
            onClick={() => alert('Track order feature - Mock')}
            className="flex-1 bg-white border-2 border-primary-teal text-primary-teal hover:bg-primary-teal/10 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {language === 'bn' ? 'লাইভ ট্র্যাক করুন' : 'Track Live'}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-gray">
            {language === 'bn'
              ? 'সমস্যা হলে আমাদের সাথে যোগাযোগ করুন: 01700-000000'
              : 'Need help? Contact us: 01700-000000'}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
