import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Easing} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {clamp} from '../../shared/lib/clamp';
import {Story} from '../story';
import {StoriesType} from '../types/types';
import {useNavigation} from '@react-navigation/native';

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
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialGroupIndex);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const panY = useRef(new Animated.Value(0)).current;

  const THRESHOLD = screenHeight * 0.1;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },

      onPanResponderMove: Animated.event([null, {dy: panY}], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gestureState) => {
        const {dy} = gestureState;

        if (dy > THRESHOLD) {
          // Smooth exit
          Animated.timing(panY, {
            toValue: screenHeight,
            duration: 200, // smoother
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            navigation.goBack();
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            bounciness: 8,
            speed: 12,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (
      !flatListRef.current ||
      initialGroupIndex < 0 ||
      userStories.length <= initialGroupIndex
    ) {
      return;
    }

    if (Platform.OS === 'android') {
      flatListRef.current.scrollToIndex({
        index: initialGroupIndex,
        animated: false,
      });
    } else {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: initialGroupIndex,
          animated: false,
        });
      });
    }
  }, []);

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
    [onStoryViewed, currentStoryIndex, initialStoryIndex],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setCurrentStoryIndex(
        clamp(
          Platform.OS === 'ios'
            ? Math.floor(
                +e.nativeEvent.contentOffset.x.toFixed(0) /
                  +screenWidth.toFixed(0),
              )
            : Math.ceil(
                +e.nativeEvent.contentOffset.x.toFixed(0) /
                  +screenWidth.toFixed(0),
              ),
          0,
          userStories.length - 1,
        ),
      );
    },
    [userStories.length],
  );

  const backgroundOpacity = panY.interpolate({
    inputRange: [0, screenHeight * 0.3], // up to 30% of screen height
    outputRange: [1, 0], // fully visible → fully transparent
    extrapolate: 'clamp',
  });

  if (Platform.OS === 'android') {
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          backgroundColor: 'black',
          transform: [{translateY: panY}],
          opacity: backgroundOpacity,
        }}>
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
      </Animated.View>
    );
  }

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
