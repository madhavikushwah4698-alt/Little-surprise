import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'dpOLoPmO9Pk';
const TARGET_VOLUME = 20;

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted?: () => boolean;
  getPlayerState?: () => number;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTNamespace {
  Player: new (
    elementId: string,
    options: {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
        onAutoplayBlocked?: () => void;
        onError?: () => void;
      };
    }
  ) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function BackgroundMusicPlayer() {
  const containerId = `bg-yt-${useId().replace(/:/g, '')}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const playerReadyRef = useRef(false);
  const hasStartedPlayingRef = useRef(false);
  const userPausedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const startPlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return false;
    try {
      player.unMute();
      player.setVolume(TARGET_VOLUME);
      player.playVideo();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let verifyTimer: number | null = null;

    const initPlayer = () => {
      if (cancelled || playerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(containerId, {
        width: 200,
        height: 200,
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            playerReadyRef.current = true;
            if (!userPausedRef.current) {
              event.target.unMute();
              event.target.setVolume(TARGET_VOLUME);
              event.target.playVideo();

              verifyTimer = window.setTimeout(() => {
                if (cancelled || userPausedRef.current) return;
                const playingCode = window.YT?.PlayerState?.PLAYING ?? 1;
                const state = event.target.getPlayerState?.();
                const muted = event.target.isMuted?.() ?? false;
                if (state === playingCode && !muted) {
                  hasStartedPlayingRef.current = true;
                  setIsPlaying(true);
                } else {
                  hasStartedPlayingRef.current = false;
                  setIsPlaying(false);
                }
              }, 450);
            }
          },
          onStateChange: (event) => {
            if (cancelled) return;
            const states = window.YT?.PlayerState;
            const playingState = states?.PLAYING ?? 1;
            const pausedState = states?.PAUSED ?? 2;
            const endedState = states?.ENDED ?? 0;

            if (event.data === playingState) {
              if (!userPausedRef.current) {
                event.target.unMute();
                event.target.setVolume(TARGET_VOLUME);
                hasStartedPlayingRef.current = true;
                setIsPlaying(true);
              }
            } else if (event.data === pausedState) {
              hasStartedPlayingRef.current = false;
              setIsPlaying(false);
            } else if (event.data === endedState) {
              if (!userPausedRef.current) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } else {
                hasStartedPlayingRef.current = false;
                setIsPlaying(false);
              }
            }
          },
          onAutoplayBlocked: () => {
            if (cancelled) return;
            hasStartedPlayingRef.current = false;
            setIsPlaying(false);
          },
          onError: () => {
            if (cancelled) return;
            hasStartedPlayingRef.current = false;
            setIsPlaying(false);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === 'function') {
          previousReady();
        }
        initPlayer();
      };

      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (verifyTimer !== null) {
        window.clearTimeout(verifyTimer);
      }
      playerReadyRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null;
    };
  }, [containerId]);

  useEffect(() => {
    const handleInteraction = (event: Event) => {
      if (
        toggleButtonRef.current &&
        event.target instanceof Node &&
        toggleButtonRef.current.contains(event.target)
      ) {
        return;
      }
      if (userPausedRef.current) return;

      const player = playerRef.current;
      const playingCode = window.YT?.PlayerState?.PLAYING ?? 1;
      const actuallyPlaying =
        hasStartedPlayingRef.current &&
        player?.getPlayerState?.() === playingCode &&
        !(player?.isMuted?.() ?? false);

      if (actuallyPlaying) return;
      startPlayback();
    };

    window.addEventListener('pointerdown', handleInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener('click', handleInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener('touchend', handleInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', handleInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener('focusin', handleInteraction, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener('pointerdown', handleInteraction, {
        capture: true,
      });
      window.removeEventListener('click', handleInteraction, {
        capture: true,
      });
      window.removeEventListener('touchend', handleInteraction, {
        capture: true,
      });
      window.removeEventListener('keydown', handleInteraction, {
        capture: true,
      });
      window.removeEventListener('focusin', handleInteraction, {
        capture: true,
      });
    };
  }, [startPlayback]);

  const handleToggle = () => {
    const player = playerRef.current;

    if (isPlaying && !userPausedRef.current) {
      userPausedRef.current = true;
      hasStartedPlayingRef.current = false;
      setIsPlaying(false);
      if (player && playerReadyRef.current) {
        try {
          player.mute();
          player.pauseVideo();
        } catch {
          // Ignore toggle pause error
        }
      }
      return;
    }

    userPausedRef.current = false;
    if (startPlayback()) {
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-1 left-1 z-0 h-[2px] w-[2px] overflow-hidden opacity-[0.01]"
      >
        <div id={containerId} />
      </div>

      <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={handleToggle}
          aria-pressed={isPlaying}
          aria-label={
            isPlaying ? 'Mute background music' : 'Play background music'
          }
          title={isPlaying ? 'Pause background music' : 'Play background music'}
          className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-lg border border-[#9E8464]/45 bg-[#FAF4E8]/85 px-3 py-1.5 text-[12px] font-medium text-[#54402E] shadow-[0_8px_20px_-12px_rgba(88,63,38,0.32)] backdrop-blur-xs transition-colors duration-150 hover:border-[#876D4E]/75 hover:bg-[#FFFDF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88946]/60"
        >
          {isPlaying ? (
            <>
              <Volume2
                className="h-3.5 w-3.5 text-[#8E6B38]"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Music On</span>
              <span
                aria-hidden="true"
                className="flex h-3 items-end gap-[2px]"
              >
                <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-[#B48A4B]" />
                <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-[#B48A4B] [animation-delay:160ms]" />
                <span className="h-2 w-[2px] animate-pulse rounded-full bg-[#B48A4B] [animation-delay:320ms]" />
              </span>
            </>
          ) : (
            <>
              <VolumeX
                className="h-3.5 w-3.5 text-[#7A644E]"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Music</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
