import React, { useState, useMemo } from 'react';
import { Search, Loader2, Sparkles, ShieldCheck, Download, Zap, Lock, Terminal, X, Link as LinkIcon, CheckCircle2, Instagram, Facebook } from 'lucide-react';
import { ThemeConfig, PlatformMode } from '../types';
import { parseFacebookTarget } from '../data/mockProfiles';

interface HeroProps {
  config: ThemeConfig;
  onSearch: (query: string) => void;
  isLoading: boolean;
  statusMessage?: string;
  onSelectSample: (handle: string) => void;
  onToggleMode: (mode: PlatformMode) => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onSearch,
  isLoading,
  statusMessage,
  onSelectSample,
  onToggleMode,
}) => {
  const [inputVal, setInputVal] = useState('');
  const isInstagram = config.platformMode === 'instagram';

  // Live parsed preview as user types or pastes
  const livePreview = useMemo(() => {
    if (!inputVal.trim()) return null;
    return parseFacebookTarget(inputVal);
  }, [inputVal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal.trim());
  };

  const placeholderText = isInstagram
    ? 'Enter Instagram username or link (e.g. @cristiano, virat.kohli, aliaabhatt)...'
    : 'Enter Facebook profile URL or ID (e.g. m.facebook.com/profile.php?id=...)...';

  return (
    <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Decorative background blur */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 dark:opacity-20 blur-3xl pointer-events-none -z-10"
        style={{ backgroundColor: isInstagram ? '#E1306C' : config.primaryColor }}
      />

      {/* Platform Mode Switcher Pill */}
      <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
        <button
          type="button"
          onClick={() => onToggleMode('facebook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !isInstagram
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook Mode</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleMode('instagram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isInstagram
              ? 'bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram Mode (Stories, Reels, Posts)</span>
        </button>
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
        {isInstagram
          ? 'View & Download Instagram Stories, Reels & Posts'
          : 'View & Download Facebook Stories Anonymously'}
      </h1>

      {/* Hero Subtitle */}
      <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        {isInstagram
          ? 'Watch stories, highlights, public posts, and reels anonymously. Direct 1-click HD downloads.'
          : 'Watch public stories and download video media directly to your device storage without logging in.'}
      </p>

      {/* Search Input Box */}
      <div className="mt-8 max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className={`relative flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 focus-within:ring-4 ${isInstagram ? 'focus-within:ring-rose-500/20' : 'focus-within:ring-blue-500/20'} transition-all ${config.cardRadius}`}
        >
          <div className="pl-3 text-slate-400">
            {inputVal.startsWith('http') ? (
              <LinkIcon className={`w-5 h-5 ${isInstagram ? 'text-rose-500' : 'text-blue-500'}`} />
            ) : isInstagram ? (
              <Instagram className="w-5 h-5 text-rose-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={placeholderText}
            disabled={isLoading}
            className="w-full px-3 py-3 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {inputVal && !isLoading && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 mr-2 cursor-pointer transition"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition disabled:opacity-60 cursor-pointer shrink-0 ${isInstagram ? 'bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <span>{isInstagram ? 'View Instagram' : 'View Stories'}</span>
            )}
          </button>
        </form>

        {/* Live URL / Handle Target Detector Pill */}
        {livePreview && !isLoading && !isInstagram && (
          <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Target: <strong>@{livePreview.handle}</strong> ({livePreview.displayName})</span>
            </span>
          </div>
        )}

        {/* Loading Pipeline Status Badge */}
        {isLoading && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 animate-pulse font-mono shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
            <span>{statusMessage || 'Resolving public profile...'}</span>
          </div>
        )}

        {/* Link formats supported helper */}
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {isInstagram ? (
            <span>Paste any username or link: <code>@username</code>, <code>instagram.com/username</code>, reels, or stories link</span>
          ) : (
            <span>Paste any link: <code>m.facebook.com/profile.php?id=...</code>, <code>facebook.com/username</code> or story link</span>
          )}
        </div>
      </div>

      {/* Value Proposition Pills */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">100% Anonymous</div>
            <div className="text-[11px] text-slate-500">Zero footprint</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Direct Storage Save</div>
            <div className="text-[11px] text-slate-500">Real MP4 & JPG files</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">No Login Ever</div>
            <div className="text-[11px] text-slate-500">No account needed</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center gap-3 shadow-xs">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Instant Extraction</div>
            <div className="text-[11px] text-slate-500">High speed CDN</div>
          </div>
        </div>
      </div>
    </section>
  );
};
