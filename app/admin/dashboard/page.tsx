'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const [stats] = useState({
    totalOrders: 127,
    totalSales: 45320,
    pendingPrescriptions: 8,
    activeMedicines: 342,
    lowStockItems: 12,
    totalCustomers: 256,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 text-blue-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-green-50 text-green-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Total Sales</p>
            <p className="text-3xl font-bold mt-2">{stats.totalSales} TK</p>
          </div>
          <div className="bg-orange-50 text-orange-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Pending Prescriptions</p>
            <p className="text-3xl font-bold mt-2">{stats.pendingPrescriptions}</p>
          </div>
          <div className="bg-purple-50 text-purple-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Active Medicines</p>
            <p className="text-3xl font-bold mt-2">{stats.activeMedicines}</p>
          </div>
          <div className="bg-red-50 text-red-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Low Stock Items</p>
            <p className="text-3xl font-bold mt-2">{stats.lowStockItems}</p>
          </div>
          <div className="bg-indigo-50 text-indigo-600 rounded-lg p-6 shadow">
            <p className="text-sm font-medium">Total Customers</p>
            <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Delivered</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: "68%"}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">ORD-001</p>
                </div>
                <p className="font-medium">2500 TK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}