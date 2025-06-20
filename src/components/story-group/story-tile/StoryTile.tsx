import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
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
import StoryContent from './components/StoryContent';
import {VideoLoadingState} from './types';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

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
  tapThreshold?: number;
  leftTapThreshold?: number;
  rightTapThreshold?: number;
  onStoryPress?: (story: Story, index: number) => void;
  onStoryStart?: (story: Story, index: number) => void;
  onStoryEnd?: (story: Story, index: number) => void;
  renderCustomContent?: (story: Story, index: number) => React.ReactNode;
  renderHeaderRightContent?: () => React.ReactNode;
  videoProps?: Partial<React.ComponentProps<typeof Video>>;
  imageProps?: any;
  shouldPauseOnAppBackground?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');
const DEFAULT_IMAGE_DURATION = 5000;
const PRELOAD_WINDOW = 1;

const StoryTile: React.FC<StoryTileProps> = ({
  stories,
  storyHeader,
  onComplete,
  isActive = true,
  showSeenStories = true,
  onStoryViewed,
  styles: customStyles,
  headerProps,
  tapThreshold = 300,
  leftTapThreshold = 0.3,
  rightTapThreshold = 0.7,
  onStoryPress,
  onStoryStart,
  onStoryEnd,
  renderCustomContent,
  renderHeaderRightContent,
  videoProps,
  imageProps,
  shouldPauseOnAppBackground = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!isActive);
  const [videoProgress, setVideoProgress] = useState(0);
  const imageAnim = useRef(new Animated.Value(0)).current;
  const videoRefs = useRef<{[key: number]: any}>({});
  const pressInTime = useRef(0);
  const currentStoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [videoStates, setVideoStates] = useState<{
    [key: number]: VideoLoadingState;
  }>({});

  const {styles: style} = useStyles(styles);
  const filteredStories = showSeenStories
    ? stories
    : stories.filter(story => !story.isSeen);

  const markStoryAsViewed = useCallback(
    (index: number) => {
      const story = filteredStories[index];
      if (story && !story.isSeen && onStoryViewed) {
        onStoryViewed(story.id);
      }
    },
    [filteredStories, onStoryViewed],
  );

  const updateVideoState = useCallback(
    (index: number, updates: Partial<VideoLoadingState>) => {
      setVideoStates(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          ...updates,
        },
      }));
    },
    [], // Empty dependency array since it doesn't depend on external values
  );
  const handleVideoRef = useCallback((index: number, ref: any) => {
    videoRefs.current[index] = ref;
  }, []);

  const goToNextStory = useCallback(
    (fromOnEnd = false) => {
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }

      const currentStory = filteredStories[currentIndex];
      onStoryEnd?.(currentStory, currentIndex);
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
        onStoryStart?.(filteredStories[nextIndex], nextIndex);
      } else {
        markStoryAsViewed(currentIndex);
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
    onStoryEnd?.(currentStory, currentIndex);

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
      videoRefs.current[prevIndex]?.seek(0);
      onStoryStart?.(filteredStories[prevIndex], prevIndex);
    }
  }, [currentIndex, imageAnim, filteredStories, onStoryEnd, onStoryStart]);

  const handlePressIn = useCallback(() => {
    pressInTime.current = Date.now();
    // Always pause on press
    setIsPaused(true);
  }, []);

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      const pressDuration = Date.now() - pressInTime.current;
      const currentStory = filteredStories[currentIndex];

      // For short presses (taps), handle navigation
      if (pressDuration < tapThreshold) {
        const {locationX} = event.nativeEvent;
        const tapPosition = locationX / screenWidth;

        if (tapPosition < leftTapThreshold) {
          goToPrevStory();
        } else if (tapPosition > rightTapThreshold) {
          goToNextStory();
        } else if (onStoryPress) {
          onStoryPress(currentStory, currentIndex);
        }
      }

      // Always unpause on release unless we're navigating
      const isNavigating =
        pressDuration < tapThreshold &&
        (event.nativeEvent.locationX / screenWidth < leftTapThreshold ||
          event.nativeEvent.locationX / screenWidth > rightTapThreshold);

      if (!isNavigating) {
        setIsPaused(false);
      }
    },
    [
      currentIndex,
      filteredStories,
      goToNextStory,
      goToPrevStory,
      onStoryPress,
      tapThreshold,
      leftTapThreshold,
      rightTapThreshold,
    ],
  );

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

  const handleVideoProgress = useCallback(
    (progress: any) => {
      if (progress.seekableDuration > 0) {
        const progressValue = progress.currentTime / progress.seekableDuration;
        setVideoProgress(progressValue);

        // Handle video completion
        if (progressValue >= 0.99) {
          goToNextStory(true);
        }
      }
    },
    [goToNextStory],
  );

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
        // Ensure story plays when switching between users
        setIsPaused(false);
      }
    },
    [currentIndex, filteredStories.length, imageAnim],
  );

  // Effect to handle active state changes
  useEffect(() => {
    if (!isActive) {
      setIsPaused(true);
      const timeout = currentStoryTimeout.current;
      if (timeout) {
        clearTimeout(timeout);
      }
      imageAnim.stopAnimation();
    } else {
      // Reset pause state when becoming active
      setIsPaused(false);
      setVideoProgress(0);
      imageAnim.setValue(0);
      videoRefs.current[currentIndex]?.seek(0);
    }
  }, [isActive, imageAnim, currentIndex]);

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
        imageAnim.setValue(0);
        const duration = DEFAULT_IMAGE_DURATION;
        Animated.timing(imageAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished && !isPaused) {
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

  const getCurrentProgress = () => {
    if (filteredStories[currentIndex].type === 'image') {
      return imageAnim;
    }
    return videoProgress;
  };

  return (
    <View style={[style.container, customStyles?.container]}>
      <View style={[style.storyWrapper, customStyles?.storyWrapper]}>
        <View style={[style.headerContainer, customStyles?.headerContainer]}>
          <StoryHeader
            storyHeader={storyHeader}
            currentIndex={currentIndex}
            progress={getCurrentProgress()}
            isAnimated={filteredStories[currentIndex].type === 'image'}
            storiesCount={filteredStories.length}
            renderRightContent={renderHeaderRightContent}
            {...headerProps}
          />
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate={0.992}
          style={[style.scrollView, customStyles?.scrollView]}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          scrollEnabled={true}
          directionalLockEnabled={true}
          onMomentumScrollEnd={onScrollEnd}>
          {filteredStories.map((story, index) => (
            <Pressable
              key={index}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[style.storyContainer, customStyles?.storyContainer]}>
              <StoryContent
                story={story}
                index={index}
                currentIndex={currentIndex}
                isActive={isActive && index === currentIndex}
                isPaused={isPaused}
                imageStyle={[style.image, customStyles?.image]}
                preloadWindow={PRELOAD_WINDOW}
                videoState={
                  videoStates[index] || {
                    loading: false,
                    error: null,
                    buffering: false,
                  }
                }
                onVideoProgress={handleVideoProgress}
                onVideoEnd={() => {
                  if (index === currentIndex) {
                    goToNextStory(true);
                  }
                }}
                onVideoRef={ref => handleVideoRef(index, ref)}
                onUpdateVideoState={updates => updateVideoState(index, updates)}
                renderCustomContent={renderCustomContent}
                videoProps={{
                  ...videoProps,
                  repeat: false,
                  resizeMode: 'contain',
                }}
                imageProps={imageProps}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  storyContainer: {
    width: screenWidth,
    height: '100%',
    backgroundColor: '#000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
});

export default StoryTile;
