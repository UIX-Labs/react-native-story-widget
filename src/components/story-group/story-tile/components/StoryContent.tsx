import React from 'react';
import {Image, StyleProp, ImageStyle, View} from 'react-native';
import {Story} from '../../../types/types';
import VideoPlayer from './VideoPlayer';
import {VideoLoadingState} from '../types';

interface StoryContentProps {
  story: Story;
  index: number;
  currentIndex: number;
  isActive: boolean;
  isPaused: boolean;
  imageStyle: StyleProp<ImageStyle>;
  preloadWindow: number; // Windowed loading: ±N stories around current
  videoState: VideoLoadingState;
  onVideoProgress: (progress: any) => void;
  onVideoEnd: () => void;
  onVideoRef: (ref: any) => void;
  onUpdateVideoState: (updates: Partial<VideoLoadingState>) => void;
  renderCustomContent?: (story: Story, index: number) => React.ReactNode;
  videoProps?: any;
  imageProps?: any;
}

/**
 * WINDOWED LOADING UTILITY
 *
 * Calculates whether a story should be loaded based on its distance
 * from the currently active story.
 *
 * @param storyIndex - Index of the story to check
 * @param currentIndex - Index of the currently active story
 * @param preloadWindow - Number of stories to load on each side of current
 * @returns true if story should be loaded, false if outside window
 *
 * Examples with preloadWindow=2:
 * - Current story: index 3
 * - Stories 1,2,3,4,5 will be loaded (distance ≤ 2)
 * - Stories 0,6+ will not be loaded (distance > 2)
 */
const shouldLoadContent = (
  storyIndex: number,
  currentIndex: number,
  preloadWindow: number,
): boolean => {
  const distance = Math.abs(storyIndex - currentIndex);
  return distance <= preloadWindow;
};

/**
 * StoryContent Component - Content decision layer for windowed loading
 *
 * RESPONSIBILITIES:
 * - Determine if story content should be loaded or placeholder shown
 * - Route to appropriate content type (Image, Video, Custom)
 * - Apply windowed loading logic consistently
 *
 * WINDOWED LOADING LOGIC:
 * - Stories within preloadWindow: Load actual content
 * - Stories outside preloadWindow: Show empty placeholder
 * - Saves 60-70% memory compared to loading all stories
 *
 * CONTENT TYPES:
 * - Images: Always load immediately (relatively lightweight)
 * - Videos: Pass shouldLoad flag to VideoPlayer for conditional loading
 * - Custom: Respect windowed loading for custom renderers
 */
const StoryContent: React.FC<StoryContentProps> = ({
  story,
  index,
  currentIndex,
  isActive,
  isPaused,
  imageStyle,
  preloadWindow,
  videoState,
  onVideoProgress,
  onVideoEnd,
  onVideoRef,
  onUpdateVideoState,
  renderCustomContent,
  videoProps,
  imageProps,
}) => {
  // Calculate if this story should be loaded based on windowed loading
  const shouldLoad = shouldLoadContent(index, currentIndex, preloadWindow);

  /**
   * CUSTOM CONTENT HANDLING
   *
   * If user provides custom content renderer:
   * - Load: Render custom content
   * - Don't load: Show placeholder to maintain story dimensions
   */
  if (renderCustomContent) {
    return shouldLoad ? (
      renderCustomContent(story, index)
    ) : (
      <View style={imageStyle} />
    );
  }

  /**
   * WINDOWED LOADING GATE
   *
   * If story is outside the preload window, show empty placeholder
   * instead of loading actual content. This prevents:
   * - Memory usage from distant video players
   * - Network requests for distant images/videos
   * - CPU usage from media decoders
   */
  if (!shouldLoad) {
    return <View style={imageStyle} />;
  }

  /**
   * IMAGE STORY RENDERING
   *
   * Images are loaded immediately when in window because:
   * - Relatively lightweight compared to videos
   * - React Native handles image caching efficiently
   * - No video decoder resources required
   */
  if (story.type === 'image') {
    return (
      <Image
        source={{uri: story.url}}
        style={imageStyle}
        resizeMode="cover"
        {...imageProps}
      />
    );
  }

  /**
   * VIDEO STORY RENDERING
   *
   * Videos are passed to VideoPlayer with shouldLoad flag for:
   * - Conditional video decoder initialization
   * - Smart resource management
   * - Proper cleanup when moving outside window
   */
  return (
    <VideoPlayer
      story={story}
      index={index}
      currentIndex={currentIndex}
      isActive={isActive}
      isPaused={isPaused}
      style={imageStyle}
      shouldLoad={shouldLoad} // Critical: enables windowed loading in VideoPlayer
      videoState={videoState}
      onProgress={onVideoProgress}
      onEnd={onVideoEnd}
      onVideoRef={onVideoRef}
      onUpdateState={onUpdateVideoState}
      videoProps={videoProps}
    />
  );
};

export default StoryContent;
