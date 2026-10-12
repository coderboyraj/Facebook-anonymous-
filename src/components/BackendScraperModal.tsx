import React, { useState } from 'react';
import { X, Copy, Check, Server, Terminal, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { BACKEND_SCRAPER_SCRIPTS } from '../services/scraperService';

interface BackendScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomApiMode: () => void;
}

export const BackendScraperModal: React.FC<BackendScraperModalProps> = ({
  isOpen,
  onClose,
  onSelectCustomApiMode,
}) => {
  const [selectedLang, setSelectedLang] = useState<'nodejs' | 'python'>('nodejs');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = BACKEND_SCRAPER_SCRIPTS[selectedLang];

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Self-Hosted Backend Scraping Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deploy your own standalone microservice to scrape public profile data & stories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Architecture Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs mb-1">
                <Cpu className="w-4 h-4" />
                <span>1. Headless Browser</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Uses Puppeteer or Playwright to resolve public Facebook pages and bypass client-side DOM rendering.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
                <Terminal className="w-4 h-4" />
                <span>2. JSON Data Extraction</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Extracts OpenGraph tags, profile avatar, follower metrics, and public 24-hour story media links.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
                <Server className="w-4 h-4" />
                <span>3. Connect to this UI</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paste your deployed server endpoint into the "Customize UI" &gt; "Backend Engine" setting to feed live data.
              </p>
            </div>
          </div>

          {/* Compliance & Anti-Bot Notice */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Production Deployment Note:</span>
              Facebook implements strict IP rate limits and Cloudflare/Akamai bot detection. When running your backend scraper in production, rotate residential proxies or use official Meta Graph API endpoints for public verified pages to prevent CAPTCHAs.
            </div>
          </div>

          {/* Code Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => setSelectedLang('nodejs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedLang === 'nodejs'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Node.js (Puppeteer + Express)
                </button>
                <button
                  onClick={() => setSelectedLang('python')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedLang === 'python'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Python (FastAPI + Playwright)
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied code!' : 'Copy Template Code'}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[12px] text-slate-300">
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-slate-400 text-[11px]">
                <span>{selectedLang === 'nodejs' ? 'server.js' : 'scraper_service.py'}</span>
                <span>Ready to deploy on VPS / Railway / Render</span>
              </div>
              <pre className="p-4 overflow-x-auto max-h-[280px] leading-relaxed text-slate-200">
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Once running, copy your server URL to the API config.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSelectCustomApiMode();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <span>Configure Custom API in Drawer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
