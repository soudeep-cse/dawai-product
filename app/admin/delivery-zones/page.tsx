'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DeliveryZone {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  fee: number;
  estimatedTimeBn: string;
  estimatedTimeEn: string;
  isActive: boolean;
  sortOrder: number;
}

export default function DeliveryZonesPage() {
  const router = useRouter();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedFees, setEditedFees] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZone, setNewZone] = useState({
    nameEn: '',
    nameBn: '',
    fee: '',
    estimatedTimeEn: '',
    estimatedTimeBn: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/admin/delivery-zones');
      const data = await res.json();
      if (data.success) {
        setZones(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFee = async (zone: DeliveryZone) => {
    const newFee = parseFloat(editedFees[zone.id]);
    if (isNaN(newFee) || newFee < 0) {
      alert('Please enter a valid fee amount');
      return;
    }

    setSavingId(zone.id);
    try {
      const res = await fetch(`/api/admin/delivery-zones/${zone.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fee: newFee }),
      });
      const data = await res.json();
      if (data.success) {
        setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, fee: newFee } : z)));
        setEditedFees((prev) => {
          const next = { ...prev };
          delete next[zone.id];
          return next;
        });
      } else {
        alert(data.error || 'Failed to update fee');
      }
    } catch (error) {
      console.error('Error updating fee:', error);
      alert('Failed to update fee');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (zone: DeliveryZone) => {
    try {
      const res = await fetch(`/api/admin/delivery-zones/${zone.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !zone.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, isActive: !z.isActive } : z)));
      }
    } catch (error) {
      console.error('Error toggling zone status:', error);
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const slug = newZone.nameEn.toLowerCase().trim().replace(/\s+/g, '-');
      const res = await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          nameEn: newZone.nameEn,
          nameBn: newZone.nameBn,
          fee: parseFloat(newZone.fee),
          estimatedTimeEn: newZone.estimatedTimeEn,
          estimatedTimeBn: newZone.estimatedTimeBn,
          sortOrder: zones.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setZones((prev) => [...prev, data.data]);
        setNewZone({ nameEn: '', nameBn: '', fee: '', estimatedTimeEn: '', estimatedTimeBn: '' });
        setShowAddForm(false);
      } else {
        alert(data.error || 'Failed to add zone');
      }
    } catch (error) {
      console.error('Error adding zone:', error);
      alert('Failed to add zone');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button onClick={() => router.back()} className="mb-4 text-teal-600 hover:text-teal-700 font-medium">
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🚚 Delivery Zones & Charges</h1>
            <p className="text-gray-600">Manage delivery areas and their fees</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ➕ Add Zone
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddZone} className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">New Delivery Zone</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Name (English)"
                value={newZone.nameEn}
                onChange={(e) => setNewZone({ ...newZone, nameEn: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                required
                placeholder="নাম (Bengali)"
                value={newZone.nameBn}
                onChange={(e) => setNewZone({ ...newZone, nameBn: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="Fee (TK)"
                value={newZone.fee}
                onChange={(e) => setNewZone({ ...newZone, fee: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                required
                placeholder="Estimated Time (English), e.g. 1-2 hours"
                value={newZone.estimatedTimeEn}
                onChange={(e) => setNewZone({ ...newZone, estimatedTimeEn: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                required
                placeholder="আনুমানিক সময় (Bengali)"
                value={newZone.estimatedTimeBn}
                onChange={(e) => setNewZone({ ...newZone, estimatedTimeBn: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                {creating ? 'Adding...' : 'Add Zone'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-gray-600">Loading zones...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Zone</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Est. Time</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Fee (TK)</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{zone.nameEn}</div>
                      <div className="text-sm text-gray-500">{zone.nameBn}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{zone.estimatedTimeEn}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">৳</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editedFees[zone.id] ?? zone.fee}
                          onChange={(e) => setEditedFees((prev) => ({ ...prev, [zone.id]: e.target.value }))}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(zone)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          zone.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {zone.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSaveFee(zone)}
                        disabled={editedFees[zone.id] === undefined || savingId === zone.id}
                        className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition"
                      >
                        {savingId === zone.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {zones.length === 0 && (
              <div className="text-center py-12 text-gray-500">No delivery zones yet. Add one above.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
