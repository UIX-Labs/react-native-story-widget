import React, {useCallback, useContext} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import Image from '../../../shared/ui/Image';
import Video from '../../../shared/ui/Video';
import type {IStory} from '../../types/types';
import {StoryContext} from './Story';

interface StoryTileProps {
  stories: IStory[];
}

interface VideoProgressType {
  currentTime: number;
  seekableDuration: number;
}

import {StoryMediaControlContext} from './Story';

interface StoryMediaInjectedProps {
  onProgress: (index: number, progress: VideoProgressType) => void;
  onGoToStory: (index: number) => void;
  onLongPress: () => void;
  onPressOut: () => void;
  hiddenWarmUrl?: string;
  isPaused: boolean;
}

function transformCloudinaryVideo(url: string, quality = 'auto') {
  const transformation = `q_${quality},f_auto`;
  return url.replace('/upload/', `/upload/${transformation}/`);
}

const {width: screenWidth} = Dimensions.get('window');
const LEFT_TAP_THRESHOLD = 0.3;
const RIGHT_TAP_THRESHOLD = 0.7;

const StoryMedia: React.FC<StoryTileProps> = ({stories}) => {
  const {currentStory} = useContext(StoryContext);
  const {
    onProgress,
    onGoToStory,
    onLongPress,
    onPressOut,
    hiddenWarmUrl,
    isPaused,
  } = useContext(StoryMediaControlContext) as StoryMediaInjectedProps;

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

      if (tapPosition < LEFT_TAP_THRESHOLD) {
        goToStory(currentStory.index - 1);
      } else if (tapPosition > RIGHT_TAP_THRESHOLD) {
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
    (index: number, progress: VideoProgressType) => {
      onProgress(index, progress);
    },
    [onProgress],
  );

  const index = currentStory.index;
  const story = stories[index];

  if (!story) {
    return null;
  }

  return (
    <>
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

      {hiddenWarmUrl ? (
        <View style={{width: 1, height: 1, opacity: 0}} pointerEvents="none">
          <Video
            style={{width: 1, height: 1}}
            url={hiddenWarmUrl}
            onProgress={() => {}}
            muted
            paused={true}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = createStyleSheet({
  storyContainer: {
    width: screenWidth,
    height: '100%',
    backgroundColor: '#000',
  },
});

export default React.memo(StoryMedia);
