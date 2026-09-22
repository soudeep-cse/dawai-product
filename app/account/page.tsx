'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useCustomerOrders, useCustomerPrescriptions, useCustomerAddresses } from '@/hooks/useCustomerAuth';

type TabType = 'profile' | 'orders' | 'prescriptions' | 'addresses';

export default function CustomerAccountPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { getOrders, orders } = useCustomerOrders();
  const { getPrescriptions, prescriptions } = useCustomerPrescriptions();
  const { getAddresses, addresses } = useCustomerAddresses();

  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load data based on active tab
  useEffect(() => {
    if (!customer) return;
    if (activeTab === 'orders') {
      getOrders();
    } else if (activeTab === 'prescriptions') {
      getPrescriptions();
    } else if (activeTab === 'addresses') {
      getAddresses();
    }
  }, [activeTab, customer]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!isAuthenticated || !customer) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b flex">
            {(['profile', 'orders', 'prescriptions', 'addresses'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
                }`}
              >
                {tab === 'profile' && 'Profile'}
                {tab === 'orders' && 'Orders'}
                {tab === 'prescriptions' && 'Prescriptions'}
                {tab === 'addresses' && 'Addresses'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="text-gray-900 font-medium">{customer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" defaultValue={customer.name || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <p className="text-center text-gray-600">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.total} TK</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                {prescriptions.length === 0 ? (
                  <p className="text-center text-gray-600">No prescriptions uploaded</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((rx: any) => (
                      <div key={rx.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">{new Date(rx.createdAt).toLocaleDateString()}</p>
                          <span className={`px-3 py-1 rounded text-sm ${rx.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {rx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                {addresses.length === 0 ? (
                  <p className="text-center text-gray-600">No addresses saved</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} className="border rounded-lg p-4">
                        <p className="font-medium">{addr.label}</p>
                        <p className="text-sm text-gray-600">{addr.address}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
