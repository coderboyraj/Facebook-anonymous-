import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ThemeConfig } from '../types';

interface FAQSectionProps {
  config: ThemeConfig;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ config }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!config.showFaq || !config.faqs || config.faqs.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need to Know
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Learn how our anonymous public viewer works and stays 100% private.
        </p>
      </div>

      <div className="space-y-3">
        {config.faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'border-blue-400/50 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4.5 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
