import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  RotateCcw, 
  Save, 
  Type, 
  Server, 
  Sliders, 
  Check, 
  Eye, 
  Sparkles, 
  Globe, 
  Shield, 
  Flame, 
  Moon, 
  Sun,
  Code
} from 'lucide-react';
import { ThemeConfig, ThemePreset } from '../types';
import { resetConfig, DEFAULT_THEME_CONFIG } from '../data/defaultConfig';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ThemeConfig;
  onSave: (newConfig: ThemeConfig) => void;
  onOpenBackendGuide: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onOpenBackendGuide,
}) => {
  const [draft, setDraft] = useState<ThemeConfig>(config);
  const [activeTab, setActiveTab] = useState<'branding' | 'styling' | 'features' | 'backend'>('branding');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync draft whenever config or drawer opens
  React.useEffect(() => {
    setDraft(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: ThemePreset) => {
    let primary = '#1877F2';
    let dark = false;

    if (preset === 'facebook') {
      primary = '#1877F2';
      dark = false;
    } else if (preset === 'dark') {
      primary = '#06b6d4';
      dark = true;
    } else if (preset === 'emerald') {
      primary = '#059669';
      dark = false;
    } else if (preset === 'sunset') {
      primary = '#ea580c';
      dark = false;
    } else if (preset === 'purple') {
      primary = '#8b5cf6';
      dark = false;
    } else if (preset === 'midnight') {
      primary = '#38bdf8';
      dark = true;
    }

    setDraft((prev) => ({
      ...prev,
      preset,
      primaryColor: primary,
      darkMode: dark,
    }));
  };

  const handleSave = () => {
    onSave(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleReset = () => {
    const def = resetConfig();
    setDraft(def);
    onSave(def);
  };

  const logoIcons = [
    { id: 'eye', label: 'Eye', Icon: Eye },
    { id: 'sparkles', label: 'Sparkles', Icon: Sparkles },
    { id: 'globe', label: 'Globe', Icon: Globe },
    { id: 'shield', label: 'Shield', Icon: Shield },
    { id: 'flame', label: 'Flame', Icon: Flame },
  ];

  const presets: { id: ThemePreset; name: string; bg: string; text: string; color: string }[] = [
    { id: 'facebook', name: 'Facebook Classic', bg: 'bg-blue-600', text: 'text-white', color: '#1877F2' },
    { id: 'dark', name: 'Dark Stealth', bg: 'bg-slate-900', text: 'text-cyan-400', color: '#06b6d4' },
    { id: 'emerald', name: 'Emerald Clean', bg: 'bg-emerald-600', text: 'text-white', color: '#059669' },
    { id: 'sunset', name: 'Sunset Glow', bg: 'bg-amber-600', text: 'text-white', color: '#ea580c' },
    { id: 'purple', name: 'Cyber Violet', bg: 'bg-purple-600', text: 'text-white', color: '#8b5cf6' },
    { id: 'midnight', name: 'Midnight OLED', bg: 'bg-black', text: 'text-sky-400', color: '#38bdf8' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Customize Interface</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly re-skin branding, colors, backend & layout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-3 bg-slate-100/60 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'branding'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Branding & Text</span>
          </button>

          <button
            onClick={() => setActiveTab('styling')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'styling'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes & Colors</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'features'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Controls & Player</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'backend'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Backend Engine</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  App Name / Brand
                </label>
                <input
                  type="text"
                  value={draft.brandName}
                  onChange={(e) => setDraft({ ...draft, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. FacebookStoryViewer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Brand Logo Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {logoIcons.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setDraft({ ...draft, logoIcon: id as ThemeConfig['logoIcon'] })}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                        draft.logoIcon === id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Tagline (Small Header)
                </label>
                <input
                  type="text"
                  value={draft.tagline}
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 100% Anonymous Social Viewer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={draft.heroHeading}
                  onChange={(e) => setDraft({ ...draft, heroHeading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={draft.heroSubheading}
                  onChange={(e) => setDraft({ ...draft, heroSubheading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Search Bar Placeholder
                </label>
                <input
                  type="text"
                  value={draft.searchPlaceholder}
                  onChange={(e) => setDraft({ ...draft, searchPlaceholder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: STYLING & COLORS */}
          {activeTab === 'styling' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Theme Presets
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        draft.preset === p.id
                          ? 'border-blue-600 ring-2 ring-blue-500/30 bg-slate-50 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-xs font-semibold">{p.name}</span>
                      </div>
                      {draft.preset === p.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Custom Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.primaryColor}
                    onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={draft.primaryColor}
                    onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  {draft.darkMode ? (
                    <Moon className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <span className="text-sm font-semibold block">Dark Mode</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      OLED night theme with soft contrast
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.darkMode}
                  onChange={(e) => setDraft({ ...draft, darkMode: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Card Corner Radius
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'rounded-lg', label: 'Small' },
                    { id: 'rounded-xl', label: 'Medium' },
                    { id: 'rounded-2xl', label: 'Large' },
                    { id: 'rounded-3xl', label: 'Full' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setDraft({ ...draft, cardRadius: r.id as ThemeConfig['cardRadius'] })}
                      className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                        draft.cardRadius === r.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & STORY PLAYER */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Story Auto-Slide Delay: {draft.storySpeedSeconds}s
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={draft.storySpeedSeconds}
                  onChange={(e) => setDraft({ ...draft, storySpeedSeconds: Number(e.target.value) })}
                  className="w-full cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Fast (3s)</span>
                  <span>Standard (5s)</span>
                  <span>Relaxed (12s)</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold">Enable HD Media Downloads</span>
                  <input
                    type="checkbox"
                    checked={draft.showDownloadBtn}
                    onChange={(e) => setDraft({ ...draft, showDownloadBtn: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold">Display Public View Counters</span>
                  <input
                    type="checkbox"
                    checked={draft.showViewerCount}
                    onChange={(e) => setDraft({ ...draft, showViewerCount: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold">Show "How It Works" Feature Badges</span>
                  <input
                    type="checkbox"
                    checked={draft.showFeatures}
                    onChange={(e) => setDraft({ ...draft, showFeatures: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-semibold">Show FAQ Accordion Section</span>
                  <input
                    type="checkbox"
                    checked={draft.showFaq}
                    onChange={(e) => setDraft({ ...draft, showFaq: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: BACKEND SCRAPING ENGINE */}
          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                <strong>Backend Data System:</strong> You can use our instant built-in public profile engine or connect your own self-hosted scraping proxy server (Node.js/Python) to extract live data.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Scraping Engine Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDraft({ ...draft, backendMode: 'built_in_engine' })}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                      draft.backendMode === 'built_in_engine'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🚀 Built-in Public Engine
                  </button>

                  <button
                    onClick={() => setDraft({ ...draft, backendMode: 'custom_api' })}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                      draft.backendMode === 'custom_api'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🔌 Custom API Endpoint
                  </button>
                </div>
              </div>

              {draft.backendMode === 'custom_api' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Scraper API URL (POST /api/scrape-public)
                    </label>
                    <input
                      type="url"
                      value={draft.customApiEndpoint}
                      onChange={(e) => setDraft({ ...draft, customApiEndpoint: e.target.value })}
                      placeholder="https://your-scraper-server.com/api/scrape-public"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      API Authorization Bearer Token (Optional)
                    </label>
                    <input
                      type="password"
                      value={draft.customApiKey}
                      onChange={(e) => setDraft({ ...draft, customApiKey: e.target.value })}
                      placeholder="Bearer token or API Secret"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onOpenBackendGuide}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>View Self-Hosted Backend Code & Guide</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              style={{ backgroundColor: draft.primaryColor }}
            >
              {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedNotice ? 'Applied & Saved!' : 'Apply Changes'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
