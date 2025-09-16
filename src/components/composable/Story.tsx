import type React from 'react';

import {
  StoryMediaControlProvider,
  StoryProvider,
} from '../../context/StoryProvider';
import type {IStory, StoriesType} from '../../types';

interface StoryProps {
  children: React.ReactNode;
  stories: IStory[];
  storyHeader: StoriesType;
  onStoryMarkedAsViewed?: (storyId: string) => void;
  isStoryActive: boolean;
  initialStoryIndex: number;
  onStoryStart?: (storyId: string) => void;
}

const Story: React.FC<StoryProps> = ({
  children,
  stories,
  storyHeader,
  onStoryMarkedAsViewed,
  isStoryActive,
  initialStoryIndex,
}) => {
  return (
    <StoryProvider
      stories={stories}
      storyHeader={storyHeader}
      onStoryMarkedAsViewed={onStoryMarkedAsViewed}
      isStoryActive={isStoryActive}
      initialStoryIndex={initialStoryIndex}>
      <StoryMediaControlProvider>{children}</StoryMediaControlProvider>
    </StoryProvider>
  );
};

export {Story};
