import React from 'react';
import {Image, StyleProp, ImageStyle} from 'react-native';
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
  preloadWindow: number;
  videoState: VideoLoadingState;
  onVideoProgress: (progress: any) => void;
  onVideoEnd: () => void;
  onVideoRef: (ref: any) => void;
  onUpdateVideoState: (updates: Partial<VideoLoadingState>) => void;
  renderCustomContent?: (story: Story, index: number) => React.ReactNode;
  videoProps?: any;
  imageProps?: any;
}

const StoryContent: React.FC<StoryContentProps> = ({
  story,
  index,
  currentIndex,
  isActive,
  isPaused,
  imageStyle,
//   preloadWindow,
  videoState,
  onVideoProgress,
  onVideoEnd,
  onVideoRef,
  onUpdateVideoState,
  renderCustomContent,
  videoProps,
  imageProps,
}) => {
  if (renderCustomContent) {
    return renderCustomContent(story, index);
  }

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

  return (
    <VideoPlayer
      story={story}
      index={index}
      currentIndex={currentIndex}
      isActive={isActive}
      isPaused={isPaused}
      style={imageStyle}
      //   preloadWindow={preloadWindow}
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
