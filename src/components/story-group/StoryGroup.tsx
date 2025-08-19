import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {clamp} from '../../shared/lib/clamp';
import {Story} from '../story';
import {StoriesType} from '../types/types';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface StoryGroupProps {
  userStories: StoriesType[];
  initialGroupIndex: number;
  initialStoryIndex: number;
  markSeen: (storyId: string) => void;
  onPressCloseButton: () => void;
}

const StoryGroup = ({
  userStories,
  initialGroupIndex,
  initialStoryIndex,
  markSeen,
  onPressCloseButton,
}: StoryGroupProps) => {
  const {styles: style} = useStyles(styles);
  const [insetTop, setInsetTop] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (initialGroupIndex > 0 && userStories.length > initialGroupIndex) {
      flatListRef.current?.scrollToIndex({
        index: initialGroupIndex,
        animated: false,
      });
    }
  }, [initialGroupIndex]);

  useEffect(() => {
    setInsetTop(p => {
      if (p !== null) {
        return p;
      }

      return insets.top;
    });
  }, [insets.top]);

  const onStoryViewed = useCallback(
    (index: number, type: 'next' | 'previous') => {
      if (index === userStories.length - 1) {
        return;
      }

      if (type === 'previous') {
        setCurrentStoryIndex(index - 1);
        flatListRef.current?.scrollToIndex({index: index - 1, animated: true});
      } else {
        setCurrentStoryIndex(index + 1);
        flatListRef.current?.scrollToIndex({index: index + 1, animated: true});
      }
    },
    [userStories.length],
  );

  const renderUserStory = useCallback(
    ({item, index}: {item: StoriesType; index: number}) => {
      const storyInitialIndex =
        index === initialGroupIndex ? initialStoryIndex : 0;
      return (
        <View
          style={[
            {
              width: screenWidth,
              height: screenHeight,
            },
            style.container,
          ]}
          key={index}>
          <Story
            stories={item.stories}
            storyHeader={item}
            onStoryViewed={type => onStoryViewed(index, type)}
            isStoryActive={currentStoryIndex === index}
            initialStoryIndex={storyInitialIndex}
            onStoryMarkedAsViewed={markSeen}
            onPressCloseButton={onPressCloseButton}
          />
        </View>
      );
    },
    [style.container, onStoryViewed, currentStoryIndex],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setCurrentStoryIndex(
        clamp(
          Math.ceil(
            +e.nativeEvent.contentOffset.x.toFixed(0) / +screenWidth.toFixed(0),
          ),
          0,
          userStories.length - 1,
        ),
      );
    },
    [userStories.length],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={userStories}
      renderItem={renderUserStory}
      keyExtractor={item => item.id.toString()}
      horizontal
      pagingEnabled
      contentContainerStyle={{paddingTop: insetTop}}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      scrollEnabled={true}
      bounces={false}
      windowSize={3}
      initialNumToRender={1}
      stickyHeaderIndices={[0]}
      maxToRenderPerBatch={1}
      removeClippedSubviews={false}
      getItemLayout={(_data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index,
      })}
    />
  );
};

export default StoryGroup;

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
