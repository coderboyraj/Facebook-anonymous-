import { ThemeConfig } from '../types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  brandName: 'StoryViewer Pro',
  logoIcon: 'eye',
  tagline: 'Anonymous Public Social Story & Profile Viewer',
  heroHeading: 'View Public Facebook Stories Anonymously',
  heroSubheading: 'Watch public stories, view posts, and download HD media without logging in. Fast, private, and 100% untraceable.',
  searchPlaceholder: 'Enter Facebook username or profile URL (e.g. natgeo, meta)...',
  preset: 'facebook',
  primaryColor: '#1877F2', // Facebook Blue
  darkMode: false,
  cardRadius: 'rounded-2xl',
  showDownloadBtn: true,
  showViewerCount: true,
  showFaq: true,
  showFeatures: true,
  storySpeedSeconds: 5,
  platformMode: 'facebook',
  backendMode: 'built_in_engine',
  customApiEndpoint: '',
  customApiKey: '',
  faqs: [
    {
      q: 'Do I need a Facebook account or need to log in to view stories?',
      a: 'No! You do not need to register, provide credentials, or log into Facebook. Our viewer works on public profiles without leaving any viewer history or footprint.'
    },
    {
      q: 'Will the account owner know I viewed their story?',
      a: 'No. The owner will never see your name, profile, or IP in their viewers list. The request is processed anonymously through our server proxies.'
    },
    {
      q: 'Can I view private accounts or locked profiles?',
      a: 'No. In adherence to privacy standards, this tool only accesses public creator pages, public verified figures, and open public profiles. Private accounts are protected and cannot be viewed.'
    },
    {
      q: 'Can I download stories, reels, and photos in high resolution?',
      a: 'Yes! Simply click the Download button on any active story or post to save the high-resolution media directly to your device.'
    },
    {
      q: 'How can I connect my own backend scraper server?',
      a: 'Click "Backend Engine" in the top bar or inside "Customize UI". You can plug in your own custom API URL (Node.js/Python microservice) or use our built-in high-speed engine.'
    }
  ]
};

const STORAGE_KEY = 'social_story_viewer_theme_config_v1';

export function loadSavedConfig(): ThemeConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_THEME_CONFIG, ...parsed };
    }
  } catch {
    // ignore JSON error
  }
  return DEFAULT_THEME_CONFIG;
}

export function saveConfig(config: ThemeConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function resetConfig(): ThemeConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_THEME_CONFIG;
}
