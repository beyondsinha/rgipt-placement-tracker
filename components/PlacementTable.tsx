'use client';

import { useMemo, useState } from 'react';
import { Offer } from '@/lib/types';
import { inr, lpa } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function PlacementTable({ offers }: { offers: Offer[] }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [branch, setBranch] = useState('All');

  const filtered = useMemo(
    () =>
      offers.filter(
        o =>
          (!q ||
            [o.company, o.role, o.sector]
              .join(' ')
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (type === 'All' || o.offerType === type) &&
          (branch === 'All' || o.branches.includes(branch))
      ),
    [offers, q, type, branch]
  );

  /*
   * Group consecutive rows belonging to the same placement ID.
   *
   * Example:
   * ID 1 → ExxonMobil → PPO
   * blank → blank      → FTE
   *
   * Both rows belong to ID 1.
   */
  const groupSpans = useMemo(() => {
    const spans: Record<number, number> = {};

    let i = 0;

    while (i < filtered.length) {
      const currentId = filtered[i].id;
      const currentCompany = filtered[i].company;

      let j = i + 1;

      while (
        j < filtered.length &&
        filtered[j].id === currentId &&
        filtered[j].company === currentCompany
      ) {
        j++;
      }

      spans[i] = j - i;
      i = j;
    }

    return spans;
  }, [filtered]);

  return (
    <div className="glass rounded-2xl overflow-hidden">

      {/* Search & Filters */}
      <div className="p-4 border-b border-line flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3 top-3.5 muted" />

          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search company, role or sector..."
            className="w-full bg-[#0b192d] border border-line rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="bg-[#0b192d] border border-line rounded-xl px-4 py-3"
        >
          {[
            'All',
            'FTE',
            'Intern',
            'Intern + FTE',
            'PPO'
          ].map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>

        <select
          value={branch}
          onChange={e => setBranch(e.target.value)}
          className="bg-[#0b192d] border border-line rounded-xl px-4 py-3"
        >
          {[
            'All',
            'CSE',
            'CSD',
            'IT',
            'IDD',
            'MnC',
            'ECE',
            'EV',
            'PE',
            'CHE'
          ].map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>

      {/* Placement Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-line">
              <th className="p-4">#</th>
              <th className="p-4">Company</th>
              <th className="p-4">Offer</th>
              <th className="p-4">Branches</th>
              <th className="p-4">CGPA</th>
              <th className="p-4">Role</th>
              <th className="p-4">CTC / Stipend</th>
              <th className="p-4">Selected</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o, i) => {
              const isGroupStart =
                i === 0 ||
                filtered[i - 1].id !== o.id ||
                filtered[i - 1].company !== o.company;

              return (
                <tr
                  key={`${o.id}-${i}`}
                  className="border-b border-line/70 hover:bg-white/[.025]"
                >
                  {/* Grouped ID */}
                  {isGroupStart && (
                    <td
                      rowSpan={groupSpans[i]}
                      className="p-4 text-muted align-middle text-center font-semibold border-r border-line/50"
                    >
                      {o.id}
                    </td>
                  )}

                  {/* Grouped Company */}
                  {isGroupStart && (
                    <td
                      rowSpan={groupSpans[i]}
                      className="p-4 font-bold align-middle border-r border-line/50 min-w-[170px]"
                    >
                      <div className="font-bold">
                        {o.company}
                      </div>

                      <div className="text-xs muted mt-1">
                        {o.sector}
                      </div>

                      {groupSpans[i] > 1 && (
                        <div className="text-[11px] muted mt-2">
                          {groupSpans[i]} opportunities
                        </div>
                      )}
                    </td>
                  )}

                  {/* Offer */}
                  <td className="p-4 whitespace-nowrap">
                    {o.offerType}
                  </td>

                  {/* Branches */}
                  <td className="p-4 max-w-[210px]">
                    {o.branches.join(', ')}
                  </td>

                  {/* CGPA */}
                  <td className="p-4">
                    {o.minCgpa ?? '—'}
                  </td>

                  {/* Role */}
                  <td className="p-4 min-w-[190px]">
                    {o.role}
                  </td>

                  {/* CTC / Stipend */}
                  <td className="p-4 whitespace-nowrap">
                    {lpa(o.ctc)}

                    {o.stipend && (
                      <div className="text-xs muted mt-1">
                        Stipend {inr(o.stipend)}/mo
                      </div>
                    )}
                  </td>

                  {/* Selected */}
                  <td className="p-4 font-bold">
                    {o.studentsSelected}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 text-xs muted">
        Showing {filtered.length} of {offers.length} records
      </div>
    </div>
  );
}