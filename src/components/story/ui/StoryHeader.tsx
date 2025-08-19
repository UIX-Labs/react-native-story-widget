/* eslint-disable react/display-name */
import React, {useContext} from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {StoriesType} from '../../types/types';
import {StoryContext} from './Story';

export interface StoryHeaderStyles {
  container?: StyleProp<ViewStyle>;
  userInfoContainer?: StyleProp<ViewStyle>;
  profileImage?: StyleProp<ImageStyle>;
  textContainer?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  username?: StyleProp<TextStyle>;
}

interface StoryHeaderProps {
  storyHeader: StoriesType;
  storiesCount: number;
  progressHeaderProps?: {
    progressWrapperStyle?: StyleProp<ViewStyle>;
    progressBarStyle?: StyleProp<ViewStyle>;
  };
  onPressClose: () => void;
}

const StoryHeader = React.memo(
  ({
    storyHeader,
    storiesCount,
    progressHeaderProps,
    onPressClose,
  }: StoryHeaderProps) => {
    const {
      currentStory: {index: currentStoryIndex, progress: currentStoryProgress},
    } = useContext(StoryContext);

    const {styles: style} = useStyles(styles);

    function getProgress(index: number) {
      if (index === currentStoryIndex) {
        return currentStoryProgress;
      }

      if (index < currentStoryIndex) {
        return 1;
      }

      return 0;
    }

    return (
      <View style={style.container}>
        <View style={style.progressContainer}>
          {Array.from({length: storiesCount}).map((_, index) => {
            const p = Math.max(0, Math.min(1, Number(getProgress(index)) || 0));
            return (
              <View
                key={index}
                style={[
                  style.progressWrapper,
                  progressHeaderProps?.progressWrapperStyle,
                ]}>
                <View
                  style={[
                    style.progressBar,
                    progressHeaderProps?.progressBarStyle,
                    {width: `${p * 100}%`},
                  ]}
                />
              </View>
            );
          })}
        </View>

        <View style={style.userInfoContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
            }}>
            <Image
              source={{uri: storyHeader.profile}}
              style={style.profileImage}
            />

            <View style={style.textContainer}>
              <Text style={style.title}>{storyHeader.title}</Text>
              {storyHeader.stories[currentStoryIndex] && (
                <Text style={style.username}>
                  {storyHeader.stories[currentStoryIndex].title}
                </Text>
              )}
            </View>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={onPressClose}
            hitSlop={24}>
            <Image
              source={require('@assets/cross.png')}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
      </View>
    );
  },
);

export default StoryHeader;

const styles = createStyleSheet({
  container: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },

  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  username: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
  },
  progressWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#464646',
    top: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#00ffd1',
  },

  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  closeIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
});
