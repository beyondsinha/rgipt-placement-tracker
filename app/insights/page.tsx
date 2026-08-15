'use client';

import { stats, lpa } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useOffers } from '@/components/OffersProvider';

export default function Page() {
  const { offers } = useOffers();
  const s = stats(offers);

  const sector = Object.entries(
    offers.reduce<Record<string, number>>((a, o) => ((a[o.sector] = (a[o.sector] || 0) + 1), a), {})
  ).map(([name, value]) => ({ name, value }));

  const branchData = ['CSE', 'MnC', 'ECE', 'EE', 'ME', 'CHE', 'PE', 'CE', 'BME'].map(b => ({
    name: b,
    value: offers.filter(o => o.branches.includes(b)).length
  }));

  return (
    <main className="container py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold">Placement Insights</h1>
      <p className="muted mt-2">Analytics generated from live placement records.</p>

      <div className="grid lg:grid-cols-2 gap-5 mt-7">
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-lg">Companies by Sector</h2>
          <div className="h-[330px] mt-4">
            <ResponsiveContainer>
              <BarChart data={sector}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3b55" />
                <XAxis dataKey="name" stroke="#8fa4c1" angle={-25} textAnchor="end" height={70} />
                <YAxis stroke="#8fa4c1" allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#101f35', border: '1px solid #2a3b55' }} />
                <Bar dataKey="value" fill="#3578ff" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-lg">Branch Appearance Across Offers</h2>
          <div className="h-[330px] mt-4">
            <ResponsiveContainer>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3b55" />
                <XAxis dataKey="name" stroke="#8fa4c1" />
                <YAxis stroke="#8fa4c1" allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#101f35', border: '1px solid #2a3b55' }} />
                <Bar dataKey="value" fill="#16c784" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mt-5">
        <h2 className="font-bold text-lg">Headline numbers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            ['Average CTC', lpa(s.avg)],
            ['Median CTC', lpa(s.median)],
            ['Highest Package', lpa(s.highest)],
            ['Selections Recorded', String(s.selected)]
          ].map(([a, b]) => (
            <div className="bg-[#0b192d] rounded-xl p-4" key={a}>
              <div className="muted text-sm">{a}</div>
              <div className="font-bold text-2xl mt-1">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
