import React from 'react';
import {View, Animated, ViewStyle, StyleProp} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

interface StoryProgressHeaderProps {
  storiesCount: number;
  currentIndex: number;
  progress: number | Animated.Value;
  isAnimated?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  progressWrapperStyle?: StyleProp<ViewStyle>;
  progressBarStyle?: StyleProp<ViewStyle>;
  renderProgressBar?: (props: {
    index: number;
    progress: number | Animated.Value;
    isAnimated: boolean;
  }) => React.ReactNode;
}

const StoryProgressHeader = ({
  storiesCount,
  currentIndex,
  progress,
  isAnimated = false,
  containerStyle,
  progressWrapperStyle,
  progressBarStyle,
  renderProgressBar,
}: StoryProgressHeaderProps) => {
  const {styles: style} = useStyles(styles);

  const barStyles = [style.progressBar, progressBarStyle];

  const getProgress = (index: number) => {
    if (index < currentIndex) {
      return 1;
    }
    if (index > currentIndex) {
      return 0;
    }
    return progress;
  };

  const renderDefaultProgressBar = (
    index: number,
    currentProgress: number | Animated.Value,
    isCurrentAnimated: boolean,
  ) => {
    return isCurrentAnimated && typeof currentProgress !== 'number' ? (
      <Animated.View
        style={[
          barStyles,
          {
            width: (currentProgress as Animated.Value).interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    ) : (
      <View
        style={[barStyles, {width: `${(currentProgress as number) * 100}%`}]}
      />
    );
  };

  return (
    <View style={[style.progressContainer, containerStyle]}>
      {Array.from({length: storiesCount}).map((_, index) => {
        const currentProgress = getProgress(index);
        const isCurrentAnimated = isAnimated && index === currentIndex;

        return (
          <View
            key={index}
            style={[style.progressWrapper, progressWrapperStyle]}>
            {renderProgressBar
              ? renderProgressBar({
                  index,
                  progress: currentProgress,
                  isAnimated: isCurrentAnimated,
                })
              : renderDefaultProgressBar(
                  index,
                  currentProgress,
                  isCurrentAnimated,
                )}
          </View>
        );
      })}
    </View>
  );
};

export default StoryProgressHeader;

const styles = createStyleSheet({
  progressContainer: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 2,
    top: 4,
    left: 0,
    right: 0,
    gap: 4,
  },

  progressWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: 10,
  },

  progressBar: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: 'white',
  },
});
