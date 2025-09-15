import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Image as RNImage, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {clamp} from '../../../shared/lib/clamp';
import type {IStory, StoriesType} from '../../types/types';
import StoryHeader from './StoryHeader';
import StoryMedia from './StoryMedia';

export const StoryContext = createContext<{
  currentStory: {
    index: number;
    progress: number;
  };
  setCurrentStory: React.Dispatch<
    React.SetStateAction<{
      index: number;
      progress: number;
    }>
  >;
}>({currentStory: {index: 0, progress: 0}, setCurrentStory: () => {}});

export const StoryMediaControlContext = createContext<{
  onProgress: (
    index: number,
    progress: {currentTime: number; seekableDuration: number},
  ) => void;
  onGoToStory: (index: number) => void;
  onLongPress: () => void;
  onPressOut: () => void;
  hiddenWarmUrl?: string;
  isPaused: boolean;
}>({
  onProgress: () => {},
  onGoToStory: () => {},
  onLongPress: () => {},
  onPressOut: () => {},
  hiddenWarmUrl: undefined,
  isPaused: true,
});

export interface StoryTileProps {
  stories: IStory[];
  storyHeader: StoriesType;
  onStoryViewed: (type: 'next' | 'previous') => void;
  onStoryMarkedAsViewed?: (storyId: string) => void;
  isStoryActive: boolean;
  initialStoryIndex: number;
  onPressCloseButton: () => void;
  onStoryStart?: (storyId: string) => void;
}

const Story: React.FC<StoryTileProps> = ({
  stories,
  storyHeader,
  onStoryViewed,
  onStoryMarkedAsViewed,
  isStoryActive,
  initialStoryIndex,
  onPressCloseButton,
  onStoryStart,
}) => {
  const [currentStory, setCurrentStory] = useState<{
    index: number;
    progress: number;
  }>({index: initialStoryIndex, progress: 0});

  const {styles: style} = useStyles(styles);

  const contextValue = useMemo(
    () => ({currentStory, setCurrentStory}),
    [currentStory],
  );

  const isLongPressingRef = useRef<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(!isStoryActive);
  const [hiddenWarmUrl, setHiddenWarmUrl] = useState<string | undefined>();

  useEffect(() => {
    setIsPaused(!isStoryActive);
  }, [isStoryActive]);

  // Call onStoryStart when story becomes active or when current story changes
  useEffect(() => {
    if (isStoryActive && onStoryStart) {
      const currentStoryData = stories[currentStory.index];
      if (currentStoryData) {
        onStoryStart(currentStoryData.storyId.toString());
      }
    }
  }, [isStoryActive, currentStory.index, onStoryStart, stories, storyHeader.id]);

  useEffect(() => {
    const next = stories[currentStory.index + 1];
    if (!next) {
      setHiddenWarmUrl(undefined);
      return;
    }

    if (next.type === 'image') {
      RNImage.prefetch(next.url).catch(() => {});
      setHiddenWarmUrl(undefined);
    } else {
      setHiddenWarmUrl(next.url);
    }
  }, [stories, currentStory.index]);

  const goToStory = useCallback(
    (index: number) => {
      if (index === currentStory.index) {
        return;
      }

      if (index < 0) {
        onStoryViewed('previous');
        return;
      }

      if (index >= stories.length) {
        onStoryViewed('next');
        return;
      }

      const newIndex = clamp(index, 0, stories.length - 1);
      setCurrentStory({index: newIndex, progress: 0});
    },
    [currentStory.index, stories.length, onStoryViewed],
  );

  const handleLongPress = useCallback(() => {
    isLongPressingRef.current = true;
    setIsPaused(true);
  }, []);

  const handlePressOut = useCallback(() => {
    if (!isLongPressingRef.current) {
      return;
    }
    isLongPressingRef.current = false;
    if (isStoryActive) {
      setIsPaused(false);
    }
  }, [isStoryActive]);

  const handleProgress = useCallback(
    (
      index: number,
      progress: {currentTime: number; seekableDuration: number},
    ) => {
      if (index !== currentStory.index) {
        return;
      }

      const {currentTime, seekableDuration} = progress;

      if (seekableDuration <= 0) {
        return;
      }

      const value = currentTime / seekableDuration;

      setCurrentStory(cs => ({index: cs.index, progress: Math.min(1, value)}));

      if (value >= 1) {
        onStoryMarkedAsViewed?.(stories[index].storyId.toString());
        goToStory(index + 1);
      }
    },
    [currentStory.index, goToStory, stories, onStoryMarkedAsViewed],
  );

  return (
    <StoryContext.Provider value={contextValue}>
      <View style={[style.container]}>
        {isStoryActive && (
          <StoryMediaControlContext.Provider
            value={{
              onProgress: handleProgress,
              onGoToStory: goToStory,
              onLongPress: handleLongPress,
              onPressOut: handlePressOut,
              hiddenWarmUrl,
              isPaused,
            }}>
            <StoryMedia stories={stories} />
          </StoryMediaControlContext.Provider>
        )}

        <View style={style.headerOverlay}>
          <StoryHeader
            storyHeader={storyHeader}
            storiesCount={stories.length}
            onPressClose={onPressCloseButton}
          />
        </View>
      </View>
    </StoryContext.Provider>
  );
};

const styles = createStyleSheet({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default React.memo(Story);
