import React from 'react';
import { Search, PlayCircle, DownloadCloud, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface HowItWorksProps {
  config: ThemeConfig;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ config }) => {
  const steps = [
    {
      num: '01',
      title: 'Enter Public Username or URL',
      desc: 'Type in any public Facebook handle (e.g. meta, natgeo) or paste the complete profile link into the search bar.',
      icon: Search,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
    },
    {
      num: '02',
      title: 'Watch Stories Anonymously',
      desc: 'Browse current 24-hour stories and public reels. You do not need to log in, and the user will never see your name on the viewer list.',
      icon: PlayCircle,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30',
    },
    {
      num: '03',
      title: 'Save & Download Media in HD',
      desc: 'Download high-definition photos, video frames, and stories straight to your phone or computer with a single tap.',
      icon: DownloadCloud,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
    },
  ];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          How to View Stories Without Login
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Our cloud proxy stream fetches publicly accessible metadata with zero authentication barriers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${config.cardRadius}`}
            >
              <span className="text-4xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-4 select-none">
                {step.num}
              </span>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${step.color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
