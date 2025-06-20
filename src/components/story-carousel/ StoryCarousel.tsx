import React, {useCallback} from 'react';
import {View} from 'react-native';
import StoryGroup from '../story-group/StoryGroup';
import {StoryCarouselProps} from '../types/types';

const StoryCarousel = ({
  stories,
  showSeenStories = true,
  onStoryViewed,
}: StoryCarouselProps) => {
  const handleStoryViewed = useCallback(
    (userId: number, storyId: number) => {
      if (onStoryViewed) {
        onStoryViewed(userId, storyId);
      }
    },
    [onStoryViewed],
  );

  if (!stories) {
    return <View />;
  }

  return (
    <View style={{flex: 1}}>
      <StoryGroup
        userStories={stories}
        showSeenStories={showSeenStories}
        onStoryViewed={handleStoryViewed}
      />
    </View>
  );
};

export default StoryCarousel;
