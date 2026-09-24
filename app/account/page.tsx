'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useCustomerOrders, useCustomerPrescriptions, useCustomerAddresses } from '@/hooks/useCustomerAuth';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';

type TabType = 'profile' | 'orders' | 'prescriptions' | 'addresses';

export default function CustomerAccountPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { customer, isAuthenticated, logout, updateProfile } = useCustomerAuth();
  const { getOrders, orders } = useCustomerOrders();
  const { getPrescriptions, prescriptions } = useCustomerPrescriptions();
  const { getAddresses, addAddress, updateAddress, deleteAddress, addresses } = useCustomerAddresses();
  const { zones } = useDeliveryZones();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profileName, setProfileName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({ label: '', address: '', zoneId: '', isDefault: false });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
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

  useEffect(() => {
    if (customer) {
      setProfileName(customer.name || '');
    }
  }, [customer]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await updateProfile({ name: profileName });
    setSavingProfile(false);
  };

  const resetAddressForm = () => {
    setAddressForm({ label: '', address: '', zoneId: '', isDefault: false });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr: any) => {
    setAddressForm({
      label: addr.label,
      address: addr.address,
      zoneId: addr.zoneId,
      isDefault: addr.isDefault,
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress(editingAddressId, addressForm);
    } else {
      await addAddress(addressForm);
    }
    resetAddressForm();
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    await deleteAddress(id);
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
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg"
                >
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
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
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => (showAddressForm ? resetAddressForm() : setShowAddressForm(true))}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    {showAddressForm ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleSubmitAddress} className="border rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
                    <input
                      type="text"
                      required
                      placeholder="Label (e.g. Home, Office)"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      required
                      placeholder="Full address"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={2}
                    />
                    <select
                      required
                      value={addressForm.zoneId}
                      onChange={(e) => setAddressForm({ ...addressForm, zoneId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select delivery zone</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>{z.nameEn}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      Set as default address
                    </label>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                      {editingAddressId ? 'Save Changes' : 'Add Address'}
                    </button>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="text-center text-gray-600">No addresses saved</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr: any) => (
                      <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {addr.label} {addr.isDefault && <span className="text-xs text-green-600">(Default)</span>}
                          </p>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-xs text-gray-500">{addr.zone?.nameEn}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditAddress(addr)} className="text-sm text-blue-600 hover:text-blue-700">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm text-red-600 hover:text-red-700">
                            Delete
                          </button>
                        </div>
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
