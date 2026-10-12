import React, { useState } from 'react';
import { 
  Play, Download, ExternalLink, ShieldCheck, Heart, MessageCircle, 
  Share2, Eye, Sparkles, CheckCircle2, Clock, Info, Layers, Image as ImageIcon, Film, Video
} from 'lucide-react';
import { PublicProfile, ThemeConfig, Story, Reel } from '../types';

interface ProfileViewProps {
  profile: PublicProfile;
  config: ThemeConfig;
  onOpenStory: (index?: number) => void;
  logs: Array<{ timestamp: string; stage: string; message: string }>;
  source?: string;
  executionTimeMs?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  config,
  onOpenStory,
  logs,
  source = 'built_in_engine',
  executionTimeMs = 0,
}) => {
  const isInstagram = profile.platform === 'instagram' || config.platformMode === 'instagram';
  const defaultTab = profile.stories.length > 0 ? 'stories' : (profile.reels && profile.reels.length > 0 ? 'reels' : 'posts');
  const [activeTab, setActiveTab] = useState<'stories' | 'reels' | 'posts' | 'highlights' | 'logs'>(defaultTab);

  const firstStory = profile.stories[0];
  const firstStoryIsVideo = firstStory?.mediaType === 'video';
  const firstStoryCleanName = (profile.displayName || profile.username || 'story').replace(/[^a-zA-Z0-9_-]/g, '_');
  const firstStoryFilename = `${firstStoryCleanName}_story.${firstStoryIsVideo ? 'mp4' : 'jpg'}`;
  const firstStoryDownloadUrl = firstStory
    ? `/api/proxy-media?download=true&filename=${encodeURIComponent(firstStoryFilename)}&url=${encodeURIComponent(firstStory.mediaUrl)}`
    : '#';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      
      {/* Profile Container Card */}
      <div className={`bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden ${config.cardRadius}`}>
        
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-56 md:h-64 bg-slate-800 overflow-hidden">
          <img
            src={profile.coverUrl}
            alt="Profile cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top Anonymous Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anonymous Viewer Active</span>
          </div>

          {/* Platform Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-lg">
            <span>{isInstagram ? 'Instagram Profile' : 'Facebook Profile'}</span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="relative px-6 pb-6 pt-0 sm:pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            
            {/* Avatar & Display Name */}
            <div className="flex items-end gap-4">
              <div 
                className="relative cursor-pointer group"
                onClick={() => profile.stories.length > 0 && onOpenStory(0)}
                title={profile.stories.length > 0 ? "Click to view active stories" : ""}
              >
                {/* Story Gradient Ring */}
                <div 
                  className={`p-1 rounded-full ${isInstagram ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' : 'bg-gradient-to-tr from-blue-500 to-indigo-600'} shadow-xl ${profile.stories.length > 0 ? 'group-hover:scale-105 transition-transform' : ''}`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900"
                  />
                </div>
                
                {/* Active story icon badge */}
                {profile.stories.length > 0 && (
                  <span 
                    className="absolute bottom-1 right-1 p-1.5 rounded-full text-white shadow-md text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: isInstagram ? '#E1306C' : config.primaryColor }}
                  >
                    <Play className="w-3 h-3 fill-white" />
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div className="pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {profile.displayName}
                  </h2>
                  {profile.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500 text-white shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">@{profile.username}</span>
                  <span>&bull;</span>
                  <span>{profile.category}</span>
                </div>
              </div>
            </div>

            {/* Watch Story & Direct Outside Download Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {profile.stories.length > 0 && (
                <button
                  onClick={() => onOpenStory(0)}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer shrink-0 ${isInstagram ? 'bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Story ({profile.stories.length})</span>
                </button>
              )}

              {/* External prominent download button right outside on profile */}
              {firstStory && (
                <a
                  href={firstStoryDownloadUrl}
                  download={firstStoryFilename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Story {firstStoryIsVideo ? 'Video (.mp4)' : 'Photo (.jpg)'}</span>
                </a>
              )}

              {(profile.directStoryUrl || profile.directFacebookUrl) && (
                <a
                  href={profile.directStoryUrl || profile.directFacebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on {isInstagram ? 'Instagram' : 'Facebook'}</span>
                </a>
              )}
            </div>

          </div>

          {/* Bio text */}
          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mt-2">
            {profile.bio}
          </p>

          {/* Links & Metrics Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.followers}</span>{' '}
                <span>Followers</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.following}</span>{' '}
                <span>Following</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.stories.length}</span>{' '}
                <span>Stories</span>
              </div>
              {profile.reels && profile.reels.length > 0 && (
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.reels.length}</span>{' '}
                  <span>Reels</span>
                </div>
              )}
            </div>

            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
          </div>

        </div>

        {/* Tab navigation within profile */}
        <div className="flex border-t border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'stories'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Stories ({profile.stories.length})</span>
          </button>

          {profile.reels && profile.reels.length > 0 && (
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'reels'
                  ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Reels ({profile.reels.length})</span>
            </button>
          )}

          {profile.highlights && profile.highlights.length > 0 && (
            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === 'highlights'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Highlights ({profile.highlights.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isInstagram ? `Posts (${profile.posts.length})` : 'Timeline & Posts'}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>
        </div>

        {/* Tab 1: Stories Grid with Prominent Download Buttons */}
        {activeTab === 'stories' && (
          <div className="p-6">
            {profile.stories.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm">No active 24-hour stories found for this profile right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.stories.map((story, idx) => {
                  const isVid = story.mediaType === 'video';
                  const cleanProfile = (profile.displayName || profile.username || 'story').replace(/[^a-zA-Z0-9_-]/g, '_');
                  const filename = `${cleanProfile}_story_${idx + 1}.${isVid ? 'mp4' : 'jpg'}`;
                  const dlUrl = `/api/proxy-media?download=true&filename=${encodeURIComponent(filename)}&url=${encodeURIComponent(story.mediaUrl)}`;

                  return (
                    <div
                      key={story.id}
                      className="group relative rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col"
                    >
                      <div 
                        className="relative aspect-[9/16] cursor-pointer overflow-hidden"
                        onClick={() => onOpenStory(idx)}
                      >
                        {isVid ? (
                          <video
                            src={story.mediaUrl}
                            poster={story.thumbnailUrl}
                            muted
                            playsInline
                            loop
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <img
                            src={story.thumbnailUrl || story.mediaUrl}
                            alt={`Story ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Top timestamp and type badge */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
                          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-semibold">
                            {story.timestamp}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-sm text-[10px] font-bold">
                            {isVid ? 'VIDEO' : 'PHOTO'}
                          </span>
                        </div>

                        {/* Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <div className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white">
                            <Play className="w-6 h-6 fill-white" />
                          </div>
                        </div>
                      </div>

                      {/* Prominent Direct Download Button Outside Card */}
                      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onOpenStory(idx)}
                          className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </button>

                        <a
                          href={dlUrl}
                          download={filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download {isVid ? 'Video' : 'Photo'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Reels (Instagram Mode) */}
        {activeTab === 'reels' && profile.reels && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {profile.reels.map((reel) => {
                const cleanProfile = (profile.displayName || profile.username || 'reel').replace(/[^a-zA-Z0-9_-]/g, '_');
                const filename = `${cleanProfile}_reel_${reel.id}.mp4`;
                const dlUrl = `/api/proxy-media?download=true&filename=${encodeURIComponent(filename)}&url=${encodeURIComponent(reel.mediaUrl)}`;

                return (
                  <div
                    key={reel.id}
                    className="rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col"
                  >
                    <div className="relative aspect-[9/16] bg-black overflow-hidden">
                      <video
                        src={reel.mediaUrl}
                        poster={reel.thumbnailUrl}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-bold">
                        REEL
                      </span>
                    </div>

                    <div className="p-3.5 bg-white dark:bg-slate-900 flex flex-col justify-between flex-1 space-y-3">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                        {reel.caption}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3 text-blue-500" />
                          <span>{reel.viewsCount.toLocaleString()} views</span>
                        </div>

                        <a
                          href={dlUrl}
                          download={filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white text-xs font-bold transition shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Reel</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Highlights */}
        {activeTab === 'highlights' && profile.highlights && (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {profile.highlights.map((h) => (
                <div
                  key={h.id}
                  onClick={() => onOpenStory(0)}
                  className="flex flex-col items-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer text-center group"
                >
                  <div className="w-20 h-20 rounded-full p-1 border-2 border-slate-300 dark:border-slate-700 group-hover:border-rose-500 transition mb-2 overflow-hidden">
                    <img
                      src={h.coverUrl}
                      alt={h.title}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate w-full">
                    {h.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{h.storiesCount} stories</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timeline & Posts */}
        {activeTab === 'posts' && (
          <div className="p-6 space-y-6">
            {isInstagram && profile.posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {profile.posts.map((post) => {
                  const cleanProfile = (profile.displayName || profile.username || 'post').replace(/[^a-zA-Z0-9_-]/g, '_');
                  const filename = `${cleanProfile}_post_${post.id}.jpg`;
                  const dlUrl = post.mediaUrl
                    ? `/api/proxy-media?download=true&filename=${encodeURIComponent(filename)}&url=${encodeURIComponent(post.mediaUrl)}`
                    : '#';

                  return (
                    <div
                      key={post.id}
                      className="rounded-2xl overflow-hidden shadow-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col"
                    >
                      {post.mediaUrl && (
                        <div className="relative aspect-square overflow-hidden bg-slate-950">
                          <img
                            src={post.mediaUrl}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3">
                          {post.text}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1 text-rose-500 font-semibold">
                            <Heart className="w-3.5 h-3.5 fill-rose-500" />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>

                          {post.mediaUrl && (
                            <a
                              href={dlUrl}
                              download={filename}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download HD</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Live Facebook Timeline</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-semibold">Official Embed</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Viewing live feed for <strong>{profile.displayName}</strong> (@{profile.username})
                    </p>
                  </div>

                  {profile.directFacebookUrl && (
                    <a
                      href={profile.directFacebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Profile on Facebook</span>
                    </a>
                  )}
                </div>

                {/* Embedded Timeline Widget */}
                <div className="w-full flex justify-center py-4 bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <iframe
                    src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(profile.directFacebookUrl || `https://facebook.com/${profile.username}`)}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                    width="500"
                    height="500"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="rounded-lg max-w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Scraper Audit Logs */}
        {activeTab === 'logs' && (
          <div className="p-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span>Extraction Engine: <strong className="text-blue-400">{source}</strong></span>
                <span>Latency: <strong className="text-emerald-400">{executionTimeMs}ms</strong></span>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 text-slate-300">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className="text-blue-400 font-bold shrink-0">{log.stage}:</span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
