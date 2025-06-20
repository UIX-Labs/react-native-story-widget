import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  GestureResponderEvent,
  AppState,
  Animated,
  ViewStyle,
  StyleProp,
  ImageStyle,
} from 'react-native';
import {Story, StoriesType} from '../../types/types';
import Video from 'react-native-video';
import StoryHeader from '../story-header/StoryHeader';

interface StoryTileStyles {
  container?: StyleProp<ViewStyle>;
  storyWrapper?: StyleProp<ViewStyle>;
  scrollView?: StyleProp<ViewStyle>;
  storyContainer?: StyleProp<ViewStyle>;
  image?: StyleProp<ImageStyle>;
  headerContainer?: StyleProp<ViewStyle>;
}

interface StoryTileProps {
  stories: Story[];
  storyHeader: StoriesType;
  onComplete?: () => void;
  isActive?: boolean;
  showSeenStories?: boolean;
  onStoryViewed?: (storyId: number) => void;
  styles?: StoryTileStyles;
  headerProps?: Partial<React.ComponentProps<typeof StoryHeader>>;
  longPressDuration?: number;
  tapThreshold?: number;
  leftTapThreshold?: number;
  rightTapThreshold?: number;
  onStoryPress?: (story: Story, index: number) => void;
  onStoryLongPress?: (story: Story, index: number) => void;
  onStoryStart?: (story: Story, index: number) => void;
  onStoryEnd?: (story: Story, index: number) => void;
  renderCustomContent?: (story: Story, index: number) => React.ReactNode;
  renderHeaderRightContent?: () => React.ReactNode;
  videoProps?: Partial<React.ComponentProps<typeof Video>>;
  imageProps?: Partial<React.ComponentProps<typeof Image>>;
  shouldPauseOnAppBackground?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');

const DEFAULT_STYLES = {
  container: {
    flex: 1,
    backgroundColor: '#000',
  } as const,
  storyWrapper: {
    flex: 1,
    position: 'relative' as const,
  } as const,
  scrollView: {
    flex: 1,
  } as const,
  storyContainer: {
    width: screenWidth,
    height: '100%',
    backgroundColor: '#000',
  } as const,
  image: {
    ...StyleSheet.absoluteFillObject,
  } as const,
  headerContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 5,
    backgroundColor: 'transparent',
  } as const,
};

const DEFAULT_IMAGE_DURATION = 5000; // 5 seconds

const StoryTile = ({
  stories,
  storyHeader,
  onComplete,
  isActive = true,
  showSeenStories = true,
  onStoryViewed,
  styles: customStyles,
  headerProps,
  longPressDuration = 500,
  tapThreshold = 300,
  leftTapThreshold = 0.3,
  rightTapThreshold = 0.7,
  onStoryPress,
  onStoryLongPress,
  onStoryStart,
  onStoryEnd,
  renderCustomContent,
  renderHeaderRightContent,
  videoProps,
  imageProps,
  shouldPauseOnAppBackground = true,
}: StoryTileProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!isActive);
  const [videoProgress, setVideoProgress] = useState(0);
  const imageAnim = useRef(new Animated.Value(0)).current;
  const videoRefs = useRef<{[key: number]: any}>({});
  const pressInTime = useRef(0);
  const currentStoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Filter out seen stories if showSeenStories is false
  const filteredStories = showSeenStories
    ? stories
    : stories.filter(story => !story.isSeen);

  // Function to mark story as viewed
  const markStoryAsViewed = useCallback(
    (index: number) => {
      const story = filteredStories[index];
      if (story && !story.isSeen && onStoryViewed) {
        onStoryViewed(story.id);
      }
    },
    [filteredStories, onStoryViewed],
  );

  // Clear any existing timeout when component unmounts or story changes
  useEffect(() => {
    const timeout = currentStoryTimeout.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentIndex]);

  // Handle active state changes
  useEffect(() => {
    setIsPaused(!isActive);
    if (!isActive) {
      const timeout = currentStoryTimeout.current;
      if (timeout) {
        clearTimeout(timeout);
      }
      imageAnim.stopAnimation();
    } else {
      // Reset progress when becoming active
      setVideoProgress(0);
      imageAnim.setValue(0);
      videoRefs.current[currentIndex]?.seek(0);
    }
  }, [isActive, imageAnim, currentIndex]);

  const goToNextStory = useCallback(
    (fromOnEnd = false) => {
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }

      const currentStory = filteredStories[currentIndex];

      // Call onStoryEnd before moving to next
      if (onStoryEnd) {
        onStoryEnd(currentStory, currentIndex);
      }

      // Mark current story as viewed before moving to next
      markStoryAsViewed(currentIndex);

      if (currentIndex < filteredStories.length - 1) {
        const nextIndex = currentIndex + 1;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: !fromOnEnd,
        });
        setCurrentIndex(nextIndex);
        setIsPaused(false);
        setVideoProgress(0);
        imageAnim.setValue(0);

        // Call onStoryStart for the next story
        if (onStoryStart) {
          onStoryStart(filteredStories[nextIndex], nextIndex);
        }
      } else {
        // Mark last story as viewed before completing
        markStoryAsViewed(currentIndex);
        // Only call onComplete when the last story actually finishes
        if (fromOnEnd) {
          onComplete?.();
        }
      }
    },
    [
      currentIndex,
      filteredStories,
      onComplete,
      imageAnim,
      markStoryAsViewed,
      onStoryEnd,
      onStoryStart,
    ],
  );

  const goToPrevStory = useCallback(() => {
    if (currentStoryTimeout.current) {
      clearTimeout(currentStoryTimeout.current);
    }

    const currentStory = filteredStories[currentIndex];

    // Call onStoryEnd before moving to previous
    if (onStoryEnd) {
      onStoryEnd(currentStory, currentIndex);
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(prevIndex);
      setIsPaused(false);
      setVideoProgress(0);
      imageAnim.setValue(0);
      // Reset video progress when going back
      videoRefs.current[prevIndex]?.seek(0);

      // Call onStoryStart for the previous story
      if (onStoryStart) {
        onStoryStart(filteredStories[prevIndex], prevIndex);
      }
    }
  }, [currentIndex, imageAnim, filteredStories, onStoryEnd, onStoryStart]);

  // Effect to reset state when the story changes
  useEffect(() => {
    if (isActive) {
      setVideoProgress(0);
      imageAnim.setValue(0);
      videoRefs.current[currentIndex]?.seek(0);

      // Call onStoryStart when story becomes active
      if (onStoryStart) {
        onStoryStart(filteredStories[currentIndex], currentIndex);
      }
    }
  }, [currentIndex, imageAnim, isActive, filteredStories, onStoryStart]);

  // Effect to handle animations and timers
  useEffect(() => {
    const currentStory = filteredStories[currentIndex];

    if (!isActive || isPaused) {
      if (currentStory.type === 'image') {
        imageAnim.stopAnimation();
      }
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }
    } else {
      if (currentStory.type === 'image') {
        const currentValue = (imageAnim as any).__getValue();
        const duration = currentStory.duration || DEFAULT_IMAGE_DURATION;
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: duration * (1 - currentValue),
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished) {
            goToNextStory(true);
          }
        });
      }
    }
  }, [
    currentIndex,
    isPaused,
    filteredStories,
    imageAnim,
    goToNextStory,
    isActive,
  ]);

  useEffect(() => {
    if (!shouldPauseOnAppBackground) {
      return;
    }

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== 'active') {
        setIsPaused(true);
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [shouldPauseOnAppBackground]);

  const onScrollEnd = useCallback(
    (event: any) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const index = Math.round(contentOffset.x / screenWidth);
      if (
        index !== currentIndex &&
        index >= 0 &&
        index < filteredStories.length
      ) {
        setCurrentIndex(index);
        setVideoProgress(0);
        imageAnim.setValue(0);
        videoRefs.current[index]?.seek(0);
      }
    },
    [currentIndex, filteredStories.length, imageAnim],
  );

  const handlePressIn = () => {
    pressInTime.current = Date.now();
    setIsPaused(true);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    const pressDuration = Date.now() - pressInTime.current;
    const currentStory = filteredStories[currentIndex];

    if (pressDuration < tapThreshold) {
      // It's a tap
      const {locationX} = event.nativeEvent;
      const tapPosition = locationX / screenWidth;

      if (tapPosition < leftTapThreshold) {
        goToPrevStory();
      } else if (tapPosition > rightTapThreshold) {
        goToNextStory();
      } else if (onStoryPress) {
        onStoryPress(currentStory, currentIndex);
      }
    } else if (pressDuration >= longPressDuration && onStoryLongPress) {
      onStoryLongPress(currentStory, currentIndex);
    }
    // Resume playback after handling navigation
    setIsPaused(false);
  };

  const handleVideoProgress = (progress: any) => {
    if (filteredStories[currentIndex].type === 'video') {
      const p = progress.currentTime / progress.seekableDuration;
      setVideoProgress(p);
    }
  };

  const getCurrentProgress = () => {
    if (filteredStories[currentIndex].type === 'image') {
      return imageAnim;
    }
    return videoProgress;
  };

  const containerStyle = [DEFAULT_STYLES.container, customStyles?.container];
  const storyWrapperStyle = [
    DEFAULT_STYLES.storyWrapper,
    customStyles?.storyWrapper,
  ];
  const scrollViewStyle = [DEFAULT_STYLES.scrollView, customStyles?.scrollView];
  const storyContainerStyle = [
    DEFAULT_STYLES.storyContainer,
    customStyles?.storyContainer,
  ];
  const imageStyle = [DEFAULT_STYLES.image, customStyles?.image];

  return (
    <View style={containerStyle}>
      <View style={storyWrapperStyle}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          bounces={false}
          decelerationRate={0.992}
          style={scrollViewStyle}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          scrollEnabled={true}
          directionalLockEnabled={true}>
          {filteredStories.map((story, index) => {
            const isCurrentStory = index === currentIndex;
            return (
              <Pressable
                key={index}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[storyContainerStyle]}>
                {renderCustomContent ? (
                  renderCustomContent(story, index)
                ) : story.type === 'image' ? (
                  <Image
                    source={{uri: story.url}}
                    style={imageStyle}
                    resizeMode="cover"
                    {...imageProps}
                  />
                ) : (
                  <Video
                    source={{uri: story.url}}
                    style={imageStyle}
                    paused={!isActive || currentIndex !== index || isPaused}
                    resizeMode="contain"
                    onProgress={handleVideoProgress}
                    ref={r => (videoRefs.current[index] = r)}
                    onEnd={() => {
                      if (currentIndex === index && isActive) {
                        goToNextStory(true);
                      }
                    }}
                    repeat={false}
                    {...videoProps}
                  />
                )}
                {isCurrentStory && (
                  <View
                    style={[
                      DEFAULT_STYLES.headerContainer,
                      customStyles?.headerContainer,
                    ]}>
                    <StoryHeader
                      storyHeader={storyHeader}
                      currentIndex={currentIndex}
                      progress={getCurrentProgress()}
                      isAnimated={
                        filteredStories[currentIndex].type === 'image'
                      }
                      storiesCount={filteredStories.length}
                      renderRightContent={renderHeaderRightContent}
                      {...headerProps}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default StoryTile;
