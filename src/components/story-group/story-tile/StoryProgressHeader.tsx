import React from 'react';
import {View, Animated, ViewStyle, StyleProp} from 'react-native';

interface ProgressBarStyle {
  container?: StyleProp<ViewStyle>;
  wrapper?: StyleProp<ViewStyle>;
  bar?: StyleProp<ViewStyle>;
}

interface StoryProgressHeaderProps {
  storiesCount: number;
  currentIndex: number;
  progress: number | Animated.Value;
  isAnimated?: boolean;
  styles?: ProgressBarStyle;
  containerStyle?: StyleProp<ViewStyle>;
  spacing?: number;
  barHeight?: number;
  backgroundColor?: string;
  progressColor?: string;
  progressOpacity?: number;
  topSpacing?: number;
  horizontalSpacing?: number;
  renderProgressBar?: (props: {
    index: number;
    progress: number | Animated.Value;
    isAnimated: boolean;
    defaultStyles: ProgressBarStyle;
  }) => React.ReactNode;
}

const DEFAULT_STYLES = {
  progressContainer: {
    position: 'absolute' as const,
    flexDirection: 'row' as const,
    zIndex: 2,
  } as const,
  progressBarWrapper: {
    flex: 1,
    overflow: 'hidden' as const,
  } as const,
  progressBar: {
    height: '100%',
  } as const,
};

const StoryProgressHeader = ({
  storiesCount,
  currentIndex,
  progress,
  isAnimated = false,
  styles: customStyles,
  containerStyle,
  spacing = 4,
  barHeight = 3,
  backgroundColor = 'rgba(255,255,255,0.3)',
  progressColor = 'white',
  progressOpacity = 1,
  topSpacing = 0,
  horizontalSpacing = 0,
  renderProgressBar,
}: StoryProgressHeaderProps) => {
  const containerStyles: StyleProp<ViewStyle> = [
    DEFAULT_STYLES.progressContainer,
    {
      top: topSpacing,
      left: horizontalSpacing,
      right: horizontalSpacing,
      gap: spacing,
    },
    containerStyle,
    customStyles?.container,
  ];

  const wrapperStyles: StyleProp<ViewStyle> = [
    DEFAULT_STYLES.progressBarWrapper,
    {
      height: barHeight,
      backgroundColor,
      borderRadius: barHeight / 2,
    },
    customStyles?.wrapper,
  ];

  const barStyles: StyleProp<ViewStyle> = [
    DEFAULT_STYLES.progressBar,
    {
      backgroundColor: progressColor,
      opacity: progressOpacity,
      borderRadius: barHeight / 2,
    },
    customStyles?.bar,
  ];

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
    <View style={containerStyles}>
      {Array.from({length: storiesCount}).map((_, index) => {
        const currentProgress = getProgress(index);
        const isCurrentAnimated = isAnimated && index === currentIndex;

        return (
          <View key={index} style={wrapperStyles}>
            {renderProgressBar
              ? renderProgressBar({
                  index,
                  progress: currentProgress,
                  isAnimated: isCurrentAnimated,
                  defaultStyles: {
                    wrapper: wrapperStyles,
                    bar: barStyles,
                    container: containerStyles,
                  },
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
