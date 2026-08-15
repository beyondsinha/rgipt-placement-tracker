import {Offer} from './types';
export const inr=(n:number|null|undefined)=>n==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const lpa=(n:number|null|undefined)=>n==null?'—':`₹${(n/100000).toFixed(2)} LPA`;
export const uniqueCompanies=(offers:Offer[])=>new Set(offers.map(x=>x.company)).size;
export function stats(offers:Offer[]){const c=offers.filter(x=>x.ctc!=null).map(x=>x.ctc as number);const avg=c.length?c.reduce((a,b)=>a+b,0)/c.length:0;const sorted=[...c].sort((a,b)=>a-b);const median=sorted.length?sorted[Math.floor((sorted.length-1)/2)]:0;const stipend=offers.filter(x=>x.stipend!=null).map(x=>x.stipend as number);const avgStipend=stipend.length?stipend.reduce((a,b)=>a+b,0)/stipend.length:0;const selected=offers.reduce((a,b)=>a+b.studentsSelected,0);return {avg,median,avgStipend,selected,highest:Math.max(0,...c),highestStipend:Math.max(0,...stipend)} }
export function branchEligible(o:Offer,b:string){return o.branches.includes(b)||o.branches.length===0}
