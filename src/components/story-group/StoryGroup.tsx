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
  userStories: StoriesType[];
  showSeenStories?: boolean;
  onStoryViewed?: (userId: number, storyId: number) => void;
  renderCustomHeader?: CustomHeaderRenderer;
  customHeaderData?: (storyHeader: StoriesType) => HeaderData;
}

const StoryGroup = ({
  userStories,
  showSeenStories = true,
  onStoryViewed,
  renderCustomHeader,
  customHeaderData,
}: StoryGroupProps) => {
  const {styles: style} = useStyles(styles);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Handles the scroll event when user swipes between different story groups
  const handleUserScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const userIndex = Math.round(contentOffset.x / screenWidth);

      if (
        userIndex !== currentUserIndex &&
        userIndex >= 0 &&
        userIndex < userStories.length
      ) {
        setCurrentUserIndex(userIndex);
      }
    },
    [currentUserIndex, userStories.length],
  );

  const handleStoryComplete = useCallback(() => {
    if (currentUserIndex < userStories.length - 1) {
      const nextIndex = currentUserIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentUserIndex(nextIndex);
    }
  }, [currentUserIndex, userStories.length]);

  const handleStoryViewed = useCallback(
    (storyId: number) => {
      const currentUser = userStories[currentUserIndex];
      if (currentUser && onStoryViewed) {
        onStoryViewed(currentUser.id, storyId);
      }
    },
    [currentUserIndex, userStories, onStoryViewed],
  );

  const renderUserStory = useCallback(
    ({item, index}: {item: StoriesType; index: number}) => {
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
              isActive={index === currentUserIndex}
              showSeenStories={showSeenStories}
              onStoryViewed={handleStoryViewed}
              renderCustomHeader={renderCustomHeader}
              customHeaderData={customHeaderData}
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
    ],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={userStories}
      renderItem={renderUserStory}
      keyExtractor={item => item.id.toString()}
      horizontal
      pagingEnabled
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
