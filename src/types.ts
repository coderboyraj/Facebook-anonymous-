export type PlatformMode = 'facebook' | 'instagram';

export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  timestamp: string; // e.g., '2h ago'
  duration: number; // in seconds
  caption?: string;
  viewsCount?: number;
  likesCount?: number;
  directUrl?: string;
}

export interface Post {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
  storiesCount: number;
}

export interface Reel {
  id: string;
  mediaUrl: string;
  thumbnailUrl: string;
  caption: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverUrl: string;
  bio: string;
  category: string;
  followers: string;
  following: string;
  verified: boolean;
  platform?: 'facebook' | 'instagram';
  website?: string;
  directFacebookUrl?: string;
  directStoryUrl?: string;
  stories: Story[];
  highlights?: Highlight[];
  posts: Post[];
  reels?: Reel[];
  isRealExtracted?: boolean;
}

export type ThemePreset = 'facebook' | 'dark' | 'emerald' | 'sunset' | 'purple' | 'midnight';

export interface ThemeConfig {
  brandName: string;
  logoIcon: 'eye' | 'sparkles' | 'globe' | 'shield' | 'flame';
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  searchPlaceholder: string;
  preset: ThemePreset;
  primaryColor: string; // Hex color
  darkMode: boolean;
  cardRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  showDownloadBtn: boolean;
  showViewerCount: boolean;
  showFaq: boolean;
  showFeatures: boolean;
  storySpeedSeconds: number;
  platformMode: PlatformMode;
  // Backend scraping config
  backendMode: 'built_in_engine' | 'custom_api';
  customApiEndpoint: string;
  customApiKey: string;
  facebookCookie?: string;
  faqs: Array<{ q: string; a: string }>;
}
