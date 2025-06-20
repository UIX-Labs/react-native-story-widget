import React from 'react';
import {
  View,
  Text,
  Image,
  ViewStyle,
  StyleProp,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {StoriesType} from '../../types/types';
import StoryProgressHeader from './StoryProgressHeader';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

interface StoryHeaderStyles {
  container?: StyleProp<ViewStyle>;
  userInfoContainer?: StyleProp<ViewStyle>;
  profileImage?: StyleProp<ImageStyle>;
  textContainer?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  username?: StyleProp<TextStyle>;
}

interface StoryHeaderProps {
  storyHeader: StoriesType;
  currentIndex: number;
  progress: number | any;
  isAnimated: boolean;
  storiesCount: number;
  styles?: StoryHeaderStyles;
  progressHeaderProps?: Partial<
    React.ComponentProps<typeof StoryProgressHeader>
  >;
  renderRightContent?: () => React.ReactNode;
}

const StoryHeader = ({
  storyHeader,
  currentIndex,
  progress,
  isAnimated,
  storiesCount,
  styles: customStyles,
  progressHeaderProps,
  renderRightContent,
}: StoryHeaderProps) => {
  const {styles: style} = useStyles(styles);

  return (
    <View style={[style.container, customStyles?.container]}>
      <StoryProgressHeader
        storiesCount={storiesCount}
        currentIndex={currentIndex}
        progress={progress}
        isAnimated={isAnimated}
        {...progressHeaderProps}
      />

      <View style={[style.userInfoContainer, customStyles?.userInfoContainer]}>
        {storyHeader.profile && (
          <Image
            source={{uri: storyHeader.profile}}
            style={[style.profileImage, customStyles?.profileImage]}
          />
        )}
        <View style={[style.textContainer, customStyles?.textContainer]}>
          <Text style={[style.title, customStyles?.title]}>
            {storyHeader.title}
          </Text>
          <Text style={[style.username, customStyles?.username]}>
            {storyHeader.username}
          </Text>
        </View>

        {renderRightContent && renderRightContent()}
      </View>
    </View>
  );
};

export default StoryHeader;

const styles = createStyleSheet({
  container: {
    top: 40,
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
});
