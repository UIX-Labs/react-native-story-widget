import React, {useCallback} from 'react';
import {
  Dimensions,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {SCREEN_TAP_THRESHOLDS} from '../../constants';
import {useStory, useStoryMediaControl, useStoryGroup} from '../../context/StoryProvider';
import {transformCloudinaryVideo} from '../../utils';
import Image from '../ui/Image';
import Video from '../ui/Video';

const {width: screenWidth} = Dimensions.get('window');

const StoryMediaComponent: React.FC = () => {
  const {stories, currentStory, isStoryActive} = useStory();

  const {onProgress, onGoToStory, onLongPress, onPressOut, isPaused} =
    useStoryMediaControl();

  const {styles: style} = useStyles(styles);

  const goToStory = useCallback(
    (index: number) => {
      onGoToStory(index);
    },
    [onGoToStory],
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      const {locationX} = event.nativeEvent;
      const tapPosition = locationX / screenWidth;

      if (tapPosition < SCREEN_TAP_THRESHOLDS.LEFT) {
        goToStory(currentStory.index - 1);
      } else if (tapPosition > SCREEN_TAP_THRESHOLDS.RIGHT) {
        goToStory(currentStory.index + 1);
      }
    },
    [currentStory.index, goToStory],
  );

  const handleLongPress = useCallback(() => {
    onLongPress();
  }, [onLongPress]);

  const handlePressOut = useCallback(() => {
    onPressOut();
  }, [onPressOut]);

  const handleProgress = useCallback(
    (
      index: number,
      progress: {currentTime: number; seekableDuration: number},
    ) => {
      onProgress(index, progress);
    },
    [onProgress],
  );

  if (!isStoryActive) return null;

  const index = currentStory.index;
  const story = stories[index];

  if (!story) {
    return null;
  }

  return (
    <Pressable
      key={story.id}
      onPress={handlePress}
      delayLongPress={200}
      onLongPress={handleLongPress}
      onPressOut={handlePressOut}
      style={style.storyContainer}>
      {story.type === 'image' ? (
        <Image
          url={story.url}
          maxTime={
            story.duration
              ? story.duration > 60
                ? story.duration / 1000
                : story.duration
              : 5
          }
          style={StyleSheet.absoluteFillObject}
          active={index === currentStory.index}
          paused={isPaused}
          onProgress={p => handleProgress(index, p)}
        />
      ) : (
        <Video
          style={StyleSheet.absoluteFillObject}
          url={transformCloudinaryVideo(story.url)}
          onEnd={() => goToStory(index + 1)}
          paused={isPaused || index !== currentStory.index}
          onProgress={p => handleProgress(index, p)}
        />
      )}
    </Pressable>
  );
};

const styles = createStyleSheet({
  storyContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});

export default React.memo(StoryMediaComponent);
