import {Offer} from './types';
export const inr=(n:number|null|undefined)=>n==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const lpa = (value: number | string | null | undefined) => {
  if (value == null || value === '') return '—';

  const text = String(value).trim();

  // Range: 500000-600000
  if (text.includes('-')) {
    const [min, max] = text.split('-').map(Number);

    if (!isNaN(min) && !isNaN(max)) {
      return `₹${(min / 100000).toFixed(2)}–${(max / 100000).toFixed(2)} LPA`;
    }
  }

  // Multiple CTCs: 460000/650000/1118000
  if (text.includes('/')) {
    const values = text.split('/').map(Number);

    if (values.every(v => !isNaN(v))) {
      return values
        .map(v => `₹${(v / 100000).toFixed(2)}`)
        .join(' / ') + ' LPA';
    }
  }

  // Normal CTC: 1800000
  const num = Number(text);

  if (!isNaN(num)) {
    return `₹${(num / 100000).toFixed(2)} LPA`;
  }

  return text;
};export const uniqueCompanies=(offers:Offer[])=>new Set(offers.map(x=>x.company)).size;
export function stats(offers: Offer[]) {
  const parseCtcValues = (
    value: number | string | null | undefined
  ): number[] => {
    if (value == null || value === '') return [];

    const text = String(value).trim();

    // Range: 500000-600000
    if (text.includes('-')) {
      const parts = text.split('-').map(Number);

      if (parts.length === 2 && parts.every(n => !isNaN(n))) {
        return parts;
      }
    }

    // Multiple packages: 460000/650000/1118000
    if (text.includes('/')) {
      const parts = text.split('/').map(Number);

      if (parts.length > 0 && parts.every(n => !isNaN(n))) {
        return parts;
      }
    }

    // Normal CTC
    const num = Number(text);

    return !isNaN(num) ? [num] : [];
  };

  const ctcValues = offers.flatMap(x => parseCtcValues(x.ctc));

  const avg = ctcValues.length
    ? ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length
    : 0;

  const sorted = [...ctcValues].sort((a, b) => a - b);

  const median = sorted.length
    ? sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]
    : 0;

  const stipend = offers
    .map(x => x.stipend)
    .filter((x): x is number => x != null);

  const avgStipend = stipend.length
    ? stipend.reduce((a, b) => a + b, 0) / stipend.length
    : 0;

  const selected = offers.reduce(
    (a, b) =>
      a + (typeof b.studentsSelected === 'number' ? b.studentsSelected : 0),
    0
  );

  const highest = ctcValues.length ? Math.max(...ctcValues) : 0;

  const highestStipend = stipend.length
    ? Math.max(...stipend)
    : 0;

  return {
    avg,
    median,
    avgStipend,
    selected,
    highest,
    highestStipend
  };
}
export function branchEligible(o:Offer,b:string){return o.branches.includes(b)||o.branches.length===0}
