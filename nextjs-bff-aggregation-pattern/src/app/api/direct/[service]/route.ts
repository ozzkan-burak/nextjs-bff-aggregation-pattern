// src/app/api/direct/[service]/route.ts
import { NextResponse } from 'next/server';
import {
  fetchUserProfile,
  fetchRecentOrders,
  fetchRecommendations,
} from '@/services/external-apis';

export const dynamic = 'force-dynamic';

// Next.js 15 Tip Tanımı: params bir Promise'dir.
type Props = {
  params: Promise<{ service: string }>;
};

export async function GET(
  request: Request,
  props: Props // params'ı buradan alacağız
) {
  // DÜZELTME: params'ı önce await ediyoruz
  const params = await props.params;
  const { service } = params;

  // Debug için log (Konsolda service adını görmelisin)
  console.log(`Incoming request for service: ${service}`);

  if (service === 'user') {
    const data = await fetchUserProfile('user-123');
    return NextResponse.json(data);
  }

  if (service === 'orders') {
    const data = await fetchRecentOrders('user-123');
    return NextResponse.json(data);
  }

  if (service === 'recommendations') {
    const data = await fetchRecommendations('user-123');
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Service not found' }, { status: 404 });
}
