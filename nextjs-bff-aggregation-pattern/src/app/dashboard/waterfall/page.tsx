// src/app/dashboard/waterfall/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function WaterfallDashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `${Date.now() % 10000}ms: ${msg}`]);

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      addLog('🚀 Starting Waterfall Requests...');

      try {
        // KÖTÜ PRATİK: Waterfall (Şelale) Etkisi

        // CACHE-BUSTER EKLENDİ: ?_t=${Date.now()}
        // Bu sayede tarayıcı cache'i atlayıp gerçekten sunucuya gitmek zorunda kalacak.

        // 1. İstek: User (300ms)
        addLog('⏳ Fetching User...');
        await fetch(`/api/direct/user?_t=${Date.now()}`); // <-- GÜNCELLENDİ
        addLog('✅ User received.');

        // 2. İstek: Orders (800ms)
        addLog('⏳ Fetching Orders...');
        await fetch(`/api/direct/orders?_t=${Date.now()}`); // <-- GÜNCELLENDİ
        addLog('✅ Orders received.');

        // 3. İstek: Recommendations (500ms)
        addLog('⏳ Fetching Recommendations...');
        await fetch(`/api/direct/recommendations?_t=${Date.now()}`); // <-- GÜNCELLENDİ
        addLog('✅ Recommendations received.');
      } catch (err) {
        console.error(err);
      } finally {
        const end = Date.now();
        setTotalTime(end - start);
        setLoading(false);
        addLog('🏁 All data loaded.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-red-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            ❌ The Waterfall Anti-Pattern
          </h1>
          <p className="text-gray-600 mb-6">
            Servisler sırayla çağrıldığında toplam süre birikir.
          </p>

          <div className="flex justify-between items-center bg-red-100 p-4 rounded mb-6">
            <span className="font-semibold text-red-800">Total Wait Time:</span>
            {loading ? (
              <span className="animate-pulse">Calculating...</span>
            ) : (
              <span className="text-3xl font-bold text-red-600">
                {totalTime}ms
              </span>
            )}
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="border-b border-gray-800 py-1">
                {log}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/dashboard/bff"
              className="text-blue-600 hover:underline font-semibold"
            >
              Compare with BFF Pattern (Go to Good Example) 👉
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
