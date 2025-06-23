export interface Story {
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
  stories: Story[];
  timestamp?: number;
}

// User-facing customization types only
export interface HeaderData {
  profile?: string;
  username: string;
  title: string;
  timestamp?: number;
  [key: string]: any; // Allow custom fields
}

export interface StoryViewContext {
  story: Story;
  storyIndex: number;
  storyHeader: StoriesType;
  currentProgress: number;
  isActive: boolean;
  isPaused: boolean;
  totalStories: number;
}

export interface CoreStoryFunctionality {
  goToNext: () => void;
  goToPrevious: () => void;
  pause: () => void;
  resume: () => void;
  markAsViewed: () => void;
}

export interface CustomHeaderRenderer {
  (props: {
    headerData: HeaderData;
    renderDefaultProgressHeader: () => React.ReactNode;
  }): React.ReactNode;
}

export interface CustomStoryViewer {
  (props: {
    context: StoryViewContext;
    navigation: CoreStoryFunctionality;
    renderDefaultStory: () => React.ReactNode;
  }): React.ReactNode;
}
export interface StoryCarouselProps {
  stories: StoriesType[];
  showSeenStories?: boolean;
  onStoryViewed?: (userId: number, storyId: number) => void;
  renderCustomHeader?: CustomHeaderRenderer;
  headerData?: (storyHeader: StoriesType) => HeaderData;
  renderHeaderRightContent?: () => React.ReactNode;
  preloadWindow?: number;
  tapThreshold?: number;
  leftTapThreshold?: number;
  rightTapThreshold?: number;
  showHeader?: boolean;
}
