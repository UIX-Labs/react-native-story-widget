import React from 'react';
import {View} from 'react-native';
import StoryGroup from '../story-group/StoryGroup';
import {StoryCarouselProps} from '../types/types';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const StoryCarousel = ({
  stories,
  showSeenStories = true,
  onStoryViewed,
  renderCustomHeader,
  headerData,
}: StoryCarouselProps) => {
  const {styles: style} = useStyles(styles);

  if (!stories) {
    return;
  }

  return (
    <View style={style.container}>
      <StoryGroup
        userStories={stories}
        showSeenStories={showSeenStories}
        onStoryViewed={onStoryViewed}
        renderCustomHeader={renderCustomHeader}
        customHeaderData={headerData}
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
