import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ThemeConfig } from '../types';

interface FooterProps {
  config: ThemeConfig;
  onOpenCustomizer: () => void;
  onOpenBackendGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenCustomizer,
  onOpenBackendGuide,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: config.primaryColor }}
            />
            <span>{config.brandName}</span>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed">
            Independent public social media previewer tool. Not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. or Facebook.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <button
            onClick={onOpenCustomizer}
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer transition"
          >
            Customize Interface
          </button>
          <span>&bull;</span>
          <button
            onClick={onOpenBackendGuide}
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer transition"
          >
            Backend Architecture
          </button>
          <span>&bull;</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Data Only</span>
          </span>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <p>&copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.</p>
        <p>Built for anonymous public content viewing.</p>
      </div>
    </footer>
  );
};
