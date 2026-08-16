'use client';

import PlacementTable from '@/components/PlacementTable';
import { useOffers } from '@/components/OffersProvider';

export default function Page() {
  const { offers, isLoading } = useOffers();

  return (
    <main className="container py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Placement Data</h1>
          <p className="muted mt-2">Search and filter live placement records.</p>
        </div>
      </div>
      {isLoading ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-10 text-center">
          <p className="text-lg font-semibold">Loading placement data...</p>
          <p className="muted mt-2 text-sm">
          Fetching the latest records 
          </p>
        </div>
      ) : (
        <PlacementTable offers={offers} />
      )}
    </main>
  );
}
