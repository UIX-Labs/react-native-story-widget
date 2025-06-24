import {StyleProp, ViewStyle, ImageStyle} from 'react-native';
import {IStory} from '../types/types';

export interface VideoLoadingState {
  loading: boolean;
  error: string | null;
  buffering: boolean;
  bufferingTimeout?: NodeJS.Timeout;
}

export interface StoryTileStyles {
  container?: StyleProp<ViewStyle>;
  storyWrapper?: StyleProp<ViewStyle>;
  scrollView?: StyleProp<ViewStyle>;
  storyContainer?: StyleProp<ViewStyle>;
  image?: StyleProp<ImageStyle>;
  headerContainer?: StyleProp<ViewStyle>;
}

export interface StoryGestureHandlers {
  onStoryPress?: (story: IStory, index: number) => void;
  onStoryLongPress?: (story: IStory, index: number) => void;
  onStoryStart?: (story: IStory, index: number) => void;
  onStoryEnd?: (story: IStory, index: number) => void;
}

export interface StoryProgressHandlers {
  onComplete?: () => void;
  onStoryViewed?: (storyId: number) => void;
}
