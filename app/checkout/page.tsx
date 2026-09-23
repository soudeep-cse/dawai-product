'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';
import { useCheckout } from '@/hooks/useCheckout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getSubtotal, clearCart } = useCart();
  const { language } = useLanguage();
  const { customer, isAuthenticated } = useCustomerAuth();
  const { zones } = useDeliveryZones();
  const { createOrder, loading, error, orderId } = useCheckout();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryZoneId: '',
    deliveryAddress: '',
    paymentMethod: 'CASH_ON_DELIVERY',
  });

  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!items.length) {
      router.push('/cart');
    }
  }, [items, router]);

  // Pre-fill from logged-in customer profile
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || customer.name || '',
        customerPhone: prev.customerPhone || customer.phone || '',
        deliveryAddress: prev.deliveryAddress || customer.defaultAddress || '',
        deliveryZoneId: prev.deliveryZoneId || customer.defaultZoneId || '',
      }));
    }
  }, [customer]);

  if (success && orderId) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-7xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            {language === 'bn' ? 'অর্ডার সফল!' : 'Order Successful!'}
          </h1>
          <p className="text-lg text-neutral-gray mb-8">
            {language === 'bn' ? `আপনার অর্ডার নম্বর: ${orderId}` : `Your Order ID: ${orderId}`}
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-block px-8 py-3 bg-primary-teal text-white rounded-lg font-semibold hover:bg-primary-mint"
          >
            {language === 'bn' ? 'হোম এ যান' : 'Back to Home'}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.customerName || !formData.customerPhone || !formData.deliveryZoneId || !formData.deliveryAddress) {
      setValidationError(language === 'bn' ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all fields');
      return;
    }

    const zone = zones.find((z) => z.id === formData.deliveryZoneId);
    const deliveryCharge = zone?.fee || 0;

    const orderData = {
      customerPhone: formData.customerPhone,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail || undefined,
      deliveryZoneId: formData.deliveryZoneId,
      deliveryAddress: formData.deliveryAddress,
      items: items.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
      })),
      totalAmount: getTotal() + deliveryCharge,
      paymentMethod: formData.paymentMethod as 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'CARD',
    };

    const result = await createOrder(orderData);
    if (result.success) {
      setSuccess(true);
      clearCart();
    }
  };

  const selectedZone = zones.find((z) => z.id === formData.deliveryZoneId);
  const deliveryCharge = selectedZone?.fee || 0;
  const finalTotal = getTotal() + deliveryCharge;

  return (
    <div className="min-h-screen bg-neutral-light">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-primary-navy mb-8">
          {language === 'bn' ? 'চেকআউট' : 'Checkout'}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {validationError && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{validationError}</div>}
            {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}
            {!isAuthenticated && (
              <div className="bg-primary-teal/10 border border-primary-teal rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-primary-navy">
                  {language === 'bn' ? 'আগে থেকে অ্যাকাউন্ট আছে?' : 'Already have an account?'}
                </p>
                <Link
                  href="/login?redirect=/checkout"
                  className="text-sm font-semibold text-primary-teal hover:text-primary-navy underline"
                >
                  {language === 'bn' ? 'লগইন করুন' : 'Login'}
                </Link>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
                {isAuthenticated && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({language === 'bn' ? 'লগইন করা আছে' : 'Logged in'})
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                <input type="text" placeholder={language === 'bn' ? 'আপনার নাম' : 'Full Name'} value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" required />
                <input type="tel" placeholder={language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'} value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" required />
                <input type="email" placeholder={language === 'bn' ? 'ইমেল (ঐচ্ছিক)' : 'Email (Optional)'} value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-primary-navy mb-4">
                {language === 'bn' ? 'ডেলিভারি তথ্য' : 'Delivery Information'}
              </h2>
              <div className="space-y-4">
                <select value={formData.deliveryZoneId} onChange={(e) => setFormData({ ...formData, deliveryZoneId: e.target.value })} className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" required>
                  <option value="">{language === 'bn' ? 'ডেলিভারি এলাকা নির্বাচন করুন' : 'Select Delivery Zone'}</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {language === 'bn' ? zone.nameBn : zone.nameEn} (+Tk {zone.fee})
                    </option>
                  ))}
                </select>
                <textarea placeholder={language === 'bn' ? 'বিস্তারিত ঠিকানা' : 'Detailed Address'} value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })} rows={3} className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-primary-teal text-white rounded-lg font-semibold hover:bg-primary-mint disabled:opacity-50">
              {loading ? (language === 'bn' ? 'প্রসেস করছে...' : 'Processing...') : (language === 'bn' ? 'অর্ডার দিন' : 'Place Order')}
            </button>
          </form>
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-20">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">
              {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Order Summary'}
            </h2>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.medicineId} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-primary-navy">{language === 'bn' ? item.medicineNameBn : item.medicineName}</p>
                    <p className="text-neutral-gray text-xs">× {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-primary-teal">Tk {(item.pricePerUnit * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-gray">{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-medium">Tk {getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-gray">{language === 'bn' ? 'ডেলিভারি' : 'Delivery'}</span>
                <span className="font-medium">Tk {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary-navy border-t pt-2">
                <span>{language === 'bn' ? 'মোট' : 'Total'}</span>
                <span className="text-primary-teal">Tk {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
