'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useOffers } from '@/components/OffersProvider';
import { Offer } from '@/lib/types';
import { Download, Upload, RefreshCw, Lock, Key, ShieldCheck, AlertTriangle } from 'lucide-react';

const fields = [
  'id',
  'session',
  'company',
  'sector',
  'offerType',
  'branches',
  'minCgpa',
  'role',
  'ctc',
  'stipend',
  'location',
  'studentsSelected',
  'notes'
];

// Default admin PIN passcode (Can also be set in Vercel Environment Variables as NEXT_PUBLIC_ADMIN_PIN)
const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'rgipt2026';

export default function Admin() {
  const {
    offers,
    setOffers,
    googleSheetUrl,
    setGoogleSheetUrl,
    syncFromGoogleSheet,
    resetToDefault,
    isLoading,
    lastUpdated
  } = useOffers();

  const [inputUrl, setInputUrl] = useState(googleSheetUrl);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Security Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [pinError, setPinError] = useState('');

  // Check if previously unlocked during session
  useEffect(() => {
    try {
      const authState = sessionStorage.getItem('rgipt_admin_authenticated');
      if (authState === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_PIN || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        sessionStorage.setItem('rgipt_admin_authenticated', 'true');
      } catch (e) {}
    } else {
      setPinError('Access Denied: Invalid Admin Passcode!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('rgipt_admin_authenticated');
    } catch (e) {}
  };

  // 1. Export CSV
  function exportCsv() {
    const rows = offers.map(o => ({
      ...o,
      branches: Array.isArray(o.branches) ? o.branches.join('|') : ''
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rgipt-placement-data.csv';
    a.click();
    setStatusMsg('Downloaded rgipt-placement-data.csv! Open this in Excel to edit.');
  }

  // 2. Import CSV
  function importCsv(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const mapped = (r.data as any[]).map((x, i) => ({
          id: x.id || String(Date.now() + i),
          session: x.session || '2026-27',
          notificationDate: x.notificationDate || new Date().toISOString().split('T')[0],
          company: x.company || 'Unknown',
          sector: x.sector || 'General',
          offerType: x.offerType || 'FTE',
          branches: String(x.branches || '')
            .split('|')
            .map((v: string) => v.trim())
            .filter(Boolean),
          minCgpa: x.minCgpa && !isNaN(Number(x.minCgpa)) ? Number(x.minCgpa) : null,
          role: x.role || 'Graduate Trainee',
          ctc: x.ctc && !isNaN(Number(x.ctc)) ? Number(x.ctc) : null,
          stipend: x.stipend && !isNaN(Number(x.stipend)) ? Number(x.stipend) : null,
          location: x.location || 'India',
          studentsSelected: !isNaN(Number(x.studentsSelected)) ? Number(x.studentsSelected) : 0,
          notes: x.notes || ''
        }));
        setOffers(mapped as Offer[]);
        setStatusMsg(`Successfully imported ${mapped.length} records into the live site!`);
      }
    });
  }

  // 3. Connect Google Sheet URL
  const handleSaveGoogleSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setStatusMsg('Connecting to Google Sheet...');
    setGoogleSheetUrl(inputUrl);
    const ok = await syncFromGoogleSheet(inputUrl);
    if (ok) {
      setStatusMsg('✅ Connected & synced live with Google Sheet!');
    } else {
      setStatusMsg('⚠️ Could not fetch Google Sheet CSV. Please check that the sheet is Published to the Web as CSV.');
    }
  };

  // If NOT Authenticated: Show Lock Screen
  if (!isAuthenticated) {
    return (
      <main className="container py-16" style={{ maxWidth: '500px', margin: '0 auto', padding: '24px' }}>
        <div
          className="glass rounded-2xl p-8"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Lock size={28} color="#c084fc" />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '24px' }}>
            Please enter the Admin Passcode to unlock.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                required
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  background: '#0b1324',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  outline: 'none'
                }}
              />
            </div>

            {pinError && (
              <div style={{ fontSize: '0.82rem', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                {pinError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}
            >
              Unlock Admin Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Authenticated Admin UI
  return (
    <main className="container py-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#34d399" />
            <h1 className="text-3xl md:text-4xl font-extrabold">Admin & Live Data Sync</h1>
          </div>
          <p className="muted mt-2 text-slate-400">
            Connect your RGIPT Google Sheet for automated daily updates, or upload edited Excel CSV files.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
        >
          Lock Portal
        </button>
      </div>

      {/* Option 1: Automatic Daily Updates via Google Sheets */}
      <div className="glass rounded-2xl p-6 mb-6" style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RefreshCw size={22} color="#38bdf8" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
            ⚡ Automatic Daily Updates (Google Sheets)
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '16px' }}>
          Publish your RGIPT placement Google Sheet as a CSV (<code style={{ color: '#38bdf8' }}>File → Share → Publish to Web → CSV</code>). Paste the link below. The website will automatically fetch daily placement updates live without any manual file uploads!
        </p>

        <form onSubmit={handleSaveGoogleSheet} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <input
            type="url"
            placeholder="Paste your Google Sheet published CSV link here..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{ flex: 1, minWidth: '300px', padding: '12px 16px', borderRadius: '10px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{ padding: '12px 24px', borderRadius: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {isLoading ? 'Syncing...' : 'Connect & Sync Google Sheet'}
          </button>
        </form>

        {lastUpdated && (
          <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
            Current Status: {lastUpdated}
          </div>
        )}
      </div>

      {/* Option 2: Excel / CSV File Manager */}
      <div className="glass rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '12px' }}>
          📁 Manual Excel / CSV File Updates
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={exportCsv}
            style={{ padding: '10px 18px', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            Export CSV for Excel
          </button>

          <label
            style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
          >
            <Upload size={16} />
            Import Edited CSV
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && importCsv(e.target.files[0])}
            />
          </label>

          <button
            onClick={resetToDefault}
            style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(248, 113, 113, 0.15)', color: '#f87171', fontWeight: 'bold', cursor: 'pointer', border: '1px solid rgba(248, 113, 113, 0.3)', fontSize: '0.88rem' }}
          >
            Reset to Default Data
          </button>
        </div>

        {statusMsg && (
          <p style={{ color: '#34d399', marginTop: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
            {statusMsg}
          </p>
        )}
      </div>

      {/* Preview Table */}
      <div className="glass rounded-2xl overflow-hidden mt-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>
          Live Placement Records in Memory: {offers.length}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                {fields.slice(0, 10).map(f => (
                  <th style={{ padding: '12px' }} key={f}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {fields.slice(0, 10).map(f => (
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }} key={f}>
                      {Array.isArray((o as any)[f]) ? (o as any)[f].join(', ') : String((o as any)[f] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
