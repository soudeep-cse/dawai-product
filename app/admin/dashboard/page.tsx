'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingPrescriptions: 0,
    activeMedicines: 0,
    lowStockItems: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, medicinesRes] = await Promise.all([
        fetch('/api/admin/orders').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/medicines').then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      setStats({
        totalOrders: ordersRes.data?.length || 0,
        totalSales: 0,
        pendingPrescriptions: 0,
        activeMedicines: medicinesRes.data?.length || 0,
        lowStockItems: medicinesRes.data?.filter((m: any) => m.stockQuantity < 10).length || 0,
        totalCustomers: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    { icon: '💊', label: 'Add Medicine', action: 'medicine-add-v2', color: 'from-teal-500 to-teal-600' },
    { icon: '📋', label: 'Manage Medicines', action: 'medicine-list', color: 'from-blue-500 to-blue-600' },
    { icon: '📝', label: 'Prescriptions', action: 'prescriptions', color: 'from-orange-500 to-orange-600' },
    { icon: '📦', label: 'Manage Orders', action: 'orders', color: 'from-purple-500 to-purple-600' },
    { icon: '👥', label: 'Manage Users', action: 'users', color: 'from-indigo-500 to-indigo-600' },
    { icon: '⚙️', label: 'Settings', action: 'settings', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-16">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => router.push(`/admin/${action.action}`)}
                  className={`w-full bg-gradient-to-r ${action.color} text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-3 justify-center`}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-teal-900 mb-2">💡 Tip</p>
            <p className="text-xs text-teal-800">Start by adding medicines to your inventory. Customers will see them on the shop.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* KPI Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'bg-blue-50', textColor: 'text-blue-600' },
                { label: 'Total Sales', value: `${stats.totalSales} TK`, icon: '💰', color: 'bg-green-50', textColor: 'text-green-600' },
                { label: 'Pending Prescriptions', value: stats.pendingPrescriptions, icon: '📝', color: 'bg-orange-50', textColor: 'text-orange-600' },
                { label: 'Active Medicines', value: stats.activeMedicines, icon: '💊', color: 'bg-purple-50', textColor: 'text-purple-600' },
                { label: 'Low Stock Items', value: stats.lowStockItems, icon: '⚠️', color: 'bg-red-50', textColor: 'text-red-600' },
                { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'bg-indigo-50', textColor: 'text-indigo-600' },
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                    </div>
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h3>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">📊 No orders yet</p>
                <p className="text-sm mt-2">Orders will appear here once customers start placing them</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">📦 No recent orders</p>
                <p className="text-sm mt-2">Recent orders will appear here</p>
              </div>
            </div>
          </section>

          {/* Activity Log */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">📝 No activity yet</p>
              <p className="text-sm mt-2">Activity will appear here as you manage medicines, orders, and customers</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}