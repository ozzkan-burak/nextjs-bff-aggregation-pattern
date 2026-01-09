// src/app/api/bff/dashboard/route.ts
import { NextResponse } from 'next/server';
import {
  fetchUserProfile,
  fetchRecentOrders,
  fetchRecommendations,
} from '@/services/external-apis';

export const dynamic = 'force-dynamic'; // Cache'lemeyi kapatıyoruz (Gerçek zamanlı veri için)

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. PARALEL FETCHING (Sihir burada!)
    // Servisleri sırayla (await... await...) değil, aynı anda başlatıyoruz.
    // Toplam süre = En yavaş servisin süresi (Orders: 800ms) olacaktır.
    const [user, orders, recommendations] = await Promise.all([
      fetchUserProfile('user-123'),
      fetchRecentOrders('user-123'),
      fetchRecommendations('user-123'),
    ]);

    // 2. DATA SHAPING (Veri Şekillendirme)
    // Frontend'in ihtiyacı olmayan verileri burada temizleyebiliriz.
    // Örneğin User servisinden gelen hassas "email" bilgisini silebiliriz.
    const dashboardData = {
      user: {
        name: user.fullName, // Sadece isim ve rolü gönderiyoruz
        role: user.role,
        // email ve preferences'ı bilerek göndermiyoruz (Bandwidth saving)
      },
      widgets: {
        activeOrders: orders.filter((o) => o.status !== 'Delivered'), // Frontend'de filtrelemek yerine burada yapıyoruz
        completedOrdersCount: orders.filter((o) => o.status === 'Delivered')
          .length,
        dailyDeals: recommendations.filter((r) => r.discountRate > 0),
      },
      meta: {
        source: 'BFF Aggregation Layer',
        serverProcessingTime: `${Date.now() - startTime}ms`,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    // Merkezi Hata Yönetimi
    return NextResponse.json(
      { error: 'BFF Layer failed to fetch upstream services' },
      { status: 502 } // Bad Gateway
    );
  }
}
