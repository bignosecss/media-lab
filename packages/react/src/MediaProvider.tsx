import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import {
  createMediaCaptions,
  createMediaController,
  type MediaController,
  type TextTrackListLike,
} from '@medialab/core';
import { MediaContext, type MediaFullscreen } from './controller-context.ts';

/** The media attributes the provider can forward to the default element. */
export interface MediaElementProps {
  src?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  poster?: string;
  controls?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export interface MediaProviderProps extends MediaElementProps {
  children?: ReactNode;
  /** Replace the default `<video>` with your own media element. Attach it to the given ref. */
  renderMedia?: (props: {
    ref: Ref<HTMLMediaElement>;
    mediaProps: MediaElementProps;
  }) => ReactNode;
  /** An externally-owned controller (advanced/testing). Defaults to an internal one. */
  controller?: MediaController;
  /** Class applied to the container element the provider renders (the fullscreen target). */
  containerClassName?: string;
}

/**
 * Owns the media element, a container element, and the controller. The media
 * element is the single source of truth; the controller is the only reader/writer
 * of it. The container is the fullscreen target. Render your controls as `children`.
 */
export function MediaProvider({
  children,
  renderMedia,
  controller: controllerProp,
  containerClassName,
  ...mediaProps
}: MediaProviderProps) {
  const [internalController] = useState(() => createMediaController());
  const controller = controllerProp ?? internalController;
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const captions = useMemo(
    () =>
      createMediaCaptions(
        () => mediaRef.current?.textTracks as unknown as TextTrackListLike | null,
      ),
    [],
  );

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    mediaRef.current = node;
  }, []);

  useEffect(() => {
    controller.attach(mediaRef.current);
    captions.refresh();
    return () => controller.detach();
  }, [controller, captions]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void container.requestFullscreen();
    }
  }, []);

  const fullscreen: MediaFullscreen = useMemo(
    () => ({
      isFullscreen,
      toggle: toggleFullscreen,
      isSupported: document.fullscreenEnabled,
    }),
    [isFullscreen, toggleFullscreen],
  );

  const value = useMemo(() => ({ controller, fullscreen, captions }), [controller, fullscreen, captions]);

  const element = renderMedia
    ? renderMedia({ ref: mediaRef, mediaProps })
    : (<video ref={setVideoRef} {...mediaProps} />);

  return (
    <MediaContext.Provider value={value}>
      <div ref={containerRef} className={containerClassName}>
        {element}
        {children}
      </div>
    </MediaContext.Provider>
  );
}
