import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
  onProgress: (progress: number) => void;
}

// Helper to detect and convert YouTube URLs
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/embed\/)([^/?]+)/,
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^/?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const VideoPlayer = ({ videoUrl, onComplete, onProgress }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const youtubeId = getYouTubeId(videoUrl);
  const isYouTube = !!youtubeId;

  // For YouTube videos, track progress via interval
  useEffect(() => {
    if (!isYouTube) return;
    
    // Simulate progress for YouTube (since we can't access YouTube player API without SDK)
    // Mark as started when component mounts
    const estimatedDuration = 300; // 5 minutes default
    setDuration(estimatedDuration);
    
    let progressInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      progressInterval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const progress = (newTime / estimatedDuration) * 100;
          onProgress(Math.min(progress, 100));
          
          if (progress >= 90 && !hasCompleted) {
            setHasCompleted(true);
            onComplete();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isYouTube, isPlaying, hasCompleted, onComplete, onProgress]);

  // For native video
  useEffect(() => {
    if (isYouTube) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress(progress);

      if (progress >= 90 && !hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete, onProgress, hasCompleted, isYouTube]);

  const togglePlay = useCallback(() => {
    if (isYouTube) {
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isYouTube]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (isYouTube) {
      setCurrentTime(0);
      return;
    }
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleFullscreen = () => {
    const element = isYouTube ? iframeRef.current : videoRef.current;
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube embed URL with autoplay when playing
  const youtubeEmbedUrl = youtubeId 
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`
    : '';

  return (
    <div className="group relative overflow-hidden rounded-xl bg-foreground/5">
      {isYouTube ? (
        <>
          <iframe
            ref={iframeRef}
            src={youtubeEmbedUrl}
            className="aspect-video w-full bg-foreground/10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Play overlay for YouTube */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-foreground/20 transition-opacity"
              onClick={togglePlay}
            >
              <div className="rounded-full bg-primary p-5 shadow-lg transition-transform hover:scale-110">
                <Play className="h-10 w-10 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="aspect-video w-full bg-foreground/10"
            onClick={togglePlay}
          />
          {/* Play overlay when paused */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-foreground/20 transition-opacity"
              onClick={togglePlay}
            >
              <div className="rounded-full bg-primary p-5 shadow-lg transition-transform hover:scale-110">
                <Play className="h-10 w-10 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
          )}
        </>
      )}

      {/* Controls - only show for native video */}
      {!isYouTube && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-3"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5" fill="currentColor" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span className="ml-2 text-sm text-primary-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
