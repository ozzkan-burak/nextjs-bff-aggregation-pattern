// src/app/dashboard/bff/page.tsx
'use client';

import { useEffect, useState } from 'react';

// Tip tanımları (Genelde shared/types klasöründe olur ama şimdilik burada)
interface DashboardData {
  user: {
    name: string;
    role: string;
  };
  widgets: {
    activeOrders: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      date: string;
    }>;
    completedOrdersCount: number;
    dailyDeals: Array<{ id: string; name: string; discountRate: number }>;
  };
  meta: {
    source: string;
    serverProcessingTime: string;
  };
}

export default function BffDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        // TEK BİR İSTEK (Single Request)
        // Frontend, 3 farklı servise gitmiyor. Sadece BFF'e gidiyor.
        const res = await fetch('/api/bff/dashboard');
        const jsonData = await res.json();

        setData(jsonData);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setFetchTime(Date.now() - start);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">BFF Aggregation in progress...</p>
          <p className="text-sm text-gray-400 mt-2">
            (Fetching User + Orders + Recommendations)
          </p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-500">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              BFF Dashboard Pattern
            </h1>
            <p className="text-gray-500">Welcome back, {data.user.name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-600">
              Total Client Wait Time
            </div>
            <div className="text-3xl font-bold text-green-600">
              {fetchTime}ms
            </div>
            <div className="text-xs text-gray-400">
              Server Process Time: {data.meta.serverProcessingTime}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Widget 1: Active Orders (Filtered by BFF) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex justify-between">
              📦 Active Orders
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Processing
              </span>
            </h2>
            <div className="space-y-3">
              {data.widgets.activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-mono text-sm text-gray-500">
                      {order.id}
                    </span>
                    <div className="text-xs text-gray-400">{order.date}</div>
                  </div>
                  <div className="font-bold text-gray-700">
                    {order.amount} {order.currency}
                  </div>
                </div>
              ))}
              {data.widgets.activeOrders.length === 0 && (
                <p className="text-gray-400 italic">No active orders.</p>
              )}
            </div>
            <div className="mt-4 pt-2 text-xs text-gray-400 border-t">
              * Completed orders ({data.widgets.completedOrdersCount}) filtered
              out by BFF to save bandwidth.
            </div>
          </div>

          {/* Widget 2: Recommended Deals */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              🎯 Recommended For You
            </h2>
            <div className="space-y-3">
              {data.widgets.dailyDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex justify-between items-center p-3 border border-dashed border-green-200 bg-green-50 rounded"
                >
                  <span className="text-gray-700">{deal.name}</span>
                  <span className="text-sm font-bold text-green-600">
                    -{deal.discountRate * 100}% OFF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Info Box */}
        <div className="bg-gray-800 text-gray-300 p-4 rounded text-xs font-mono">
          <p>Source: {data.meta.source}</p>
          <p>
            Payload Strategy: Only essential fields were transferred (No PII
            data like email).
          </p>
        </div>
      </div>
    </div>
  );
}
