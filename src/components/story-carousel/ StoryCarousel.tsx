import React, {useCallback} from 'react';
import {View} from 'react-native';
import StoryGroup from '../story-group/StoryGroup';
import {StoryCarouselProps} from '../types/types';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const StoryCarousel = ({
  stories,
  showSeenStories = true,
  onStoryViewed,
}: StoryCarouselProps) => {
  const {styles: style} = useStyles(styles);

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
    <View style={style.container}>
      <StoryGroup
        userStories={stories}
        showSeenStories={showSeenStories}
        onStoryViewed={handleStoryViewed}
      />
    </View>
  );
};

export default StoryCarousel;

const styles = createStyleSheet({
  container: {
    flex: 1,
  },
});
