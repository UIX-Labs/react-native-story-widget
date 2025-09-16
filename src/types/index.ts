import type {ReactNode} from 'react';

export interface IStory {
  id: number;
  url: string;
  type: 'image' | 'video';
  duration?: number;
  storyId: number;
  isSeen?: boolean;
  showOverlay?: boolean;
  link?: string;
  title?: string;
  username?: string;
  profile?: string;
  timestamp?: number;
}

export interface StoriesType {
  id: number;
  username: string;
  title: string;
  profile: string;
  stories: IStory[];
  timestamp?: number;
}

export interface VideoProgressType {
  currentTime: number;
  seekableDuration: number;
}

export interface StoryContextType {
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
}

export interface StoryMediaControlContextType {
  onProgress: (index: number, progress: VideoProgressType) => void;
  onGoToStory: (index: number) => void;
  onLongPress: () => void;
  onPressOut: () => void;
  hiddenWarmUrl?: string;
  isPaused: boolean;
}

export interface StoryGroupContextType {
  userStories: StoriesType[];
  currentGroupIndex: number;
  setCurrentGroupIndex: React.Dispatch<React.SetStateAction<number>>;
  onPressCloseButton: () => void;
  isScreenFocused: boolean;
}

export interface StoryContextType {
  stories: IStory[];
  storyHeader: StoriesType;
  currentStory: {index: number; progress: number};
  setCurrentStory: React.Dispatch<
    React.SetStateAction<{index: number; progress: number}>
  >;
  isStoryActive: boolean;
  initialStoryIndex: number;
  onStoryMarkedAsViewed?: (storyId: string) => void;
  isPaused: boolean;
  goToStory: (index: number) => void;
  handleLongPress: () => void;
  handlePressOut: () => void;
}

export interface StoryMediaControlContextType {
  onProgress: (index: number, progress: VideoProgressType) => void;
  onGoToStory: (index: number) => void;
  onLongPress: () => void;
  onPressOut: () => void;
  hiddenWarmUrl?: string;
  isPaused: boolean;
}

export interface StoryGroupProviderProps {
  children: ReactNode;
  userStories: StoriesType[];
  currentGroupIndex: number;
  setCurrentGroupIndex: React.Dispatch<React.SetStateAction<number>>;
  onPressCloseButton: () => void;
  isScreenFocused: boolean;
}

export interface StoryMediaControlProviderProps {
  children: ReactNode;
}
