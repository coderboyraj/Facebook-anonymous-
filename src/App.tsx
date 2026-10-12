import { useState, useEffect, useRef } from 'react';
import { ThemeConfig, PublicProfile } from './types';
import { loadSavedConfig, saveConfig } from './data/defaultConfig';
import { lookupPublicProfile, ScrapingLog } from './services/scraperService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProfileView } from './components/ProfileView';
import { StoryPlayer } from './components/StoryPlayer';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { BackendScraperModal } from './components/BackendScraperModal';
import { HowItWorks } from './components/HowItWorks';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ThemeConfig>(loadSavedConfig);
  const [currentProfile, setCurrentProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [logs, setLogs] = useState<ScrapingLog[]>([]);
  const [lastSource, setLastSource] = useState('built_in_engine');
  const [executionTimeMs, setExecutionTimeMs] = useState(420);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isStoryPlayerOpen, setIsStoryPlayerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const profileSectionRef = useRef<HTMLDivElement | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (config.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.darkMode]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveConfig = (newConfig: ThemeConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setStatusMessage('Analyzing link and headers...');

    try {
      const result = await lookupPublicProfile(query, config, (_stage, message) => {
        setStatusMessage(message);
      });

      if (result.success && result.profile) {
        setCurrentProfile(result.profile);
        setLogs(result.logs);
        setLastSource(result.source);
        setExecutionTimeMs(result.executionTimeMs);

        showToast(`Extracted ${result.profile.stories.length} stories for @${result.profile.username}!`, 'success');

        // Smooth scroll directly to the profile view
        setTimeout(() => {
          profileSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // If user submitted a direct story link, automatically open story player
        if (result.parsedTarget?.isStoryLink && result.profile.stories.length > 0) {
          setActiveStoryIndex(0);
          setIsStoryPlayerOpen(true);
        }
      } else {
        showToast('Could not extract stories for this link. Ensure the profile is public.', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Extraction error';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const handleOpenStory = (index: number = 0) => {
    setActiveStoryIndex(index);
    setIsStoryPlayerOpen(true);
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${config.darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-in slide-in-from-top duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        config={config}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        onScrollToSearch={scrollToSearch}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section with Search Bar */}
        <Hero
          config={config}
          onSearch={handleSearch}
          isLoading={isLoading}
          statusMessage={statusMessage}
          onSelectSample={handleSearch}
          onToggleMode={(mode) => setConfig((prev) => ({ 
            ...prev, 
            platformMode: mode, 
            primaryColor: mode === 'instagram' ? '#E1306C' : '#1877F2' 
          }))}
        />

        {/* Extracted Profile & Story Reel View */}
        <div ref={profileSectionRef} id="profile-section" className="scroll-mt-20">
          {currentProfile && (
            <ProfileView
              profile={currentProfile}
              config={config}
              onOpenStory={handleOpenStory}
              logs={logs}
              source={lastSource}
              executionTimeMs={executionTimeMs}
            />
          )}
        </div>

        {/* How It Works Section */}
        {config.showFeatures && <HowItWorks config={config} />}

        {/* FAQ Section */}
        {config.showFaq && <FAQSection config={config} />}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onOpenBackendGuide={() => setIsBackendModalOpen(true)}
      />

      {/* Fullscreen Story Player */}
      {currentProfile && (
        <StoryPlayer
          profile={currentProfile}
          initialIndex={activeStoryIndex}
          isOpen={isStoryPlayerOpen}
          onClose={() => setIsStoryPlayerOpen(false)}
          speedSeconds={config.storySpeedSeconds}
          showDownloadBtn={config.showDownloadBtn}
          showViewerCount={config.showViewerCount}
        />
      )}

      {/* UI Customizer Slide-over Drawer */}
      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        onOpenBackendGuide={() => {
          setIsCustomizerOpen(false);
          setIsBackendModalOpen(true);
        }}
      />

      {/* Backend Scraper Documentation & Code Modal */}
      <BackendScraperModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onSelectCustomApiMode={() => {
          setIsCustomizerOpen(true);
        }}
      />

    </div>
  );
}
