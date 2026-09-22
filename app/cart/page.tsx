'use client';

import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateItem, getSubtotal, getDiscountAmount, getTotal, getItemCount } = useCart();
  const { language, t } = useLanguage();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h1 className="text-4xl font-bold text-primary-navy mb-4">
            {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your Cart is Empty'}
          </h1>
          <p className="text-lg text-neutral-gray mb-8">
            {language === 'bn'
              ? 'ঔষধ কিনতে শুরু করুন এবং দ্রুত ডেলিভারি পান'
              : 'Start shopping and get fast delivery'}
          </p>
          <Link
            href="/category"
            className="inline-block px-8 py-3 bg-primary-teal text-white rounded-lg font-semibold hover:bg-primary-mint transition-all hover:shadow-lg"
          >
            {language === 'bn' ? 'কেনাকাটা করুন' : 'Start Shopping'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-primary-navy mb-8">
          {language === 'bn' ? 'আপনার কার্ট' : 'Shopping Cart'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {items.map((item) => (
                <div
                  key={item.medicineId}
                  className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                >
                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-primary-navy">
                      {language === 'bn' ? item.medicineNameBn : item.medicineName}
                    </h3>

                    {/* Pricing */}
                    <div className="mt-2 flex items-center gap-2">
                      {item.hasDiscount && (
                        <span className="text-sm line-through text-neutral-gray">
                          Tk {(item.originalPrice * item.quantity).toFixed(2)}
                        </span>
                      )}
                      <span className="font-semibold text-primary-teal">
                        Tk {(item.pricePerUnit * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.hasDiscount && (
                      <p className="text-xs text-green-600 mt-1">
                        {item.discountType === 'PERCENTAGE'
                          ? `${item.discountValue}% OFF`
                          : `Tk ${item.discountValue} OFF`}
                      </p>
                    )}
                  </div>

                  {/* Quantity Control */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 border border-neutral-light rounded-lg">
                      <button
                        onClick={() => updateItem(item.medicineId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-neutral-light"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.medicineId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-neutral-light"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.medicineId)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      {language === 'bn' ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-20">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Order Summary'}
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between text-neutral-gray">
                <span>{language === 'bn' ? 'আইটেম' : 'Items'}</span>
                <span>{getItemCount()}</span>
              </div>

              <div className="flex justify-between text-neutral-gray">
                <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span>Tk {getSubtotal().toFixed(2)}</span>
              </div>

              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>{language === 'bn' ? 'ছাড়' : 'Discount'}</span>
                  <span>-Tk {getDiscountAmount().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-gray">
                <span>{language === 'bn' ? 'ডেলিভারি' : 'Delivery'}</span>
                <span>{language === 'bn' ? 'চেকআউটে' : 'At checkout'}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-xl font-bold text-primary-navy">
              <span>{language === 'bn' ? 'মোট' : 'Total'}</span>
              <span className="text-primary-teal">Tk {getTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full px-6 py-3 bg-primary-teal text-white rounded-lg font-semibold hover:bg-primary-mint transition-all hover:shadow-lg"
            >
              {language === 'bn' ? 'চেকআউটে যান' : 'Proceed to Checkout'}
            </button>

            <Link
              href="/category"
              className="block text-center mt-4 text-primary-teal hover:underline"
            >
              {language === 'bn' ? 'আরও কিনুন' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
