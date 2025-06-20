import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  StyleProp,
  ImageStyle,
} from 'react-native';
import Video from 'react-native-video';
import {Story} from '../../../types/types';

interface VideoLoadingState {
  loading: boolean;
  error: string | null;
  buffering: boolean;
}

interface VideoPlayerProps {
  story: Story;
  index: number;
  currentIndex: number;
  isActive: boolean;
  isPaused: boolean;
  style: StyleProp<ImageStyle>;
  videoState: VideoLoadingState;
  onProgress: (progress: any) => void;
  onEnd: () => void;
  onVideoRef: (ref: any) => void;
  onUpdateState: (updates: Partial<VideoLoadingState>) => void;
  videoProps?: Partial<React.ComponentProps<typeof Video>>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  story,
  index,
  currentIndex,
  isActive,
  isPaused,
  style,
  videoState,
  onProgress,
  onEnd,
  onVideoRef,
  onUpdateState,
  videoProps,
}) => {
  // Track if video has started playing
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const previousActiveState = useRef({isActive, currentIndex, index});
  const hasInitialized = useRef(false);

  // Memoize the state update function to prevent unnecessary re-renders
  const updateVideoState = useCallback(
    (updates: Partial<VideoLoadingState>) => {
      onUpdateState(updates);
    },
    [onUpdateState],
  );

  // Reset state when video changes or becomes inactive
  useEffect(() => {
    const prev = previousActiveState.current;
    const isCurrentVideo = currentIndex === index;
    const wasCurrentVideo = prev.currentIndex === prev.index;
    const activeStateChanged = isActive !== prev.isActive;
    const indexChanged = currentIndex !== prev.currentIndex;

    // Only update state if there's a meaningful change
    if (
      !hasInitialized.current ||
      (wasCurrentVideo && !isCurrentVideo) ||
      (activeStateChanged && !isActive) ||
      (indexChanged && !isCurrentVideo)
    ) {
      setHasStartedPlaying(false);

      // Only update video state if this is not the current active video
      if (!isActive || !isCurrentVideo) {
        updateVideoState({loading: true, error: null, buffering: false});
      }

      hasInitialized.current = true;
    }

    // Update previous state
    previousActiveState.current = {isActive, currentIndex, index};
  }, [isActive, currentIndex, index, updateVideoState]);

  const handleBuffer = useCallback(
    ({isBuffering}: {isBuffering: boolean}) => {
      // Only show buffering if video has started playing before
      if (isBuffering && hasStartedPlaying) {
        updateVideoState({buffering: true});
      } else {
        updateVideoState({buffering: false});
      }
    },
    [hasStartedPlaying, updateVideoState],
  );

  const handleLoadStart = useCallback(() => {
    updateVideoState({loading: true, error: null, buffering: false});
  }, [updateVideoState]);

  const handleLoad = useCallback(() => {
    updateVideoState({loading: false, error: null, buffering: false});
  }, [updateVideoState]);

  const handlePlaybackStart = useCallback(() => {
    setHasStartedPlaying(true);
    updateVideoState({loading: false, error: null, buffering: false});
  }, [updateVideoState]);

  const handleError = useCallback(() => {
    setHasStartedPlaying(false);
    updateVideoState({
      loading: false,
      error: 'Failed to load video',
      buffering: false,
    });
  }, [updateVideoState]);

  const handleRetry = useCallback(() => {
    setHasStartedPlaying(false);
    updateVideoState({loading: true, error: null, buffering: false});
  }, [updateVideoState]);

  const renderLoadingOverlay = () => {
    if (!videoState) {
      return null;
    }

    if (videoState.error) {
      return (
        <View style={styles.overlayContainer}>
          <Text style={styles.errorText}>{videoState.error}</Text>
          <Pressable onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    // Only show loading indicator if video hasn't started playing or is buffering
    if ((videoState.loading && !hasStartedPlaying) || videoState.buffering) {
      return (
        <View style={styles.overlayContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Video
        source={{uri: story.url}}
        style={style}
        paused={!isActive || currentIndex !== index || isPaused}
        resizeMode="contain"
        onProgress={onProgress}
        ref={onVideoRef}
        onEnd={onEnd}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onReadyForDisplay={handlePlaybackStart}
        onError={handleError}
        onBuffer={handleBuffer}
        repeat={false}
        {...videoProps}
      />
      {renderLoadingOverlay()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
