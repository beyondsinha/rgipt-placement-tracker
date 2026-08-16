'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { demoOffers } from '@/lib/data';
import { Offer } from '@/lib/types';

interface OffersContextType {
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  googleSheetUrl: string;
  setGoogleSheetUrl: (url: string) => void;
  syncFromGoogleSheet: (url?: string) => Promise<boolean>;
  resetToDefault: () => void;
  isLoading: boolean;
  lastUpdated: string;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

const LOCAL_STORAGE_OFFERS_KEY = 'rgipt_placement_offers_v2';
const LOCAL_STORAGE_SHEET_URL_KEY = 'rgipt_google_sheet_url_v2';
const LOCAL_STORAGE_LAST_UPDATED_KEY = 'rgipt_last_updated_v2';

// Optional Vercel environment variable for Google Sheet URL
const ENV_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || '';

export function OffersProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [googleSheetUrl, setGoogleSheetUrlState] = useState<string>(ENV_SHEET_URL);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Default Dataset');

  // Helper to parse CSV data into Offer objects
  const parseCsvOffers = (csvText: string): Offer[] => {
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return (parsed.data as any[]).map((x, i) => ({
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
      ctc: x.ctc ? String(x.ctc).trim() : null,
      stipend: x.stipend && !isNaN(Number(x.stipend)) ? Number(x.stipend) : null,
      location: x.location || 'India',
      studentsSelected:
        String(x.studentsSelected || '').trim().toLowerCase() === 'process pending'
          ? 'Process Pending'
          : !isNaN(Number(x.studentsSelected))
            ? Number(x.studentsSelected)
            : 0,
      notes: x.notes || ''
    }));
  };

  // Sync data from Google Sheet CSV URL
  const syncFromGoogleSheet = async (urlToFetch?: string): Promise<boolean> => {
    const targetUrl = urlToFetch || googleSheetUrl || ENV_SHEET_URL;
    if (!targetUrl || !targetUrl.trim()) return false;

    setIsLoading(true);
    try {
      let csvUrl = targetUrl.trim();
      if (csvUrl.includes('docs.google.com/spreadsheets') && !csvUrl.includes('output=csv') && !csvUrl.includes('export?format=csv')) {
        if (csvUrl.includes('/pubhtml')) {
          csvUrl = csvUrl.replace('/pubhtml', '/pub?output=csv');
        } else if (csvUrl.includes('/edit')) {
          csvUrl = csvUrl.replace(/\/edit.*$/, '/export?format=csv');
        }
      }

      const response = await fetch(csvUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('Network error fetching Google Sheet');
      
      const csvText = await response.text();
      const freshOffers = parseCsvOffers(csvText);

      if (freshOffers.length > 0) {
        setOffers(freshOffers);
        const updateTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
        setLastUpdated(`Google Sheet Auto-Synced at ${updateTime}`);
        
        localStorage.setItem(LOCAL_STORAGE_OFFERS_KEY, JSON.stringify(freshOffers));
        localStorage.setItem(LOCAL_STORAGE_LAST_UPDATED_KEY, `Google Sheet Auto-Synced at ${updateTime}`);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Error fetching Google Sheet CSV:', err);
    }
    setIsLoading(false);
    return false;
  };

  const setGoogleSheetUrl = (url: string) => {
    setGoogleSheetUrlState(url);
    localStorage.setItem(LOCAL_STORAGE_SHEET_URL_KEY, url);
    if (url) {
      syncFromGoogleSheet(url);
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_OFFERS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SHEET_URL_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LAST_UPDATED_KEY);
    setOffers(demoOffers);
    setGoogleSheetUrlState(ENV_SHEET_URL);
    setLastUpdated('Default Dataset');
  };

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedSheetUrl =
          localStorage.getItem(LOCAL_STORAGE_SHEET_URL_KEY) || ENV_SHEET_URL;

        if (savedSheetUrl) {
          setGoogleSheetUrlState(savedSheetUrl);
          await syncFromGoogleSheet(savedSheetUrl);
        } else {
          const savedOffers = localStorage.getItem(LOCAL_STORAGE_OFFERS_KEY);
          const savedLastUpdated = localStorage.getItem(LOCAL_STORAGE_LAST_UPDATED_KEY);

          if (savedOffers) {
            setOffers(JSON.parse(savedOffers));
            setLastUpdated(savedLastUpdated || 'Custom Local Dataset');
          }
        }
      } catch (e) {
        console.error('Failed to load storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const updateOffersAndStorage = (action: React.SetStateAction<Offer[]>) => {
    setOffers((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      localStorage.setItem(LOCAL_STORAGE_OFFERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <OffersContext.Provider
      value={{
        offers,
        setOffers: updateOffersAndStorage,
        googleSheetUrl,
        setGoogleSheetUrl,
        syncFromGoogleSheet,
        resetToDefault,
        isLoading,
        lastUpdated
      }}
    >
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
}
