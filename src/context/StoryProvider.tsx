import type React from 'react';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  IStory,
  StoriesType,
  StoryContextType,
  StoryGroupContextType,
  StoryGroupProviderProps,
  StoryMediaControlContextType,
  StoryMediaControlProviderProps,
  VideoProgressType,
} from '../types';
import { clamp } from '../utils';

const StoryContext = createContext<StoryContextType | null>(null);
const StoryGroupContext = createContext<StoryGroupContextType | null>(null);

const StoryMediaControlContext =
  createContext<StoryMediaControlContextType | null>(null);

export const useStoryGroup = () => {
  const context = useContext(StoryGroupContext);
  if (!context) {
    throw new Error('useStoryGroup must be used within a StoryGroupProvider');
  }
  return context;
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const useStoryMediaControl = () => {
  const context = useContext(StoryMediaControlContext);
  if (!context) {
    throw new Error(
      'useStoryMediaControl must be used within a StoryMediaControlProvider',
    );
  }
  return context;
};

export const StoryGroupProvider: React.FC<StoryGroupProviderProps> = ({
  children,
  userStories,
  currentGroupIndex,
  setCurrentGroupIndex,
  onPressCloseButton,
  isScreenFocused,
  onLastStoryOfGroupPlayed,
}) => {
  const value: StoryGroupContextType = {
    userStories,
    currentGroupIndex,
    setCurrentGroupIndex,
    onPressCloseButton,
    isScreenFocused,
    onLastStoryOfGroupPlayed,
  };

  return (
    <StoryGroupContext.Provider value={value}>
      {children}
    </StoryGroupContext.Provider>
  );
};

interface StoryProviderProps {
  children: ReactNode;
  stories: IStory[];
  storyHeader: StoriesType;
  onStoryMarkedAsViewed?: (storyId: string) => void;
  isStoryActive: boolean;
  initialStoryIndex: number;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({
  children,
  stories,
  storyHeader,
  onStoryMarkedAsViewed,
  isStoryActive,
  initialStoryIndex,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(!isStoryActive);

  const [currentStory, setCurrentStory] = useState({
    index: initialStoryIndex,
    progress: 0,
  });

  const isLongPressingRef = useRef<boolean>(false);
  const {setCurrentGroupIndex, isScreenFocused, currentGroupIndex, userStories, onLastStoryOfGroupPlayed} = useStoryGroup();

  useEffect(() => {
    setIsPaused(!isStoryActive || !isScreenFocused);
  }, [isStoryActive, isScreenFocused]);


  const onStoryViewed = useCallback((type: 'next' | 'previous') => {    
    if (type === 'previous') {
      setCurrentGroupIndex(p => p - 1);
    } else {
      const nextIndex = currentGroupIndex + 1;
      const isLastGroup = nextIndex >= userStories.length;      
      setCurrentGroupIndex(p => p + 1);
      onLastStoryOfGroupPlayed?.(isLastGroup);
    }
  }, [setCurrentGroupIndex, currentGroupIndex, userStories.length, onLastStoryOfGroupPlayed]);

  const goToStory = useCallback(
    (index: number) => {
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
    [stories.length, onStoryViewed],
  );

  const handleLongPress = useCallback(() => {
    isLongPressingRef.current = true;
    setIsPaused(true);
  }, []);

  const handlePressOut = useCallback(() => {
    if (!isLongPressingRef.current) return;
    isLongPressingRef.current = false;
    
    if (isStoryActive) {
      setIsPaused(false);
    }
  }, [isStoryActive]);

  const value: StoryContextType = {
    stories,
    storyHeader,
    currentStory,
    setCurrentStory,
    isStoryActive,
    initialStoryIndex,
    onStoryMarkedAsViewed,
    isPaused,
    goToStory,
    handleLongPress,
    handlePressOut,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
};

export const StoryMediaControlProvider: React.FC<
  StoryMediaControlProviderProps
> = ({children}) => {
  const {
    currentStory,
    setCurrentStory,
    goToStory,
    handleLongPress,
    handlePressOut,
    isPaused,
    stories,
    onStoryMarkedAsViewed,
  } = useStory();

  const handleProgress = useCallback(
    (index: number, progress: VideoProgressType) => {
      if (index !== currentStory.index) return;

      const {currentTime, seekableDuration} = progress;
      if (seekableDuration <= 0) return;

      const value = currentTime / seekableDuration;
      setCurrentStory(cs => ({index: cs.index, progress: Math.min(1, value)}));

      if (value >= 0.5) {
        onStoryMarkedAsViewed?.(stories[index].storyId.toString());
        goToStory(index + 1);
      }
    },
    [
      currentStory.index,
      goToStory,
      stories,
      onStoryMarkedAsViewed,
      setCurrentStory,
    ],
  );

  const value: StoryMediaControlContextType = {
    onProgress: handleProgress,
    onGoToStory: goToStory,
    onLongPress: handleLongPress,
    onPressOut: handlePressOut,
    isPaused,
  };

  return (
    <StoryMediaControlContext.Provider value={value}>
      {children}
    </StoryMediaControlContext.Provider>
  );
};
