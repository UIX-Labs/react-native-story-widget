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

export type ReactionType = '❤️' | '👏' | '👍';

export interface StoryReactionEmoji {
  id: string;
  name: string;
  image: string;
}

export interface StoryReaction {
  storyId: string;
  userId: number;
  reaction: ReactionType;
  timestamp: number;
}

export interface StoryReactionProps {
  onReaction?: (storyId: string, reaction: ReactionType) => void;
  reactions?: StoryReaction[];
  currentUserId?: number;
  storyReactionEmojis?: StoryReactionEmoji[];
}
