import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import BottomSheet from '../base-components/BottomSheet';
import StoryTile from './story-tile/StoryTile';
import {Story, StoriesType} from '../types/types';

interface StoryViewerProps {
  isVisible: boolean;
  onClose: () => void;
  stories: Story[];
  storyHeader: StoriesType;
  onComplete?: () => void;
  onStoryViewed?: (storyId: number) => void;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const StoryViewer: React.FC<StoryViewerProps> = ({
  isVisible,
  onClose,
  stories,
  storyHeader,
  onComplete,
  onStoryViewed,
}) => {
  const handleComplete = () => {
    onClose();
    onComplete?.();
  };

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      possibleHeights={[`${SCREEN_HEIGHT}px`]}
      enableDynamicSizing={false}
      backgroundStyle={styles.bottomSheetBackground}>
      <StoryTile
        stories={stories}
        storyHeader={storyHeader}
        onComplete={handleComplete}
        onStoryViewed={onStoryViewed}
        isActive={isVisible}
        styles={{
          container: styles.storyContainer,
        }}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#000',
  },
  storyContainer: {
    height: SCREEN_HEIGHT,
  },
});

export default StoryViewer;
