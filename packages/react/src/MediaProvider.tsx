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
  createMediaController,
  type MediaController,
} from '@react-media/core';
import { MediaContext } from './controller-context.ts';

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
}

/**
 * Owns the media element and the controller, and exposes both via context.
 * The element is the single source of truth; the controller is the only
 * reader/writer. Render your controls as `children`.
 */
export function MediaProvider({
  children,
  renderMedia,
  controller: controllerProp,
  ...mediaProps
}: MediaProviderProps) {
  const [internalController] = useState(() => createMediaController());
  const controller = controllerProp ?? internalController;
  const mediaRef = useRef<HTMLMediaElement | null>(null);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    mediaRef.current = node;
  }, []);

  useEffect(() => {
    controller.attach(mediaRef.current);
    return () => controller.detach();
  }, [controller]);

  const value = useMemo(() => ({ controller }), [controller]);

  const element = renderMedia
    ? renderMedia({ ref: mediaRef, mediaProps })
    : (<video ref={setVideoRef} {...mediaProps} />);

  return (
    <MediaContext.Provider value={value}>
      {element}
      {children}
    </MediaContext.Provider>
  );
}
