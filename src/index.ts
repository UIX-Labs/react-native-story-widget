<<<<<<< Updated upstream
// Main components
export {default as Story} from './components/story/ui/Story';
export {default as StoryGroup} from './components/story-group/StoryGroup';

// Types
export type {
  IStory,
  StoriesType,
  StoryCarouselProps,
} from './components/types/types';

// Contexts
export {
  StoryContext,
  StoryMediaControlContext,
} from './components/story/ui/Story';

// Utility components
export {default as Image} from './shared/ui/Image';
export {default as Video} from './shared/ui/Video';
=======
export {
  Story,
  StoryGroup,
  StoryGroupProvider,
  StoryHeaderComponent,
  StoryMediaComponent,
  StoryMediaControlProvider,
  StoryProvider,
  useStory,
  useStoryGroup,
  useStoryMediaControl,
} from './components/composable';

export {Image, Video} from './components/ui';

export type {
  IStory,
  StoriesType,
  StoryContextType,
  StoryMediaControlContextType,
  VideoProgressType,
} from './types';

export {
  calculateProgress,
  clamp,
  formatDuration,
  getNextStoryIndex,
  getPreviousStoryIndex,
  getStoryProgress,
  transformCloudinaryVideo,
} from './utils';
>>>>>>> Stashed changes
