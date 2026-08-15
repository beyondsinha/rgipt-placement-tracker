'use client';

import PlacementTable from '@/components/PlacementTable';
import { useOffers } from '@/components/OffersProvider';

export default function Page() {
  const { offers, lastUpdated } = useOffers();

  return (
    <main className="container py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Placement Data</h1>
          <p className="muted mt-2">Search and filter live placement records.</p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
          {lastUpdated}
        </div>
      </div>
      <PlacementTable offers={offers} />
    </main>
  );
}
