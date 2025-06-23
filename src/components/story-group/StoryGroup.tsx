import React, {useCallback, useState, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import {StoriesType, CustomHeaderRenderer, HeaderData} from '../types/types';
import StoryTile from './story-tile/StoryTile';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface StoryGroupProps {
  userStories: StoriesType[]; // Array of different users' story collections
  showSeenStories?: boolean;
  onStoryViewed?: (userId: number, storyId: number) => void;
  renderCustomHeader?: CustomHeaderRenderer;
  customHeaderData?: (storyHeader: StoriesType) => HeaderData;
  preloadWindow?: number; // Windowed loading configuration passed down
  tapThreshold?: number; // Tap vs long press distinction
  leftTapThreshold?: number; // Left tap zone for previous story
  rightTapThreshold?: number; // Right tap zone for next story
  showHeader?: boolean;
}

/**
 * StoryGroup Component - User story collection manager with windowed loading
 *
 * ROLE IN WINDOWED LOADING ARCHITECTURE:
 * StoryGroup sits between StoryCarousel and StoryTile, managing multiple
 * users' story collections while passing windowed loading configuration
 * down to individual story tiles.
 *
 * RESPONSIBILITIES:
 * 1. User Navigation - Handle horizontal swiping between different users
 * 2. Configuration Passing - Forward windowed loading props to StoryTile
 * 3. State Management - Track current active user for proper resource allocation
 * 4. Story Completion - Auto-advance to next user when stories complete
 * 5. Event Coordination - Coordinate story viewing events with user context
 *
 * WINDOWED LOADING IMPACT:
 * - Only the currently active user's stories are processed by StoryTile
 * - Inactive users' stories remain unloaded until user navigates to them
 * - This provides an additional layer of resource optimization beyond
 *   the per-story windowed loading within each StoryTile
 *
 * NAVIGATION FLOW:
 * User A Stories → User B Stories → User C Stories
 *    ↓               ↓               ↓
 * StoryTile A    StoryTile B    StoryTile C
 * (isActive=T)   (isActive=F)   (isActive=F)
 *    ↓               ↓               ↓
 * Windowed Load   No Loading     No Loading
 *
 * PERFORMANCE BENEFITS:
 * - Multiple layers of resource optimization
 * - Only active user consumes memory/CPU
 * - Within active user, only nearby stories load (windowed loading)
 * - Provides excellent scalability for apps with many users
 */
const StoryGroup = ({
  userStories,
  showSeenStories = true,
  onStoryViewed,
  renderCustomHeader,
  customHeaderData,
  preloadWindow = 2, // Default windowed loading window
  tapThreshold = 0.5, // Default tap threshold in seconds
  leftTapThreshold = 0.25, // Default left tap zone (25% of screen)
  rightTapThreshold = 0.25, // Default right tap zone (25% of screen)
  showHeader = true,
}: StoryGroupProps) => {
  const {styles: style} = useStyles(styles);

  // Track which user's stories are currently active
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /**
   * Handle horizontal scrolling between different users' story collections
   *
   * This is the "outer" navigation - swiping between users, as opposed to
   * the "inner" navigation handled by StoryTile (tapping between stories)
   */
  const handleUserScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const userIndex = Math.round(contentOffset.x / screenWidth);

      // Only update if we've actually moved to a different user
      if (
        userIndex !== currentUserIndex &&
        userIndex >= 0 &&
        userIndex < userStories.length
      ) {
        setCurrentUserIndex(userIndex);
        // When user changes, the previous user's StoryTile becomes inactive
        // and will stop loading/processing stories, while the new user's
        // StoryTile becomes active and begins windowed loading
      }
    },
    [currentUserIndex, userStories.length],
  );

  /**
   * Handle completion of all stories for the current user
   *
   * When user finishes viewing all stories in a collection,
   * automatically advance to the next user's stories
   */
  const handleStoryComplete = useCallback(() => {
    if (currentUserIndex < userStories.length - 1) {
      const nextIndex = currentUserIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentUserIndex(nextIndex);
      // This triggers the windowed loading system to activate for the new user
    }
    // If this was the last user, the story viewing session is complete
  }, [currentUserIndex, userStories.length]);

  /**
   * Handle individual story view events with user context
   *
   * Wraps story viewing events with the current user information
   * before passing to parent callback for analytics/tracking
   */
  const handleStoryViewed = useCallback(
    (storyId: number) => {
      const currentUser = userStories[currentUserIndex];
      if (currentUser && onStoryViewed) {
        onStoryViewed(currentUser.id, storyId);
      }
    },
    [currentUserIndex, userStories, onStoryViewed],
  );

  /**
   * Render individual user's story collection
   *
   * KEY WINDOWED LOADING DECISION:
   * Only the current user (index === currentUserIndex) gets isActive=true,
   * which means only that user's stories will be processed by the windowed
   * loading system. All other users' stories remain dormant.
   */
  const renderUserStory = useCallback(
    ({item, index}: {item: StoriesType; index: number}) => {
      // Filter stories based on seen/unseen preference
      const filteredStories = showSeenStories
        ? item.stories
        : item.stories.filter(story => !story.isSeen);

      return (
        <View style={{width: screenWidth, height: screenHeight}} key={index}>
          <View style={style.container}>
            <StoryTile
              stories={filteredStories}
              storyHeader={item}
              onComplete={handleStoryComplete}
              isActive={index === currentUserIndex} // CRITICAL: Only active user loads stories
              showSeenStories={showSeenStories}
              onStoryViewed={handleStoryViewed}
              renderCustomHeader={renderCustomHeader}
              customHeaderData={customHeaderData}
              // Pass windowed loading configuration down to StoryTile
              preloadWindow={preloadWindow}
              // Pass navigation configuration down to StoryTile
              tapThreshold={tapThreshold}
              leftTapThreshold={leftTapThreshold}
              rightTapThreshold={rightTapThreshold}
              showHeader={showHeader}
            />
          </View>
        </View>
      );
    },
    [
      currentUserIndex,
      showSeenStories,
      handleStoryComplete,
      handleStoryViewed,
      renderCustomHeader,
      customHeaderData,
      preloadWindow,
      tapThreshold,
      leftTapThreshold,
      rightTapThreshold,
      showHeader,
    ],
  );

  /**
   * HORIZONTAL FLATLIST FOR USER NAVIGATION
   *
   * This creates a horizontal scrollable list where each item is a full-screen
   * StoryTile representing one user's story collection. Only the visible
   * (current) user's stories are processed due to the isActive prop logic.
   *
   * PERFORMANCE CHARACTERISTICS:
   * - FlatList naturally handles virtualization for large user lists
   * - Combined with windowed loading, provides excellent scalability
   * - Memory usage: O(1 user) × O(preloadWindow stories) = minimal
   */
  return (
    <FlatList
      ref={flatListRef}
      data={userStories}
      renderItem={renderUserStory}
      keyExtractor={item => item.id.toString()}
      horizontal
      pagingEnabled // Snap to each user's stories
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      bounces={false}
      onMomentumScrollEnd={handleUserScroll}
      getItemLayout={(_data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
    />
  );
};

export default StoryGroup;

const styles = createStyleSheet({
  container: {
    flex: 1,
  },
});
