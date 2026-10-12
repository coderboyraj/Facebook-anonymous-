import React from 'react';
import { Eye, Sparkles, Globe, Shield, Flame, Palette, Server, Search } from 'lucide-react';
import { ThemeConfig } from '../types';

interface NavbarProps {
  config: ThemeConfig;
  onOpenCustomizer: () => void;
  onOpenBackendModal: () => void;
  onScrollToSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenCustomizer,
  onOpenBackendModal,
  onScrollToSearch,
}) => {
  const renderLogoIcon = () => {
    const props = { className: 'w-5 h-5 text-white' };
    switch (config.logoIcon) {
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'globe':
        return <Globe {...props} />;
      case 'shield':
        return <Shield {...props} />;
      case 'flame':
        return <Flame {...props} />;
      case 'eye':
      default:
        return <Eye {...props} />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: config.primaryColor }}
          >
            {renderLogoIcon()}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              {config.brandName}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              {config.tagline || 'Anonymous Story Viewer'}
            </span>
          </div>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          <button
            onClick={onScrollToSearch}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Profiles</span>
          </button>

          {/* Backend guide button */}
          <button
            onClick={onOpenBackendModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            title="Configure self-hosted scraper or view backend code"
          >
            <Server className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Backend Engine</span>
          </button>

          {/* Customizer trigger button */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:opacity-95 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            style={{ backgroundColor: config.primaryColor }}
            title="Customize interface branding, colors & controls"
          >
            <Palette className="w-4 h-4 animate-pulse" />
            <span>Customize UI</span>
          </button>

        </div>

      </div>
    </header>
  );
};
