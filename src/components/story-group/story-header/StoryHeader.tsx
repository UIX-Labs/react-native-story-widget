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
import StoryProgressHeader from '../story-tile/StoryProgressHeader';

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

const DEFAULT_STYLES = {
  container: {
    paddingBottom: 10,
    backgroundColor: 'transparent',
  } as const,
  userInfoContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 10,
    marginTop: 10,
  } as const,
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  } as const,
  textContainer: {
    flex: 1,
  } as const,
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold' as const,
  } as const,
  username: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  } as const,
};

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
  const containerStyle = [DEFAULT_STYLES.container, customStyles?.container];
  const userInfoContainerStyle = [
    DEFAULT_STYLES.userInfoContainer,
    customStyles?.userInfoContainer,
  ];
  const profileImageStyle = [
    DEFAULT_STYLES.profileImage,
    customStyles?.profileImage,
  ];
  const textContainerStyle = [
    DEFAULT_STYLES.textContainer,
    customStyles?.textContainer,
  ];
  const titleStyle = [DEFAULT_STYLES.title, customStyles?.title];
  const usernameStyle = [DEFAULT_STYLES.username, customStyles?.username];

  return (
    <View style={containerStyle}>
      <StoryProgressHeader
        storiesCount={storiesCount}
        currentIndex={currentIndex}
        progress={progress}
        isAnimated={isAnimated}
        {...progressHeaderProps}
      />
      <View style={userInfoContainerStyle}>
        <Image source={{uri: storyHeader.profile}} style={profileImageStyle} />
        <View style={textContainerStyle}>
          <Text style={titleStyle}>{storyHeader.title}</Text>
          <Text style={usernameStyle}>{storyHeader.username}</Text>
        </View>
        {renderRightContent && renderRightContent()}
      </View>
    </View>
  );
};

export default StoryHeader;
