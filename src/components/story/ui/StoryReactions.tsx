import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {StoryReactionEmoji} from '../../types/types';

interface StoryReactionsProps {
  onReaction: (reaction: string) => void;
  isVisible: boolean;
  storyReactionEmojis?: StoryReactionEmoji[];
}

const StoryReactions: React.FC<StoryReactionsProps> = ({
  onReaction,
  isVisible,
  storyReactionEmojis,
}) => {
  const {styles} = useStyles(stylesheet);

  if (!isVisible || !storyReactionEmojis || storyReactionEmojis.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {storyReactionEmojis.map((reaction) => (
        <TouchableOpacity
          key={reaction.id}
          style={styles.reactionButton}
          onPress={() => onReaction(reaction.name)}
          activeOpacity={0.7}>
          <Image 
            source={{uri: reaction.image}} 
            style={styles.reactionImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StoryReactions;

const stylesheet = createStyleSheet(theme => ({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  reactionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionImage: {
    width: 24,
    height: 24,
  },
}));
