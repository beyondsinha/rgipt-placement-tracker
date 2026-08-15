'use client';

import Dashboard from '@/components/Dashboard';
import { useOffers } from '@/components/OffersProvider';

export default function Page() {
  const { offers } = useOffers();
  return <Dashboard offers={offers} />;
}
