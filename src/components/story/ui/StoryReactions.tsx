import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {ReactionType} from '../../types/types';

interface StoryReactionsProps {
  onReaction: (reaction: ReactionType) => void;
  isVisible: boolean;
}

const reactions: ReactionType[] = ['❤️', '👏', '👍'];

const StoryReactions: React.FC<StoryReactionsProps> = ({
  onReaction,
  isVisible,
}) => {
  const {styles} = useStyles(stylesheet);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {reactions.map((reaction, index) => (
        <TouchableOpacity
          key={reaction}
          style={styles.reactionButton}
          onPress={() => onReaction(reaction)}
          activeOpacity={0.7}>
          <Text style={styles.reactionEmoji}>{reaction}</Text>
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
  reactionEmoji: {
    fontSize: 24,
  },
}));
