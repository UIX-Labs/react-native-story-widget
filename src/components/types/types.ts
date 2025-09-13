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

export interface StoryCarouselProps {
  stories: StoriesType[];
  onStoryViewed?: (userId: number, storyId: number) => void;
}


