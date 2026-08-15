'use client';

import { useMemo, useState } from 'react';
import { branches } from '@/lib/data';
import { lpa, inr } from '@/lib/utils';
import { useOffers } from '@/components/OffersProvider';

export default function Page() {
  const { offers } = useOffers();
  const [b, setB] = useState('MnC');
  const [cgpa, setCgpa] = useState('8.04');

  const n = Number(cgpa) || 0;

  const eligible = useMemo(
    () => offers.filter(o => (o.branches.includes(b) || o.branches.length === 0) && (o.minCgpa == null || n >= o.minCgpa)),
    [offers, b, n]
  );

  const not = useMemo(() => offers.filter(o => !eligible.includes(o)), [offers, eligible]);

  return (
    <main className="container py-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold">Eligibility Finder</h1>
        <p className="muted mt-2">Enter your branch and CGPA. The tracker compares them against recorded eligibility rules.</p>
      </div>

      <div className="glass rounded-2xl p-5 mt-7 grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          <span className="muted">Branch</span>
          <select value={b} onChange={e => setB(e.target.value)} className="mt-2 w-full bg-[#0b192d] border border-line rounded-xl px-4 py-3">
            {branches.map(x => (
              <option key={x.code} value={x.code}>
                {x.code} — {x.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="muted">CGPA</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={cgpa}
            onChange={e => setCgpa(e.target.value)}
            className="mt-2 w-full bg-[#0b192d] border border-line rounded-xl px-4 py-3"
          />
        </label>
      </div>

      <section className="mt-8">
        <div>
          <h2 className="text-2xl font-bold">Eligible: {eligible.length}</h2>
          <p className="muted text-sm mt-1">Based on branch + minimum CGPA only.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {eligible.map(o => (
            <article key={o.id} className="glass rounded-2xl p-5">
              <div className="flex justify-between gap-3">
                <h3 className="font-bold text-lg">{o.company}</h3>
                <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-lg h-fit">Eligible</span>
              </div>
              <p className="muted mt-1">{o.role}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="muted block">CTC</span>
                  {lpa(o.ctc)}
                </div>
                <div>
                  <span className="muted block">Stipend</span>
                  {o.stipend ? inr(o.stipend) + '/mo' : '—'}
                </div>
                <div>
                  <span className="muted block">Min CGPA</span>
                  {o.minCgpa ?? '—'}
                </div>
                <div>
                  <span className="muted block">Type</span>
                  {o.offerType}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Not eligible / needs review: {not.length}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {not.map(o => (
            <article key={o.id} className="glass rounded-2xl p-5 opacity-75">
              <h3 className="font-bold">{o.company}</h3>
              <p className="muted text-sm mt-1">{o.role}</p>
              <p className="text-sm mt-4">
                {!o.branches.includes(b) ? `Branch restriction: ${o.branches.join(', ')}` : `CGPA requirement: ${o.minCgpa}`}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
