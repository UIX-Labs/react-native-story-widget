import type React from 'react';
import {
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import {Dimensions, Platform, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet} from 'react-native-unistyles';

import {StoryGroupProvider} from '../../context/StoryProvider';
import type {StoriesType} from '../../types';

const screenWidth = Dimensions.get('window').width;

interface StoryGroupListProps {
  renderItem: (props: {
    item: StoriesType;
    index: number;
    isActive: boolean;
  }) => ReactElement;
  userStories: StoriesType[];
  initialGroupIndex: number;
  onPressCloseButton: () => void;
  isScreenFocused: boolean;
  style?: ViewStyle;
  onLastStoryOfGroupPlayed?: (isLastGroup: boolean) => void;
}

const StoryGroup: React.FC<StoryGroupListProps> = ({
  renderItem,
  style,
  userStories,
  initialGroupIndex,
  onPressCloseButton,
  isScreenFocused,
  onLastStoryOfGroupPlayed,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);

  const [insetTop, setInsetTop] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const previousOffsetX = useRef(screenWidth * initialGroupIndex);

  useEffect(() => {
    if (
      !flatListRef.current ||
      currentGroupIndex < 0 ||
      userStories.length <= currentGroupIndex
    ) {
      return;
    }

    if (Platform.OS === 'android') {
      flatListRef.current.scrollToIndex({
        index: currentGroupIndex,
        animated: false,
      });
    } else {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: currentGroupIndex,
          animated: false,
        });
      });
    }
  }, [currentGroupIndex, userStories.length]);

  useEffect(() => {
    setInsetTop(p => (p !== null ? p : insets.top));
  }, [insets.top]);

  const defaultRenderItem = useCallback(
    ({item, index}: {item: StoriesType; index: number}) => {
      const isActive = currentGroupIndex === index;

      return (
        <View style={{width: screenWidth}}>
          {renderItem({item, index, isActive})}
        </View>
      );
    },
    [currentGroupIndex, isScreenFocused, renderItem],
  );

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffsetX = e.nativeEvent.contentOffset.x;

      if (currentOffsetX === previousOffsetX.current) {
        return;
      }

        if (currentOffsetX > previousOffsetX.current) {
          setCurrentGroupIndex(currentGroupIndex + 1);
        } else {
          setCurrentGroupIndex(currentGroupIndex - 1);
        }

      previousOffsetX.current = currentOffsetX;
    },
    [],
  );

  return (
    <StoryGroupProvider
      userStories={userStories}
      currentGroupIndex={currentGroupIndex}
      setCurrentGroupIndex={setCurrentGroupIndex}
      onPressCloseButton={onPressCloseButton}
      isScreenFocused={isScreenFocused}
      onLastStoryOfGroupPlayed={onLastStoryOfGroupPlayed}>
      <View style={[defaultStyles.container, style]}>
        <FlatList
          ref={flatListRef}
          data={userStories}
          renderItem={defaultRenderItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          pagingEnabled
          contentContainerStyle={{paddingTop: insetTop}}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={style}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
          windowSize={10}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={false}
          getItemLayout={(_data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
      </View>
    </StoryGroupProvider>
  );
};

export {StoryGroup};

const defaultStyles = createStyleSheet({
  container: {
    flex: 1,
    overflow: 'hidden',
    width: screenWidth,
  },
});
