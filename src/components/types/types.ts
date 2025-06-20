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

export interface StoryCarouselProps {
  stories: StoriesType[];
  onComplete?: (viewedStories?: boolean[][]) => void;
  onChangePosition?: (progressIndex: number, storyIndex: number) => void;
  transitionMode?: 'Default' | 'Cube' | 'Scale';
  renderOverlayView?: (item?: Story) => React.JSX.Element;
  overlayViewPosition?: 'top' | 'middle' | 'bottom';
  showSeenStories?: boolean;
  onStoryViewed?: (userId: number, storyId: number) => void;
  renderHeaderRightContent?: () => React.ReactNode;
  headerProps?: {
    styles?: {
      container?: any;
      userInfoContainer?: any;
      profileImage?: any;
      textContainer?: any;
      title?: any;
      username?: any;
    };
    progressHeaderProps?: {
      styles?: {
        container?: any;
        wrapper?: any;
        bar?: any;
      };
      spacing?: number;
      barHeight?: number;
      backgroundColor?: string;
      progressColor?: string;
      progressOpacity?: number;
      topSpacing?: number;
      horizontalSpacing?: number;
    };
  };
}
