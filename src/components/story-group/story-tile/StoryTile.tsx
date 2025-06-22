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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  Story,
  StoriesType,
  CustomHeaderRenderer,
  HeaderData,
} from '../../types/types';
import StoryHeader, {StoryHeaderStyles} from '../story-header/StoryHeader';
import StoryContent from './components/StoryContent';
import {VideoLoadingState} from './types';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

// Define types for video refs and progress
interface VideoRefType {
  seek: (time: number) => void;
}

interface VideoProgressType {
  currentTime: number;
  seekableDuration: number;
}

// Updated props with configurable thresholds
interface StoryTileProps {
  stories: Story[];
  storyHeader: StoriesType;
  onComplete?: () => void;
  isActive?: boolean;
  showSeenStories?: boolean;
  onStoryViewed?: (storyId: number) => void;
  renderHeaderRightContent?: () => React.ReactNode;
  renderCustomHeader?: CustomHeaderRenderer;
  customHeaderData?: (storyHeader: StoriesType) => HeaderData;
  tapThreshold?: number;
  leftTapThreshold?: number;
  rightTapThreshold?: number;
  imageDuration?: number;
  headerStyles?: StoryHeaderStyles;
  showHeader?: boolean;
}

const {width: screenWidth} = Dimensions.get('window');
const DEFAULT_IMAGE_DURATION = 5000;
const PRELOAD_WINDOW = 1;
const MAX_PRESS_DURATION = 3000;

const StoryTile: React.FC<StoryTileProps> = ({
  stories,
  storyHeader,
  onComplete,
  isActive = true,
  showSeenStories = true,
  onStoryViewed,
  renderHeaderRightContent,
  renderCustomHeader,
  customHeaderData,
  tapThreshold = 300, // Default value
  leftTapThreshold = 0.3,
  rightTapThreshold = 0.7,
  imageDuration = DEFAULT_IMAGE_DURATION,
  headerStyles,
  showHeader = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(!isActive);
  const [videoProgress, setVideoProgress] = useState(0);
  const imageAnim = useRef(new Animated.Value(0)).current;
  const videoRefs = useRef<{[key: number]: VideoRefType}>({});
  const pressInTime = useRef(0);
  const currentStoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [videoStates, setVideoStates] = useState<{
    [key: number]: VideoLoadingState;
  }>({});
  const lastTapTime = useRef(0); // New: For debouncing rapid taps

  const {styles: style} = useStyles(styles);
  const filteredStories = showSeenStories
    ? stories
    : stories.filter(story => !story.isSeen);

  // Clean up video refs when stories change
  useEffect(() => {
    const validIndexes = filteredStories.map((_, index) => index);
    videoRefs.current = Object.keys(videoRefs.current)
      .filter(key => validIndexes.includes(Number(key)))
      .reduce((acc, key) => {
        acc[Number(key)] = videoRefs.current[Number(key)];
        return acc;
      }, {} as {[key: number]: VideoRefType});
  }, [filteredStories]);

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
    [],
  );

  const handleVideoRef = useCallback(
    (index: number, ref: VideoRefType | null) => {
      if (ref) {
        videoRefs.current[index] = ref;
      } else {
        delete videoRefs.current[index]; // Clean up null refs
      }
    },
    [],
  );

  const goToNextStory = useCallback(
    (fromOnEnd = false) => {
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }

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
      } else {
        markStoryAsViewed(currentIndex);
        if (fromOnEnd) {
          onComplete?.();
        }
      }
    },
    [
      currentIndex,
      filteredStories.length,
      onComplete,
      imageAnim,
      markStoryAsViewed,
    ],
  );

  const goToPrevStory = useCallback(() => {
    if (currentStoryTimeout.current) {
      clearTimeout(currentStoryTimeout.current);
    }

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
      setIsPaused(false);
      setVideoProgress(0);
      imageAnim.setValue(0);
      videoRefs.current[prevIndex]?.seek(0);
    }
  }, [currentIndex, imageAnim]);

  const handlePressIn = useCallback(() => {
    pressInTime.current = Date.now();
    setIsPaused(true);
  }, []);

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      const pressDuration = Date.now() - pressInTime.current;
      const currentTime = Date.now();

      // Debounce rapid taps (within 200ms)
      if (currentTime - lastTapTime.current < 200) {
        return;
      }
      lastTapTime.current = currentTime;

      // Handle short taps for navigation
      if (pressDuration < tapThreshold && pressDuration < MAX_PRESS_DURATION) {
        const {locationX} = event.nativeEvent;
        const tapPosition = locationX / screenWidth;

        if (tapPosition < leftTapThreshold) {
          goToPrevStory();
        } else if (tapPosition > rightTapThreshold) {
          goToNextStory();
        }
      }

      // Unpause unless navigating or press too long
      const isNavigating =
        pressDuration < tapThreshold &&
        (event.nativeEvent.locationX / screenWidth < leftTapThreshold ||
          event.nativeEvent.locationX / screenWidth > rightTapThreshold);

      if (!isNavigating && pressDuration < MAX_PRESS_DURATION) {
        setIsPaused(false);
      }
    },
    [
      goToNextStory,
      goToPrevStory,
      tapThreshold,
      leftTapThreshold,
      rightTapThreshold,
    ],
  );

  useEffect(() => {
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
  }, []); // Empty deps since SHOULD_PAUSE_ON_APP_BACKGROUND is constant

  const handleVideoProgress = useCallback(
    (progress: VideoProgressType) => {
      if (progress.seekableDuration > 0) {
        const progressValue = progress.currentTime / progress.seekableDuration;
        setVideoProgress(progressValue);

        if (progressValue >= 0.99) {
          goToNextStory(true);
        }
      }
    },
    [goToNextStory],
  );

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
        setIsPaused(false);
      }
    },
    [currentIndex, filteredStories.length, imageAnim],
  );

  useEffect(() => {
    if (!isActive) {
      setIsPaused(true);
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }
      imageAnim.stopAnimation();
    } else {
      setIsPaused(false);
      setVideoProgress(0);
      imageAnim.setValue(0);
      videoRefs.current[currentIndex]?.seek(0);
    }
  }, [isActive, imageAnim, currentIndex]);

  useEffect(() => {
    const currentStory = filteredStories[currentIndex];
    // Capture the timeout at the beginning of the effect
    const timeoutToCancel = currentStoryTimeout.current;

    if (!isActive || isPaused) {
      if (currentStory?.type === 'image') {
        imageAnim.stopAnimation();
      }
      if (currentStoryTimeout.current) {
        clearTimeout(currentStoryTimeout.current);
      }
    } else {
      if (currentStory?.type === 'image') {
        imageAnim.setValue(0);
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: imageDuration,
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished && !isPaused) {
            goToNextStory(true);
          }
        });
      }
    }

    return () => {
      // Use the captured timeout value
      imageAnim.stopAnimation();
      if (timeoutToCancel) {
        clearTimeout(timeoutToCancel);
      }
    };
  }, [
    currentIndex,
    isPaused,
    filteredStories,
    imageAnim,
    goToNextStory,
    isActive,
    imageDuration,
  ]);

  const getCurrentProgress = () => {
    if (filteredStories[currentIndex]?.type === 'image') {
      return imageAnim;
    }
    return videoProgress;
  };

  return (
    <View style={style.container}>
      <View style={style.storyWrapper}>
        {showHeader && (
          <View style={style.headerContainer}>
            <StoryHeader
              storyHeader={storyHeader}
              currentIndex={currentIndex}
              progress={getCurrentProgress()}
              isAnimated={filteredStories[currentIndex]?.type === 'image'}
              storiesCount={filteredStories.length}
              renderRightContent={renderHeaderRightContent}
              renderCustomHeader={renderCustomHeader}
              customHeaderData={customHeaderData}
              styles={headerStyles}
            />
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate={0.992}
          style={style.scrollView}
          scrollEventThrottle={16}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          scrollEnabled={true}
          directionalLockEnabled={true}
          onMomentumScrollEnd={onScrollEnd}>
          {filteredStories.map((story, index) => (
            <Pressable
              key={story.id || index} // Use story.id for stable keys
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={style.storyContainer}
              accessibilityLabel={`Story ${index + 1} of ${
                filteredStories.length
              }`}
              accessibilityRole="button">
              <StoryContent
                story={story}
                index={index}
                currentIndex={currentIndex}
                isActive={isActive && index === currentIndex}
                isPaused={isPaused}
                imageStyle={style.image}
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
                videoProps={{
                  repeat: false,
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// Styles remain unchanged
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
