import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {PROFILE_IMAGE, PROGRESS_BAR} from '../../constants';
import {useStory} from '../../context/StoryProvider';
import {getStoryProgress} from '../../utils';

interface StoryHeaderComponentProps {
  onPressClose: () => void;
}

const StoryHeaderComponent: React.FC<StoryHeaderComponentProps> = ({
  onPressClose,
}) => {
  const {storyHeader, currentStory, stories} = useStory();

  const {styles: style} = useStyles(styles);

  return (
    <View style={style.container}>
      <View style={style.progressContainer}>
        {Array.from({length: stories.length}).map((_, index) => {
          const progress = Math.max(
            0,
            Math.min(
              1,
              getStoryProgress(
                index,
                currentStory.index,
                currentStory.progress,
              ) || 0,
            ),
          );
          return (
            <View
              key={`progress-${index}-${stories[index]?.id || index}`}
              style={style.progressWrapper}>
              <View
                style={[style.progressBar, {width: `${progress * 100}%`}]}
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
            {stories[currentStory.index] && (
              <Text style={style.username}>
                {stories[currentStory.index].title}
              </Text>
            )}
          </View>
        </View>
        <Pressable onPress={onPressClose} hitSlop={24}>
          <Image
            source={require('../../assets/cross.png')}
            style={style.closeIcon}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(StoryHeaderComponent);

const styles = createStyleSheet({
  container: {
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },

  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },

  profileImage: {
    width: PROFILE_IMAGE.SIZE,
    height: PROFILE_IMAGE.SIZE,
    borderRadius: PROFILE_IMAGE.BORDER_RADIUS,
    borderWidth: PROFILE_IMAGE.BORDER_WIDTH,
    borderColor: PROFILE_IMAGE.BORDER_COLOR,
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
    gap: PROGRESS_BAR.GAP,
    paddingHorizontal: 8,
  },
  progressWrapper: {
    flex: 1,
    overflow: 'hidden',
    height: PROGRESS_BAR.HEIGHT,
    borderRadius: PROGRESS_BAR.BORDER_RADIUS,
    backgroundColor: PROGRESS_BAR.BACKGROUND_COLOR,
    top: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: PROGRESS_BAR.BORDER_RADIUS,
    backgroundColor: PROGRESS_BAR.ACTIVE_COLOR,
  },

  closeIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});
