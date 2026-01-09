// src/services/external-apis.ts

/**
 * MOCK MICROSERVICES LAYER
 * ------------------------
 * Bu fonksiyonlar, gerçek hayattaki bağımsız .NET/Node.js mikroservislerini taklit eder.
 * Her biri farklı gecikme sürelerine (Network Latency) sahiptir.
 */

// 1. User Service (Hızlı yanıt verir - 300ms)
export const fetchUserProfile = async (userId: string) => {
  console.log(`[User Service] Fetching profile for ${userId}...`);
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    id: userId,
    fullName: 'Burak Özkan',
    role: 'Frontend Architect',
    email: 'burak@example.com',
    preferences: {
      theme: 'dark',
      notifications: true,
    },
  };
};

// 2. Orders Service (YAVAŞ servis - Darboğaz burası - 800ms)
// Genelde veritabanı sorguları ağır olduğu için bu servis yavaştır.
export const fetchRecentOrders = async (userId: string) => {
  console.log(`[Order Service] Fetching orders for ${userId}...`);
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: 'ORD-123',
      amount: 1250.0,
      currency: 'TRY',
      status: 'Shipped',
      date: '2024-01-15',
    },
    {
      id: 'ORD-124',
      amount: 450.5,
      currency: 'TRY',
      status: 'Processing',
      date: '2024-01-18',
    },
    {
      id: 'ORD-125',
      amount: 89.9,
      currency: 'USD',
      status: 'Delivered',
      date: '2024-01-10',
    },
  ];
};

// 3. Recommendation Service (Orta hızda - 500ms)
// AI/ML tabanlı öneri motorunu simüle eder.
export const fetchRecommendations = async (userId: string) => {
  console.log(`[Rec Service] Calculating recommendations for ${userId}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: 'PROD-99', name: 'Mechanical Keyboard', discountRate: 0.15 },
    { id: 'PROD-88', name: '4K Monitor', discountRate: 0 },
    { id: 'PROD-77', name: 'Ergonomic Chair', discountRate: 0.05 },
  ];
};
