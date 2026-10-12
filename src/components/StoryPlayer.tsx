import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Download, Share2, Volume2, VolumeX, Eye, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { Story, PublicProfile } from '../types';

interface StoryPlayerProps {
  profile: PublicProfile;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  speedSeconds?: number;
  showDownloadBtn?: boolean;
  showViewerCount?: boolean;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  profile,
  initialIndex = 0,
  isOpen,
  onClose,
  speedSeconds = 5,
  showDownloadBtn = true,
  showViewerCount = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stories = profile.stories || [];
  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, stories.length - 1));
  const currentStory: Story | undefined = stories[safeIndex];

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      progressRef.current = 0;
      setProgress(0);
      setIsPaused(false);
      lastTimeRef.current = null;
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
  }, [isOpen, initialIndex]);

  const goToNext = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    lastTimeRef.current = null;
    if (safeIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or restart if last story
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [safeIndex, stories.length]);

  const goToPrev = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    lastTimeRef.current = null;
    if (safeIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [safeIndex]);

  // Keybindings
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose, isPaused]);

  // Timer loop ONLY for photo stories (video stories track real video duration)
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    // If it's a video, progress is driven by onTimeUpdate of the video element
    if (currentStory.mediaType === 'video') {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    // Photo story timer
    const durationMs = (currentStory.duration || speedSeconds) * 1000;

    const updateTimer = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;
        progressRef.current += (delta / durationMs) * 100;

        if (progressRef.current >= 100) {
          progressRef.current = 0;
          setProgress(0);
          lastTimeRef.current = null;
          goToNext();
          return;
        }

        setProgress(progressRef.current);
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(updateTimer);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isOpen, isPaused, safeIndex, currentStory, speedSeconds, goToNext]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    } else {
      setIsPaused((p) => !p);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const handleVideoEnded = () => {
    if (safeIndex < stories.length - 1) {
      goToNext();
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const isVideo = currentStory?.mediaType === 'video';
  const cleanName = (profile.displayName || profile.username || 'story').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_story_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
  const downloadUrl = currentStory 
    ? `/api/proxy-media?download=true&filename=${encodeURIComponent(filename)}&url=${encodeURIComponent(currentStory.mediaUrl)}`
    : '#';

  const handleDownload = async () => {
    if (!currentStory || isDownloading) return;
    setIsDownloading(true);

    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 20000);
    } catch {
      // Direct stream download fallback
      window.location.assign(downloadUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !currentStory || stories.length === 0) return null;

  // Stream media safely through proxy to bypass hotlink restrictions
  const mediaSrc = currentStory.mediaUrl.startsWith('http')
    ? `/api/proxy-media?url=${encodeURIComponent(currentStory.mediaUrl)}`
    : currentStory.mediaUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        title="Close story viewer (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation chevrons (desktop) */}
      {safeIndex > 0 && (
        <button
          onClick={goToPrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {safeIndex < stories.length - 1 && (
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm md:max-w-md h-[92vh] max-h-[820px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10">
        
        {/* Story progress segments */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 flex gap-1.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width:
                    idx < safeIndex
                      ? '100%'
                      : idx === safeIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top User Bar */}
        <div className="absolute top-5 inset-x-0 z-30 px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm truncate max-w-[140px]">
                  {profile.displayName}
                </span>
                {profile.verified && (
                  <span className="bg-blue-500 text-white rounded-full p-0.5 inline-flex items-center justify-center text-[10px] w-3.5 h-3.5">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-white/70">{currentStory.timestamp}</span>
            </div>
          </div>

          {/* Action icons in top bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs transition cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>
            {currentStory.mediaType === 'video' && (
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs transition cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            {showDownloadBtn && (
              <a
                href={downloadUrl}
                download={filename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  handleDownload();
                }}
                className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition cursor-pointer shadow-md"
                title="Download to device storage"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Download className="w-4 h-4" />}
              </a>
            )}
            {(profile.directStoryUrl || profile.directFacebookUrl) && (
              <a
                href={profile.directStoryUrl || profile.directFacebookUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs transition cursor-pointer"
                title="Open directly on Facebook"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Story Media Viewer */}
        <div
          className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
          onClick={togglePlayPause}
        >
          {currentStory.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover select-none"
            />
          ) : (
            <img
              src={mediaSrc}
              alt="Story media"
              className="w-full h-full object-cover select-none"
            />
          )}

          {/* Pause overlay icon */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="p-4 rounded-full bg-black/60 text-white">
                <Play className="w-8 h-8 fill-white" />
              </div>
            </div>
          )}

          {/* Tap touch zones (left 30% prev, right 30% next) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-0 inset-y-0 w-1/4 z-20 cursor-w-resize"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-0 inset-y-0 w-1/4 z-20 cursor-e-resize"
          />
        </div>

        {/* Bottom Caption & Download Bar */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2">
          {currentStory.caption && (
            <p className="text-sm font-medium leading-snug drop-shadow-md text-white/95">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-600/80 text-[11px] font-semibold">
                {currentStory.mediaType === 'video' ? 'HD Video Story' : 'HD Photo Story'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition text-xs font-medium cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              {showDownloadBtn && (
                <a
                  href={downloadUrl}
                  download={filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    handleDownload();
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition text-xs font-semibold cursor-pointer shadow-md"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {currentStory.mediaType === 'video' ? 'Video (.mp4)' : 'Photo (.jpg)'}</span>
                    </>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
